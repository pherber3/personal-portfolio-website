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
    summary: "Building production ML systems that directly impact business metrics, including a payment prediction model that improved success rates by 25%. Leading technical initiatives across voice AI, automated compliance monitoring, and RAG infrastructure. Chair the AI tooling committee and facilitate knowledge sharing through biweekly research presentations.",
    details: [
      "**Payment Prediction System:** Deployed ML model improving successful payment rates from 47% to 59%, directly impacting revenue through data-driven lead prioritization",
      "**Real-Time Voice AI Platform:** Architected production voice agent system reducing response latency by 85% (from 5-7s to sub-second) through model optimization and streaming techniques",
      "**Automated Quality Assurance:** Built serverless architecture processing 99% of call transcripts with automated compliance scoring and real-time alerting",
      "**Multi-Objective Optimization:** Developed optimization system achieving 3-5% improvement in plan recommendations while reducing training time by 21x through evolutionary algorithms and differentiable ranking formulations",
      "**RAG Infrastructure:** Created production retrieval system for insurance documentation with sub-second response times (p95 < 800ms) and 0.91 MRR@10",
      "**AI Agent Integration:** Built MCP server connecting Neo4j knowledge graphs with internal APIs, enabling AI agents to leverage company data for enhanced decision making",
      "**ML Infrastructure:** Designed feature store on Databricks with automated quality monitoring and real-time performance tracking",
      "**Technical Leadership:** Chair AI tooling committee and facilitate biweekly ML research presentations"
    ]
  },
  {
    company: "Johns Hopkins Wilmer Eye Institute",
    role: "Machine Learning Researcher",
    dates: "May 2021 - Present",
    location: "Baltimore, MD",
    summary: "Developed state-of-the-art transformer architecture from scratch for clinical predictions, achieving 0.97 AUC through innovative approaches to handling multimodal medical data. Research has been published in top-tier ophthalmology journals and presented at ICML. Built production systems including LLM-based clinical note classification and computer vision pipelines for automated medical imaging analysis.",
    details: [
      "**Transformer Architecture for Clinical AI:** Developed custom multi-modal transformer from scratch, improving glaucoma prediction from 0.74 to 0.97 AUC through innovations in handling irregular temporal data",
      "**Uncertainty Quantification:** Implemented probabilistic modeling for clinical decision support with counterfactual analysis and trajectory forecasting",
      "**Clinical NLP System:** Built classification system for medical notes using fine-tuned LLMs, achieving 0.96 AUC and deployed on Azure for PHI-compliant production use",
      "**Computer Vision Pipeline:** Fine-tuned foundation models for automated medical image segmentation (Dice 0.88) and developed novel algorithms for clinical measurements",
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
