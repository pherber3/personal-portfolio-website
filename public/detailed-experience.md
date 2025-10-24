# Patrick Herbert - Detailed Technical Experience

This document contains in-depth technical details about projects, implementations, and research work. This is used by the AI assistant to answer specific technical questions.

---

## GoHealth | Senior Machine Learning Engineer
*October 2024 - Present | Chicago, IL*

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

### Real-Time Voice AI Platform

**Business Impact:** Reduced first-word response latency by 85% (from 5-7 seconds to sub-second)

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
- **ONNX Conversion:**
  - Used ONNX Python library for model export
  - Standard conversion from PyTorch → ONNX format
- **Quantization:**
  - INT8 quantization for reduced memory and faster inference
  - Applied to both Whisper and TTS models
  - ONNX runtime handles quantization natively
- **TensorRT Optimization:**
  - Converted ONNX models to TensorRT engines (for GPU path)
  - Layer fusion and kernel optimization
  - Further latency reduction

**Deployment:**
- **Edge Deployment:** Runs locally on sales agents' laptops
  - No powerful hardware - standard business laptops
  - Performs well despite limited resources
  - Sub-4GB memory footprint critical for this constraint
- **Future Considerations:** Potential cloud migration if more capability needed

---

### Automated Quality Assurance at Scale

**Business Impact:** Processing 99% of call transcripts during peak season with automated compliance monitoring

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

**Business Impact:** 3-5% improvement in top 3 ranked sold plans, 11x training time reduction

**Problem Statement:**
- Ranking Medicare Advantage plans for consumers based on needs and preferences
- Multiple competing objectives that aren't easily combined into single metric

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

**Why This Works:**
- Converts hard discrete rankings into soft probabilistic rankings
- Smooth, differentiable objective enables gradient-based optimization
- Can use standard optimizers (AdamW) instead of evolutionary search
- Faster convergence and better local refinement

---

### Enhanced RAG Infrastructure

**Performance Metrics:** Sub-second response time (p95 < 800ms), 0.91 MRR@10

**Architecture:**

**1. Document Processing & Chunking:**
- **Challenge:** Insurance plan documents with complex structure
  - Can't chunk by pages (sections span multiple pages)
  - Need semantically coherent chunks
- **Solution: Contextual Chunking Based on Document Structure**
  - Parse headers and document hierarchy
  - Keep related content together (e.g., all benefits in a section)
  - Preserve context within chunks
  - This was the hardest part - more challenging than embedding quality

**2. Embeddings:**
- **Model: Amazon Titan Text Embeddings**
  - Easiest to integrate with AWS infrastructure
  - Performance adequate for use case
  - Embedding quality wasn't the bottleneck (chunking was)

**3. Vector Storage:**
- **Redis Vector Database**
  - Fast similarity search
  - Low latency critical for p95 < 800ms target
  - Integration with existing Redis infrastructure

**4. Hybrid Search:**
- **BM25 Integration:**
  - Used LangChain's BM25Retriever class
  - Combines dense (embedding) + sparse (keyword) retrieval
  - Handles both semantic similarity and exact term matching
- **Score Fusion:**
  - Likely reciprocal rank fusion or linear combination
  - Balances neural and lexical retrieval

**5. Reranking:**
- Cross-encoder model for reranking top-k results
- Two-stage retrieval pipeline:
  - Broad recall: retrieve ~100 candidates
  - Precision reranking: rerank to top 10
- Improved MRR@10 to 0.91

**6. Query Pipeline:**
- Total latency p95 < 800ms breakdown (estimated):
  - Retrieval: ~200-300ms
  - Reranking: ~200-300ms
  - LLM generation: ~200-300ms
- Caching layer for frequent queries (Redis)
- Async operations for parallel processing

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

## Johns Hopkins Wilmer Eye Institute | Machine Learning Researcher
*May 2021 - Present | Baltimore, MD*

### Novel Transformer Architecture for Glaucoma Progression

**Research Impact:** 0.74 → 0.97 AUC for predicting rapid glaucoma worsening

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

### Programming Languages & Tools:
- **Python:** Expert level - primary language for all ML work
- **SQL:** Advanced - data analysis, feature engineering
- **AWS:** SageMaker, Lambda, Bedrock, S3
- **Azure:** ML endpoints, HIPAA-compliant deployment
- **Databricks:** Feature stores, distributed processing
- **PyTorch:** Primary deep learning framework
- **MLflow:** Model versioning and deployment

### Deep Learning Expertise:
- Custom transformer architectures
- Multi-modal learning and fusion
- Temporal modeling (irregular time series, Neural ODEs)
- FlashAttention and efficient attention mechanisms
- LoRA/PEFT fine-tuning
- Model optimization (quantization, ONNX, TensorRT)

### Optimization:
- MILP with Gurobi
- Evolutionary algorithms (NSGA-II/III, pymoo)
- Differentiable ranking (Plackett-Luce, ListNet)
- Multi-objective optimization

### Production ML:
- A/B testing and experimentation
- Model monitoring and drift detection
- Real-time inference pipelines
- Edge deployment and optimization
- MLOps and deployment best practices

### Domain Expertise:
- Healthcare AI (clinical decision support, medical imaging)
- Insurance/Medicare (plan recommendation, compliance)
- Quantitative finance (return forecasting, portfolio optimization)
- Production systems at scale

