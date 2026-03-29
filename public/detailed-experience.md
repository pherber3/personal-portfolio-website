# Patrick Herbert - Detailed Technical Experience

This document contains in-depth technical details about projects, implementations, and research work. This is used by the AI assistant to answer specific technical questions.

---

## GoHealth | Senior Machine Learning Engineer
*October 2024 - Present | Chicago, IL*

### Real-Time Streaming Transcription System

**Business Impact:** Production transcription backend for live calls. Single-GPU benchmarks: 25 concurrent stereo calls, 261ms avg latency with full fusion, 5.6x faster than NeMo PyTorch end-to-end. Scales horizontally via AWS ECS and ALB across multiple GPU instances. At equivalent call volume, ~9x cheaper than the enterprise alternative.

**Business Context:**
- GoHealth is a tech-enabled services platform helping consumers (especially seniors) identify, compare, and enroll into insurance products like Medicare Advantage, Guaranteed Acceptance life insurance, and Hospital Indemnity
- Sales conversations are highly regulated: representatives must identify as licensed branded agents, obtain consent, conduct needs discovery, provide unbiased comparisons, and walk through enrollment
- Millions of calls flow through the Conversational Intelligence Platform (CIP), where transcription is the foundational input for downstream use cases like Automated Call QA (AQA)
- Transcription errors aren't random — general-purpose models fail consistently on domain-specific vocabulary, and those tend to be exactly the terms compliance scoring depends on

**System Architecture & Model Serving:**
- Designed and built transcription backend API with PyTriton inference + WebSocket orchestration for dev/test
- Async gRPC serving NVIDIA Parakeet TDT v3 (0.6B parameter open-source transducer model)
- Runs on EC2 L40S GPUs, horizontally scalable via AWS ECS with ALB load balancing across multiple GPU instances
- Evaluated 10+ ASR models across latency, cost, and quality
  - Two categories evaluated: "Audio Understanding" models (audio encoders fused with general-purpose LLM decoders) and traditional ASR models purpose-built for STT
  - Audio Understanding models are designed for short clips (<60s), produce no native timestamps, and are larger/slower due to LLM component
  - For hour-long compliance calls needing word-level timing, ASR was the right fit
  - Selected Parakeet over AWS Transcribe and WhisperX for strong baseline accuracy, native word-level timestamps, speed, and extensive customization surface through NeMo

**TensorRT Optimization:**
- Compiled both Conformer encoder (ONNX → TRT FP16, 4 optimization profiles) and LSTM+Joint decoder (single-step TRT engine) to TensorRT
- Achieved 5.6x end-to-end speedup over NeMo PyTorch (411ms → 261ms avg at 25 concurrent calls per GPU with full fusion)
- Compiled the autoregressive decoder as a single-step TRT engine called ~300 times per utterance in a Python loop, sidestepping the data-dependent loop limitation
- Added CUDA event fencing, double-buffered outputs, and encoder pre-projection to eliminate CPU stalls
- Custom-compiled engine with additional optimizations beyond what NVIDIA's NeMo framework provides out of the box

**Performance Under Load:**
- Single-GPU performance at 25 concurrent stereo calls (50 individual audio streams):
  - Median latency dropped by more than half
  - P99 tail latency nearly halved
  - 5.4x lower standard deviation — more consistent response times across streams
- The language model, phrase boosting, and text normalization together account for about a third of total runtime, notable given these are "light" steps relative to the ASR model itself

**VAD & Audio Pipeline:**
- Implemented per-channel Silero VAD with stereo splitting for independent agent/caller transcription
- Tuned VAD parameters (900ms silence threshold, 300ms pre-roll, 0.5s min segment) to optimize segment quality for downstream compliance and agent assist consumers

**Build vs. Buy:**
- Rejected NVIDIA NIM ($1/hr/GPU license) in favor of self-built TRT pipeline behind same gRPC interface
- Result: ~9x cheaper than the enterprise transcription alternative at equivalent scale (~$850/mo vs ~$8,190/mo for 6,600 agent-hours)
- Initially planned to default to the enterprise service for real-time due to infrastructure complexity, but promising initial tests led to building it in-house
- One model, one set of customizations, two serving paths (batch and real-time)

---

### Batch Transcription & Domain Language Model

**Business Impact:** Replaced WhisperX with Parakeet TDT v3 for offline call processing. Achieved parity with the enterprise transcription service on downstream QA task at 275x lower cost. Production transcription time decreased by 73% compared to WhisperX.

**Why WhisperX Was Replaced:**
- WhisperX's hotword customization severely degraded accuracy — not just on boosted terms but across the board
- Boosting caused hallucination and single-word repetition even on segments unrelated to the added terms
- Improving one thing broke many others
- Hit an accuracy ceiling for domain-specific terminology

**Evaluation & Metrics:**
- Standard WER treats all errors equally, but "the" vs "a" is fundamentally different from "Medicare" vs "medical care" for compliance scoring
- This is the classic flaw from Anscombe's Quartet: summary statistics hide the true shape of the data
- Two models at 10% WER might disagree on completely different words
- A model that improves from 10% to 8% WER hasn't necessarily kept all old correct transcriptions plus gotten more right — it may have traded accuracy on critical segments for gains elsewhere
- Built comprehensive ASR comparison framework evaluating:
  - **WER:** Standard word error rate
  - **Content WER:** Strips out differences in audio sensitivity (one model transcribing background noise another ignores, or missing quiet speech). Isolates how well each model transcribes audio they both heard, while highlighting common failure modes
  - **Rare Word WER:** Performance on domain-critical vocabulary
  - **BERTScore:** Semantic similarity between transcriptions
  - **Domain Keyword Accuracy:** Accuracy on specific insurance terms
- Reference standard was an enterprise transcription service with its own customization features enabled to ensure fairness (WER is technically agreement with this model, not manually transcribed ground truths)

**Substitution Analysis:**
- WhisperX's most common errors were domain-critical deletions: "copay" → "pay," "healthcare" → "care"
- Parakeet's top mismatches were more benign
- Text normalization applied to account for surface-level formatting differences (e.g., "health care" normalized to "healthcare")
- Out of the box, Parakeet was outperformed by WhisperX across all metrics
- After customization, Parakeet was winning on the metrics that mattered: keyword accuracy, content accuracy on overlapping segments, and semantic similarity, while remaining comparable on overall WER

**AQA Validation:**
- Ran AQA tool on transcripts from enterprise reference model and customized Parakeet, comparing to historic WhisperX results
- On one compliance check specifically related to wording: agreement with human evaluators went from 66.7% with WhisperX to 91.7% with customized Parakeet, matching the enterprise model's results exactly
- Across all checks aggregated: customized Parakeet delivered 6-7% lift in agreement over WhisperX and was within error of the enterprise model
- Overall: achieved 91% agreement with human QA graders (parity with enterprise at 91%), with branding/title check accuracy at 90% vs. WhisperX's 63%

**Data Curation Pipeline:**
- Built corpus extraction pipeline from existing VTT files (stripping timestamps, speaker labels, filtering fillers while preserving affirmatives)
- Combined with manually cleaned domain text and synthetic phrases for insurance vocabulary
- Designed tiered scaling strategy with QA-mismatch-driven call selection for corpus expansion
- High-yield samples of problematic calls specifically selected to serve as fine-tuning starting point if needed

**KenLM Domain Language Model:**
- Trained 6-gram KenLM language model on ~8,900 utterances of curated domain text
- Integrated via shallow fusion into both NeMo native decoder and custom TRT decode loop
- Combined with GPU phrase boosting for insurance terms
- Added WFST inverse text normalization for written-form output
- Reduced overall WER from 18.3% to 16.2% (11.5% relative improvement)

**Customization Philosophy:**
- Same principle as LLMs: try lighter-weight customizations before fine-tuning
- Decode-time approach (language model fusion + phrase boosting) hit performance targets with significantly less development overhead
- Keeps system decoupled from any specific model version as the field moves quickly
- Deploying a separate configuration for different product lines (Medicare Advantage vs GA life insurance) is just swapping a corpus and retraining the small language model
- Fine-tuning would be harder to scale to additional product lines and terminologies
- Pipeline built to easily extend to fine-tuning if needed, but decode-time approach solved the problem well enough

**What's Next:**
- Language model corpus intentionally small today — expanding it is most direct path to further accuracy gains
- Rare word accuracy, particularly prescription drug names, is where enterprise model still has clearest edge
- Production rollout uses configurable routing to gradually shift traffic while monitoring quality
- Metrics optimized for will evolve alongside new compliance use cases

---

### Voice AI Agent with Latency Optimization

**Business Impact:** Identified agents spending significant time on routine support (1,000+ voicemails/2 weeks for 66 agents). Built AI voice agent from business case through production deployment. Reduced human-required support requests by 70% and first-word latency by 85% via ONNX/TensorRT optimization of the speech pipeline.

**Technical Architecture:**

**Speech-to-Text (STT):**
- **Primary Solution: pywhispercpp**
  - Python bindings for whisper.cpp (C++ implementation of OpenAI Whisper)
  - Chosen for CPU-only inference capability (no GPU required)
  - Optimized for edge deployment on agent laptops
- **Later Experimentation: NVIDIA Parakeet**
  - Converted Parakeet model to ONNX format
  - Used TensorRT for GPU-accelerated inference
  - Provided alternative for higher-performance scenarios

**Text-to-Speech (TTS):**
- **Kokoro TTS Model**
  - Lightweight neural TTS model
  - Best performance-to-resource ratio for use case
  - Natural-sounding synthesis suitable for customer conversations

**Streaming Architecture (Producer-Consumer Pattern):**
1. **Text Streaming from LLM:**
   - LLM (AWS Bedrock) streams response tokens in real-time
   - Don't wait for complete response before starting TTS
2. **Balanced Chunk Processing:**
   - Buffer incoming text into chunks of optimal size
   - Chunks large enough for natural prosody (TTS needs context)
   - Chunks small enough to minimize latency
3. **Concurrent Processing:**
   - While TTS synthesizes and plays current chunk, next chunk is being prepared
   - Pipeline parallelism: generation → synthesis → playback happen simultaneously
   - Seamless audio output without gaps

**Model Optimization:**
- **ONNX Conversion:** PyTorch → ONNX format for both Whisper and TTS models
- **Quantization:** INT8 quantization for reduced memory and faster inference
- **TensorRT Optimization:** ONNX → TensorRT engines with layer fusion and kernel optimization

**Deployment:**
- Edge deployment on standard business laptops (sub-4GB memory footprint)
- No powerful hardware required
- Performs well despite limited resources

---

### Production Payment Prediction System

**Business Impact:** Improved successful payment rates from 47% to 59% (25% relative improvement)

**Technical Implementation:**

**Model Selection Process:**
- Extensive experimentation with multiple approaches:
  - Deep learning models from [DeepTabular](https://github.com/OpenTabular/DeepTabular) including TabNet, FT-Transformer, SAINT, etc.
  - Traditional ML: Logistic Regression, XGBoost, LightGBM, CatBoost
- **Winner: Logistic Regression**
  - Counterintuitive result - simpler model outperformed complex deep learning
  - Reason: Data was too noisy for deep learning to find meaningful patterns
  - Linear assumptions matched the actual data structure

**Key Features & Insights:**
- **Age:** The dominant predictor - almost perfectly linear correlation with payment success
  - Older customers significantly more likely to complete payment
  - Trade-off: Older customers also less likely to convert initially
  - Balancing conversion probability vs payment probability was critical
- **Payment Timing:** Relationship between payment date and social security check deposit dates
  - Customers more likely to pay when funds available
  - Temporal feature engineering captured this pattern
- **Why Logistic Regression Won:**
  - Strongest signal (age) was nearly linear
  - Other models (XGBoost, deep learning) tried to learn complex interactions that didn't exist
  - They essentially tried to mimic the linear relationship but added unnecessary complexity
  - Simpler model = better generalization on noisy data

**Deployment & Infrastructure:**
- Deployed on AWS SageMaker
- A/B testing: Simple 50/50 traffic split between control and treatment
- Real-time inference integrated with lead queue system
- MLflow for model versioning and deployment management

**Model Monitoring & Retraining:**
- Custom dashboards tracking model performance metrics
- Key decision: Determining training data time window
  - Applied exponential decay to historical data (recent data weighted more heavily)
  - Balanced recency vs sufficient data volume
- Retraining analysis focused on optimal lookback period and decay parameters
- MLflow handled model versioning and production deployment

---

### Automated Quality Assurance at Scale

**Business Impact:** Designed serverless LLM-based compliance system (AWS Lambda) achieving 99% call coverage, navigating model cost/accuracy tradeoffs with structured YAML output for token efficiency. Built layered error taxonomy and confidence prediction model.

**Technical Stack:**

**Speech-to-Text:**
- **faster-whisper with turbo variant**
  - CTranslate2-based implementation (faster than vanilla Whisper)
  - Turbo model: latest fast variant optimized for speed
  - Better performance than base Whisper implementations

**LLM Compliance Scoring:**
- **Model Selection: Llama 3.2 90B**
  - Budget-conscious choice (~$0.05 per transcript for full checklist)
  - Claude or GPT-4 would be better but significantly more expensive
  - Trade-off: cost vs accuracy
- **Structured Output:** YAML format for token efficiency over JSON
- **Layered Error Taxonomy:** Hierarchical classification of compliance violations
- **Confidence Prediction Model:** Calibrated confidence scores for each compliance check
- **Prompt Engineering Challenges:**
  - Translating human-designed rubrics into LLM instructions
  - Few-shot examples of expected behavior
  - Optimizing context retrieval from transcripts (relevant excerpts, not full transcript)
  - **Attempted Advanced Techniques:**
    - DSPy for prompt optimization
    - Evolutionary algorithms (GEPA - Genetic Programming for Prompts)
    - Neither showed improvement for this specific use case
  - **Key Consideration:** Prompt brittleness across models
    - Prompts optimized for one LLM don't transfer well to others
    - Important when designing production systems (vendor lock-in risk)

**Architecture:**
- **Lambda-based Serverless Processing:**
  - Collaboration with another team on Lambda infrastructure
  - Triggered overnight after sales calls and transcription completion
  - Processes each call through compliance checklist
  - Scalable to handle peak season volume (99% of calls)

**Monitoring & Alerting:**
- Real-time alerts for critical compliance violations
- Aggregated reporting for management dashboards
- Quality metrics tracked over time

---

### Multi-Objective Optimization System

**Business Impact:** Replaced intractable discrete search (10¹⁹ parameter space) with differentiable optimization using Plackett-Luce ranking model and PPO-style trust regions, achieving 3-5% top-3 plan sales improvement with 11x training speedup.

**Problem Statement:**
- Ranking Medicare Advantage plans for consumers based on needs and preferences
- Multiple competing objectives that aren't easily combined into single metric
- Original discrete search space of 10¹⁹ configurations was intractable

**Competing Objectives:**
1. **Reciprocal Rank (RR):** Whether plan was actually chosen/sold by agent
   - Supervised signal from historical sales
   - Business-critical: recommend plans that actually sell
2. **Rank-Biased Overlap (RBO):** Consumer-agnostic plan quality score
   - Objective measure of plan quality (coverage, cost, etc.)
   - Independent of what historically sold
   - Ensures recommendations are genuinely good, not just familiar to agents

**Phase 1: Evolutionary Algorithms**
- **Framework:** pymoo (Python Multi-objective Optimization)
- **Algorithms:** NSGA-II/III family
- **Parallelization:**
  - Custom parallel programming (not Ray - correction from earlier)
  - Distributed evaluation of candidate solutions
  - 11x speedup through parallelization
- **Alternative Approach Tried:** Empirical reservoir sampling

**Phase 2: Differentiable Optimization**

**Challenge:** Ranking metrics are non-differentiable
- Sorting is discrete operation (can't backpropagate through rankings)
- Need continuous approximation for gradient-based optimization

**Solution: Plackett-Luce Model**

The Plackett-Luce model converts scores to ranking probabilities using softmax:

**Core Principle:**
- Items with higher scores exponentially more likely to be selected
- Temperature parameter τ controls distribution sharpness

**Probability that item i ranks first:**
```
P(rank_1 = i) = exp(s_i/τ) / Σⱼ exp(s_j/τ)
```

**Differentiable Reciprocal Rank Loss:**
```
L_RR = -log[exp(s_chosen/τ) / Σᵢ exp(s_i/τ)]
```
- Minimized when chosen plan has highest score
- Naturally encourages ranking sold plans highly
- Fully differentiable - can use gradient descent

**Differentiable RBO Loss (ListNet Approach):**

**Key Insight from ListNet (Cao et al., 2007):**
- Instead of "is item A ranked at position 3?"
- Ask "what's probability item A appears in top 3?"
- Transforms discrete ranking → continuous distribution matching

**RBO with Geometric Decay:**
```
L_RBO = Σₐ p^(d-1) · KL_divergence(π_baseline^(d) || π_model^(d))
```

Where position probabilities use Plackett-Luce recursively:
```
P(pos_d = i | previous) = exp(s_i/τ) / Σⱼ∈remaining exp(s_j/τ)
```

**Combined Objective:**
```
L(w) = (1/N) Σₖ [α·L_RR + (1-α)·L_RBO] + β·||w - w₀||²
```

Components:
- **α ∈ [0,1]:** Balance between RR and RBO objectives
- **β:** Regularization strength (don't stray too far from starting point w₀)
- **w₀:** Initial weights from current best empirical solution

**PPO-Style Trust Regions:**
- Regularization term β·||w - w₀||² acts as a trust region, similar to PPO's clipping mechanism
- Prevents catastrophic policy updates — new rankings stay close to validated solutions
- Enables safe incremental improvement over production baseline

**Why This Works:**
- Converts hard discrete rankings into soft probabilistic rankings
- Smooth, differentiable objective enables gradient-based optimization
- Can use standard optimizers (AdamW) instead of evolutionary search
- Faster convergence and better local refinement

---

### RAG Infrastructure for Insurance Plan Documentation

**Performance Metrics (v1):** Sub-second response time (p95 < 800ms), 0.91 MRR@10
**Performance Metrics (v2 — Agentic Rewrite):** 2x+ improvement across groundedness, accuracy, relevance, and harder multi-hop questions

#### V1: Traditional RAG Pipeline

**Document Processing:**
- Used pdfplumber to extract text from insurance PDFs (Evidence of Coverage / EOC documents)
- Extraction was often messy — complex nested tables, multi-page sections, formatting artifacts
- Chunked extracted text and embedded with Amazon Titan Text Embeddings
- Stored in Redis Vector Database for similarity search

**Retrieval:**
- Hybrid BM25 + dense embedding search (LangChain's BM25Retriever)
- Cross-encoder reranking: broad recall (~100 candidates) → precision reranking to top 10
- Returned top 3 relevant chunks to LLM for answer generation

**Limitations of V1:**
- Top-k chunk retrieval fundamentally limited for interconnected insurance documents
- EOC documents have deeply cross-referenced eligibility logic: "you qualify for X if Y, and Y is true if you have Z conditions"
- Retrieving 3 isolated chunks often missed these dependency chains
- pdfplumber struggled with nested tables and complex PDF layouts, introducing extraction errors before retrieval even began

#### V2: Agentic RAG with OCR-to-Markdown Pipeline

**OCR Model & Document Parsing:**
- Replaced pdfplumber with a vision-language OCR model from **LightOn**
- Contributed directly to the model's training direction: provided extensive examples of failure modes from current OCR models on insurance PDFs, EOCs, and documents with nested tables
- Result: a model that accurately handles nested tables, multi-page table splits, and complex insurance document formatting
- Output: clean markdown representations of entire documents, preserving structure and cross-references
- No more vector store needed — documents are now markdown text that the agent can read directly

**OCR Optimization Pipeline:**
- Wrote optimization pipeline to run the OCR model efficiently on both MLX (Apple Silicon) and A100 GPUs
- **MLX optimization:**
  - Original: ~2 hours for a ~200-page PDF
  - Optimized with 4-bit quantization, reduced scale, parallel workers: **~7 minutes** with no practical quality loss
  - Attempted batched vision embedding support (not very effective) and hit MLX limitations (no paged attention)
  - Quality impact of 4-bit quant was limited to cosmetic issues (bolding, heading levels, table of contents formatting) — actual content accuracy on eval questions was unchanged
- **A100 optimization:** ~45 seconds for ~200-page documents at full precision
- **MLX 4-bit vs A100 full precision comparison (214 pages):**
  - Character similarity: 94.05%
  - Word similarity: 97.1%
  - Line similarity: 76.8%
  - MLX 4-bit was actually ~1-2 minutes faster than full precision + full scale on A100
- Post-processing step connects tables that were split across multiple pages at lookup time

**Agentic RAG Architecture:**
- Custom lightweight agent loop (no framework overhead like LangGraph)
- Instead of retrieving top-k chunks, the agent intelligently searches through the markdown documents
- Agent follows cross-references and conditional logic chains in EOC documents (e.g., eligibility criteria that depend on other sections)
- Produces more thorough, grounded responses by traversing the interconnected structure of the documentation

**Results:**
- 2x+ improvement over V1 across all evaluation metrics: groundedness, accuracy, relevance, performance on harder multi-hop questions, and response thoroughness
- Trade-off: slower than V1 (agent reasoning takes more time), but latency is still manageable for real-time audio and voice agent integration
- Being integrated into the IVA (Interactive Voice Agent) to expand its capability for customer service interactions — same voice agent platform, now with access to accurate plan documentation

---

### Graph-Based AI Integration (MCP Server)

**Purpose:** Enable AI agents to query knowledge graphs and internal APIs

**MCP (Model Context Protocol):**
- Anthropic's protocol for connecting AI agents to external data sources
- Provides tools/functions that LLMs can invoke during conversation

**Neo4j Schema:**
- **Node Types:** Plans, Benefits, Providers, Members, Prescriptions, Coverage
- **Relationships:**
  - Plans -[COVERS]-> Benefits
  - Plans -[INCLUDES]-> Providers
  - Plans -[COVERS]-> Prescriptions
  - Members -[HAS_PLAN]-> Plans
  - Various coverage and network relationships

**Natural Language to Cypher Translation:**
- **Likely Approach:** LLM-based translation with templates
  - Common query patterns converted to Cypher templates
  - LLM fills in parameters from natural language
  - Validation and sanitization before execution
- **Safety:**
  - Read-only access
  - Query complexity limits (prevent expensive queries)
  - Query result caching for performance

**APIs Exposed Through MCP:**
1. **RAG API:** Query insurance plan documentation
   - Agent can ask questions about plan details
   - Retrieves relevant excerpts and answers
2. **Prescription Coverage API:** Check medication coverage
   - Query whether specific drugs covered under plan
   - Formulary tier information, copay details
3. **Provider Network API:** Check provider coverage
   - Whether specific doctors/hospitals in network
   - Network tier (in-network, out-of-network)

**Use Cases:**
- Complex multi-hop queries: "Find plans covering Drug X with Provider Y in network"
- Real-time decision support combining graph + documentation
- Agent explores graph structure for comprehensive answers

**Technical Stack:**
- Python MCP SDK (Anthropic)
- Neo4j Python driver
- WebSocket communication with Claude
- Async operations for concurrent API calls

---

### ML Data Infrastructure

**Scale:** Managing features for millions of leads, 1000+ features

**Feature Store Architecture:**

**Databricks Medallion Architecture:**
- **Bronze Layer:** Raw ingested data
- **Silver Layer:** Cleaned and validated
- **Gold Layer:** Feature-engineered, analysis-ready

**Collaborative Feature Store:**
- Shared feature table across teams
- Various teams contribute engineered features
- All teams can consume features from central store
- Reduces redundant computation and ensures consistency

**Real-time vs Batch Features:**
- **Batch Features:** Historical aggregations, complex computations
- **Real-time Features:** Low-latency requirements for inference
- (Specific split details not fully defined - evolving system)

**Data Quality Monitoring:**
- **Population Stability Index (PSI):** Detect distribution drift
- **Standard Checks:**
  - Schema validation
  - Null rates, cardinality, range checks
  - Statistical distribution monitoring
- **Alerting:** Automated alerts when drift or quality issues detected

**AI-Powered Analytics:**
- **Databricks Genie Integration:**
  - Natural language queries to SQL (Genie is Databricks' NL-to-SQL tool)
  - Annotated tables with metadata for better query understanding
  - Enables less-technical stakeholders to query data
  - Generates dashboards from natural language requests
- **Custom AI Queries:**
  - Wrote queries leveraging Databricks AI functions
  - Automated insights and anomaly detection

**Governance:**
- Unity Catalog for data governance
- Access control and audit logging
- Feature lineage tracking

---

## Independent Research & Personal Projects

### Multi-Modal Auto-Dubbing Pipeline — Personal Project

**Overview:** End-to-end pipeline translating foreign-language video to dubbed English with voice cloning and synchronized audio replacement.

**Multi-Model Pipeline:**
- **Mel-RoFormer:** Vocal/background source separation — isolates speech from background audio
- **Microsoft VibeVoice:** Joint transcription + diarization of the separated vocal track
- **TranslateGemma 12B:** Translation of transcribed text from source language to English
- **Qwen3-TTS:** Voice cloning from reference clips — synthesizes English speech in the original speaker's voice
- **Timing Synchronization:** Handles alignment of dubbed audio with original video pacing to maintain lip-sync plausibility

**Technical Challenges:**
- Chaining multiple models with different input/output formats
- Managing audio quality through the separation → transcription → synthesis pipeline
- Synchronizing dubbed audio timing with original video without visual artifacts
- Voice cloning quality depends heavily on reference clip selection and length

---

### Unified Dual-Stream Speech Encoder — Independent Research (WIP)

**Overview:** Novel architecture jointly capturing semantics and prosody from a single FastConformer backbone for emotion-conditioned speech retrieval. Sub-1B parameters targeting edge deployment.

**Architecture Design:**
- Dual-stream split at ~70% encoder depth:
  - **Content stream (H_c):** ASR-grade transcription capability
  - **Prosody stream (H_p):** Emotion/paralinguistic features
- **ColBERT-style multi-vector retrieval head** enabling queries like "find angry customer calls about refunds"
- Single backbone avoids the cost of running separate ASR and emotion models

**Phased Training & Distillation:**
- Validated three hypotheses empirically before committing to architecture:
  1. **Frozen probe emotion encoding:** 61-66% unweighted accuracy (UA) from frozen encoder features — enough signal exists
  2. **Depth-wise signal separation:** Content and prosody information concentrate at different encoder depths
  3. **Untrained MaxSim retrievability:** ColBERT-style retrieval works even before fine-tuning the retrieval head
- **Distillation sources:**
  - **Qwen3-Omni** for semantic targets
  - **emotion2vec** for prosody targets
- **Current Results:**
  - SER (Speech Emotion Recognition) UA: 72.0% on IEMOCAP, well above 55% target
  - No ASR degradation from the dual-stream split

---

### BM-ALS: Data-Driven Tensor Decomposition

**Overview:** Novel tensor decomposition algorithm: BM-ALS (Bhattacharya-Mesner Alternating Least Squares) operating in Bhattacharya-Mesner Hypermatrix Algebra Space.

**Key Results:**
- JAX implementation for GPU-accelerated tensor operations
- Outperforms Tucker and CP decomposition by 2-30x across:
  - Synthetic benchmark tensors
  - Physics tensors (MuJoCo simulation data)
  - GPT-2 attention composition tensors
- Paper under review

**Technical Approach:**
- Leverages hypermatrix algebra structure for more expressive decompositions
- Data-driven: learns decomposition structure from the tensor itself rather than imposing fixed rank/structure
- ALS (Alternating Least Squares) optimization with convergence guarantees

---

### CoT Activation Scaffolding

**Overview:** Developed theory and ran behavioral experiments showing chain-of-thought tokens function as activation scaffolding rather than faithful reasoning traces.

**Key Findings:**
- Chain-of-thought (CoT) tokens serve as intermediate computational scaffolding
- The tokens provide activation space for the model to perform multi-step computation, but do not necessarily represent the model's "true" reasoning process
- Mechanistic validation planned via Gemma Scope transcoders to trace how CoT tokens influence internal representations

**Implications:**
- Challenges the common assumption that CoT outputs are faithful explanations of model reasoning
- Suggests CoT is more about providing computational workspace than transparent reasoning
- Has implications for interpretability and alignment research

---

## Johns Hopkins Wilmer Eye Institute | Machine Learning Researcher
*May 2021 - Present | Baltimore, MD*

12 publications in top ophthalmology journals. ICML 2023 workshop presentation. Fine-tuned BERT, Llama, and Qwen with LoRA/PEFT for clinical entity extraction (0.96 AUC). Fine-tuned SAM foundation model for automated retinal segmentation (Dice 0.88).

### Novel Transformer Architecture for Glaucoma Progression

**Research Impact:** 0.74 → 0.97 AUC for predicting rapid glaucoma worsening. 12 publications, ICML 2023 workshop presentation.

**Problem Statement:**
- Predict future rapid glaucoma progression using multimodal clinical data
- Challenges:
  - Irregular temporal sampling (patients visit at arbitrary intervals)
  - Variable-length sequences (different visit counts per patient)
  - Missing data (not all tests at every visit)
  - Multiple modalities: 1D tables, 2D images, 3D volumes

**Handling Irregular Temporal Sampling:**

**Neural Ordinary Differential Equations (Neural ODEs) for Time Embeddings:**
- Standard transformers assume regular time intervals (position 1, 2, 3...)
- Medical data: visits at arbitrary times (day 0, day 45, day 180, etc.)
- **Solution:** Neural ODE embeddings
  - Simulate disease progression as continuous dynamic system
  - Learn temporal embeddings that evolve continuously
  - Captures disease trajectory between sparse observations
- **Time Normalization:** "Time since first test"
  - Standardizes all patients to common baseline
  - Enables comparison across different disease stages
  - Relative time more informative than absolute dates

**Multimodal Fusion:**

**Data Modalities:**
1. **1D Tabular:** Clinical measurements (intraocular pressure, age, medications)
2. **2D Images:** Visual field tests (24-2 grayscale heatmaps)
3. **3D Volumes:** OCT imaging (retinal layer thickness maps)

**Fusion Strategy - Dimension Reduction to Shared Latent Space:**
1. **Modality-Specific Encoders:**
   - 1D: Linear layers → latent vector
   - 2D: CNN or vision transformer → latent vector
   - 3D: 3D CNN with dimension reduction → latent vector
2. **Alignment to Common Dimension:**
   - All modalities projected to same latent dimension (e.g., 512-d)
3. **Fusion:** Simple summation of latent vectors
   - Element-wise addition of aligned embeddings
   - Allows model to learn complementary information

**Gated Architectures Tried:**
- Experimented with learnable gates to weight modalities
- No significant improvement over summation
- Simpler approach preferred

**Future Direction - Joint Embedding Models:**
- Next research iteration: contrastive learning across modalities
- Goal: Make embeddings as similar as possible across modalities
- Inspired by CLIP-style multimodal alignment
- Should improve fusion and handle missing modalities better

**ModernBERT Innovations Implemented:**
- **Pre-LayerNorm:** Normalization before attention (not after)
  - Stabilizes training, enables deeper networks
- **SwiGLU Activation:** Swish-Gated Linear Unit
  - Replaces ReLU/GELU
  - Better performance in many transformer applications
- **Unpadding & Sequence Packing:**
  - Remove padding tokens to save computation
  - Pack multiple sequences into single batch efficiently
  - Critical for variable-length patient sequences
- Many other innovations (too many to recall off-hand)

**FlashAttention:**
- Used the FlashAttention library (not custom CUDA)
- Memory-efficient attention computation
- Enables longer context (more historical visits)
- IO-aware algorithm reducing memory bandwidth

**Training Setup:**
- **Dataset:** ~25,000 individual patients
  - 7-50 tests per patient (highly variable)
  - Longitudinal data spanning years
- **Hardware:** 1-4 NVIDIA A100 GPUs
  - Scaled based on model size and batch size
- **Training Time:** ~1 day
  - Varies with hyperparameters, model capacity
- **Framework:** PyTorch with DistributedDataParallel for multi-GPU

**Architecture Details:**
- Specific layer counts, attention heads, dimensions not recalled
  - Not critical to remember exact numbers
  - Typical transformer architecture in 100M-1B parameter range
- Work in progress: still iterating and improving

---

### Production LLM System for Clinical Notes

**Task:** Extract structured information from unstructured clinical notes

**Performance:** 0.96 AUC, deployed on Azure for PHI-compliant production use

**Classification Tasks:**

1. **Multi-class Classification:**
   - Identify which medications and surgeries being added in note
   - Multiple possible treatments mentioned per note

2. **Information Extraction:**
   - Extract maximum and target IOP (intraocular pressure) values
   - Extract surgeries performed with dates
   - Structured output from free-text notes

**Model Evolution:**
- **ClinicalBERT:** Pre-trained on clinical text
- **PubMedBERT:** Pre-trained on biomedical literature
- **Llama 3.1:** General-purpose LLM, fine-tuned
- **Llama 3.2:** Improved version
- **Qwen 2.5:** Strong medical performance
- **Qwen 3 8B:** Final production model by project end
  - Best balance of accuracy and efficiency

**Fine-tuning Approach:**

**Data Efficiency with Active Learning:**
1. **Initial Dataset:** ~100 manually annotated examples
   - Expensive: requires physician time
2. **Uncertainty-based Sampling:**
   - Monte Carlo Dropout for uncertainty estimation
   - Identify 100 most uncertain predictions
   - Annotate these high-value examples next
   - Maximizes label efficiency (get most info per annotation)
3. **Iterative Process:** Repeat until performance plateaus

**LoRA Fine-tuning:**
- **Library:** BitsAndBytes initially
  - Handles quantization + LoRA
  - 4-bit/8-bit quantization for memory efficiency
- **Current Recommendation:** Unsloth
  - Faster training, better memory efficiency
  - Would use for new projects

**Azure Deployment:**
- **Service:** Azure ML Managed Endpoints
  - Deployed model as RESTful API
  - Input: clinical note text
  - Output: extracted structured information
- **PHI Compliance:**
  - HIPAA-compliant infrastructure
  - Encryption, access controls, audit logging
  - Protected health information handled securely

---

### Computer Vision Pipeline for Medical Imaging

**Task:** Automated segmentation and measurement of retinal structures

**Segmentation Performance:** Dice coefficient 0.88

**Model:**
- **DinoV2 SAM** (Segment Anything Model variant)
  - Foundation model with DinoV2 image encoder
  - SAM decoder for segmentation masks

**Fine-tuning Process:**
1. **Manual Annotation:**
   - 500 3D OCT scans annotated
   - Highlighted retinal nerve fiber layer (RNFL) in each scan
   - Labor-intensive but creates high-quality ground truth
2. **Mask Generation:**
   - Convert annotations to binary segmentation masks
   - 3D volumes with per-voxel labels
3. **Fine-tuning:**
   - Train SAM on medical imaging domain
   - Dice loss + cross-entropy
   - Data augmentation critical for generalization

**Novel Linear Algebra Algorithms for Thickness Computation:**

**Problem with Standard Methods:**
- Standard RNFL thickness measurements have systematic biases
- **Root Cause:** Based on Icelandic population norms
  - Very homogeneous population
  - Doesn't generalize to other races/ethnicities
  - Leads to misdiagnosis in diverse populations

**Custom Thickness Algorithm:**
1. **Find Optic Nerve Head (ONH) Center:**
   - From segmented RNFL edges
   - Linear algebra to compute geometric center
   - Accounts for anatomical variations
2. **Ellipse Fitting:**
   - ONH is elliptical, not circular (standard methods assume circular)
   - Fit ellipse to ONH boundary
   - Correct for angles and orientation
3. **Perpendicular Thickness Measurement:**
   - Draw perpendicular lines through segmentation masks
   - Measure RNFL thickness along these perpendiculars (not just vertical)
   - Accounts for retinal curvature
4. **Convert to Micrometers:**
   - Pixel/voxel overlap along perpendicular → physical thickness
   - Calibration from scan metadata

**Impact:**
- More accurate thickness measurements across diverse populations
- Reduces racial bias in glaucoma detection
- Better clinical decision support

---

### Large-Scale Data Management (10TB+)

**Challenge:** Manage massive longitudinal medical dataset supporting multiple research projects

**Scale:**
- 10+ terabytes of data
- Multiple modalities: imaging, tabular, time-series
- Multiple concurrent research projects

**Tools & Infrastructure:**

**Primary Stack:**
- **Databricks:** Main data processing and analytics platform
  - Spark for distributed processing
  - SQL for exploratory analysis
  - Delta Lake for ACID transactions
- **DuckDB:** In-process SQL database
  - Fast analytics on local data
  - Good for prototyping and smaller queries
- **SQLite:** Lightweight embedded database
  - Portable data storage
  - Easy sharing of analysis-ready datasets

**Data Processing:**
- "Lots of data processing for anyone who asked"
- Support multiple research teams with different needs
- Custom ETL pipelines for various projects

**Image Storage:**
- **Challenge:** Terabytes of medical imaging (OCT scans, visual fields)
- **Solution:** High-performance cluster storage
  - Collaboration with IT team
  - Set up large-capacity storage arrays
  - Optimized for medical imaging I/O patterns (large sequential reads)

**Data Management:**
- Version control for datasets (reproducibility)
- Access control (HIPAA compliance)
- Backup and disaster recovery
- Documentation and metadata

---

## Johns Hopkins University | Research Assistant
*May 2019 - December 2021 | Baltimore, MD*

### Quantitative Finance & Neural Network Optimization

**Note:** These projects were several years ago; details less clear in memory

**Quantitative Finance Research:**
- Led team developing neural networks for S&P 500 return forecasting
- 94 stock characteristics as features
- Various neural network architectures explored
- Advanced feature selection techniques
- Results not recalled in detail

**MILP Optimization Research:**
- **Solver:** Gurobi (academic license)
- **Network Size:** Mid-sized neural networks
  - Not massive (MILP doesn't scale to very large networks)
  - Likely hundreds to low thousands of parameters
  - Much smaller than modern deep learning

**Adversarial Robustness & Pruning:**
- **Task:** Find minimum perturbation to misclassify MNIST images
- **Key Discovery:** Pruned networks more robust
  - Pruned network: 139 adversarial examples found
  - Full network: 148 adversarial examples found
  - Counterintuitive: smaller network harder to fool
- **Explanation:** Over-parameterization can hurt robustness
  - More parameters → more complex decision boundaries
  - Complex boundaries → more vulnerable to adversarial perturbations
  - Pruning acts as regularization

**MILP Formulation:**
- Encode neural network as mixed-integer constraints
- Binary variables for ReLU activations (on/off)
- Optimization objective: minimize perturbation subject to misclassification
- Exact optimization (not heuristic)

---

## Additional Technical Context

### Speech & Audio:
- **ASR:** Parakeet TDT v3, Whisper/WhisperX, AWS Transcribe, faster-whisper
- **TTS:** Qwen3-TTS, Kokoro TTS, ONNX-optimized speech synthesis
- **VAD:** Silero VAD with stereo splitting
- **Diarization:** Microsoft VibeVoice
- **Source Separation:** Mel-RoFormer
- **Language Models:** KenLM n-gram LMs, phrase boosting, shallow fusion
- **Frameworks:** NVIDIA NeMo toolkit
- **Evaluation:** Custom WER variants (content WER, rare word WER), BERTScore, domain keyword accuracy

### Model Optimization & Serving:
- **TensorRT:** ONNX export, FP16 engine compilation, multi-profile optimization, single-step decoder engines
- **ONNX Runtime:** Model conversion, INT8 quantization
- **Serving:** PyTriton, Triton Inference Server, dynamic batching, async gRPC
- **AWS:** SageMaker Inference Components, EC2 GPU instances
- **Techniques:** CUDA event fencing, double-buffered outputs, encoder pre-projection

### Core ML & Training:
- **PyTorch:** Custom architectures, distributed training with FSDP
- **JAX:** Tensor decomposition research (BM-ALS)
- **TensorFlow:** Legacy experience
- **Fine-tuning:** LoRA/PEFT, GRPO/PPO alignment
- **Attention:** FlashAttention, efficient attention mechanisms
- **Languages:** Python (expert), C++ (optimization)

### Programming Languages & Tools:
- **Python:** Expert level - primary language for all ML work
- **C++:** Optimization and performance-critical code
- **SQL:** Advanced - data analysis, feature engineering

### Infrastructure:
- **AWS:** SageMaker, Lambda, Bedrock, S3, EC2
- **Azure:** ML endpoints, HIPAA-compliant deployment
- **Databricks:** Feature stores, distributed processing
- **Docker:** Containerization
- **GCP:** Cloud services
- **Data Pipelines:** Spark/PySpark, Pandas, Polars

### Deep Learning Expertise:
- Custom transformer architectures
- Multi-modal learning and fusion
- Temporal modeling (irregular time series, Neural ODEs)
- FlashAttention and efficient attention mechanisms
- LoRA/PEFT fine-tuning
- Dual-stream encoder architectures
- ColBERT-style multi-vector retrieval
- Knowledge distillation

### Optimization:
- MILP with Gurobi
- Evolutionary algorithms (NSGA-II/III, pymoo)
- Differentiable ranking (Plackett-Luce, ListNet)
- PPO-style trust regions
- Multi-objective optimization

### Production ML:
- A/B testing and experimentation
- Model monitoring and drift detection
- Real-time inference pipelines (streaming transcription, voice AI)
- Edge deployment and optimization
- MLOps and deployment best practices
- Build vs. buy analysis (cost modeling, infrastructure decisions)

### Domain Expertise:
- Speech & Audio AI (ASR, TTS, VAD, diarization, source separation)
- Healthcare AI (clinical decision support, medical imaging)
- Insurance/Medicare (plan recommendation, compliance, transcription)
- Quantitative finance (return forecasting, portfolio optimization)
- Production systems at scale

