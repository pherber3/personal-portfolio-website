export interface Experience {
  company: string;
  role: string;
  dates: string;
  location: string;
  summary: string; // Short 2-3 sentence summary for timeline
  details: string[]; // Full bullet points for CV page
}

export const experiences: Experience[] = [
  {
    company: "GoHealth",
    role: "Senior Machine Learning Engineer",
    dates: "October 2024 - Present",
    location: "Chicago, IL",
    summary: "Building production speech and ML systems for a regulated insurance sales platform. Designed and deployed real-time and batch transcription backends using NVIDIA Parakeet TDT v3 with custom TensorRT inference, domain language models, and evaluation metrics built around compliance accuracy. Also leading initiatives across voice AI, automated compliance monitoring, multi-objective optimization, and RAG infrastructure.",
    details: [
      "**Real-Time Streaming Transcription:** Designed and built production transcription backend serving live calls with async gRPC and custom TensorRT-compiled Parakeet TDT v3. Achieved 5.6x end-to-end speedup over NeMo PyTorch (261ms avg latency per GPU at 25 concurrent stereo calls with full fusion). Scales horizontally via AWS ECS/ALB. ~9x cheaper than the enterprise transcription alternative",
      "**Batch Transcription & Domain Language Model:** Replaced WhisperX with customized Parakeet for offline call processing. Trained 6-gram KenLM domain language model on curated call transcripts with shallow fusion and GPU phrase boosting, reducing WER from 18.3% to 16.2%. Built custom evaluation framework (content WER, rare word WER, BERTScore, domain keyword accuracy). Achieved 91% AQA agreement with human QA graders, matching the enterprise model. 73% faster transcription, 275x lower cost",
      "**Voice AI Agent:** Identified agents spending significant time on routine support (1,000+ voicemails/2 weeks for 66 agents). Built AI voice agent from business case through production deployment. Reduced human-required support requests by 70% and first-word latency by 85% via ONNX/TensorRT optimization of the speech pipeline",
      "**Automated Quality Assurance:** Designed serverless LLM-based compliance system (AWS Lambda) achieving 99% call coverage with structured YAML output for token efficiency. Built layered error taxonomy and confidence prediction model",
      "**Multi-Objective Optimization:** Replaced intractable discrete search (10¹⁹ parameter space) with differentiable optimization using Plackett-Luce ranking model and PPO-style trust regions, achieving 3–5% top-3 plan sales improvement with 11x training speedup",
      "**Payment Prediction:** Built ML model improving successful payment rates from 47% to 59%, directly impacting revenue through data-driven lead prioritization",
      "**RAG Infrastructure:** Rewrote traditional chunk-based RAG into agentic system over OCR-parsed markdown, achieving 2x+ improvement on groundedness, accuracy, and multi-hop questions. Contributed to LightOn OCR model training direction for insurance document parsing. Optimized OCR pipeline to ~45 seconds per 200-page document on A100"
    ]
  },
  {
    company: "Independent Research",
    role: "ML Scientist",
    dates: "2024 - Present",
    location: "",
    summary: "Pursuing independent research and personal projects in speech AI, tensor algebra, and mechanistic interpretability. Building a novel dual-stream speech encoder architecture, a multi-modal auto-dubbing pipeline, and conducting original research in tensor decomposition and chain-of-thought analysis.",
    details: [
      "**Unified Dual-Stream Speech Encoder (WIP):** Novel architecture jointly capturing semantics and prosody from a single FastConformer backbone for emotion-conditioned speech retrieval. Dual-stream split at ~70% encoder depth with ColBERT-style multi-vector retrieval head. Distilled from Qwen3-Omni and emotion2vec. Current SER UA: 72.0% on IEMOCAP with no ASR degradation",
      "**Multi-Modal Auto-Dubbing Pipeline:** End-to-end pipeline translating foreign-language video to dubbed English with voice cloning. Chains Mel-RoFormer (source separation), Microsoft VibeVoice (transcription + diarization), TranslateGemma 12B (translation), and Qwen3-TTS (voice cloning) with timing synchronization",
      "**BM-ALS Tensor Decomposition:** Novel tensor decomposition algorithm in Bhattacharya-Mesner Hypermatrix Algebra Space with JAX implementation, outperforming Tucker/CP by 2–30x across synthetic, physics (MuJoCo), and GPT-2 attention composition tensors. Under review",
      "**CoT Activation Scaffolding:** Developed theory and ran behavioral experiments showing chain-of-thought tokens function as activation scaffolding rather than faithful reasoning traces, with mechanistic validation planned via Gemma Scope transcoders"
    ]
  },
  {
    company: "Johns Hopkins Wilmer Eye Institute",
    role: "Machine Learning Researcher",
    dates: "May 2021 - Present",
    location: "Baltimore, MD",
    summary: "Built custom multimodal transformer from scratch in PyTorch for glaucoma progression prediction, evolving from 0.74 to 0.97 AUC. 12 publications in top ophthalmology journals, ICML 2023 workshop presentation. Fine-tuned BERT, Llama, and Qwen with LoRA/PEFT for clinical entity extraction. Fine-tuned SAM foundation model for automated retinal segmentation.",
    details: [
      "**Custom Transformer Architecture:** Built multimodal transformer from scratch for glaucoma progression prediction (clinical, OCT imaging, visual field data). Handles irregular temporal sampling and variable-length sequences. Evolved from 0.74 to 0.97 AUC. 12 publications, ICML 2023 workshop presentation",
      "**Clinical NLP & Computer Vision:** Fine-tuned BERT, Llama, and Qwen with LoRA/PEFT for clinical entity extraction (0.96 AUC). Fine-tuned SAM foundation model for automated retinal segmentation (Dice 0.88)",
      "**Research Data Infrastructure:** Led infrastructure managing 10TB+ medical data, enabling multiple concurrent research projects and publications"
    ]
  },
  {
    company: "Johns Hopkins University",
    role: "Research Assistant",
    dates: "May 2019 - December 2021",
    location: "Baltimore, MD",
    summary: "Led research team developing neural networks for quantitative finance, focusing on S&P 500 return forecasting using advanced feature selection from 94 stock characteristics. Conducted optimization research using MILP formulations to analyze neural network properties, discovering that pruned networks can achieve higher adversarial robustness while maintaining accuracy.",
    details: [
      "**Quantitative Finance ML:** Led team developing neural networks for S&P 500 return forecasting, identifying key predictive features from 94 stock characteristics",
      "**Neural Network Optimization:** Developed mathematical formulations for network analysis, discovering that pruned networks can achieve higher adversarial robustness while maintaining accuracy"
    ]
  }
];
