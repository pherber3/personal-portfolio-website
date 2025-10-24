export interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: number;
  volume?: string;
  pages?: string;
  doi: string;
}

export const publications: Publication[] = [
  {
    title: "Detecting glaucoma worsening using optical coherence tomography derived visual field estimates",
    authors: "Pham, A. T., Bradley, C., Hou, K., Herbert, P., & Yohannan, J.",
    journal: "Scientific Reports",
    year: 2025,
    volume: "15(1)",
    pages: "5013",
    doi: "https://doi.org/10.1038/s41598-025-86217-2"
  },
  {
    title: "The Impact of Achieving Target Intraocular Pressure on Glaucomatous Retinal Nerve Fiber Layer Thinning in a Treated Clinical Population",
    authors: "Pham, A. T., Bradley, C., Hou, K., Herbert, P., Boland, M. V., Ramulu, P. Y., & Yohannan, J.",
    journal: "American Journal of Ophthalmology",
    year: 2024,
    volume: "262",
    pages: "213-221",
    doi: "https://doi.org/10.1016/j.ajo.2023.11.019"
  },
  {
    title: "Deep learning-based identification of eyes at risk for glaucoma surgery",
    authors: "Wang, R., Bradley, C., Herbert, P., Hou, K., Ramulu, P., Breininger, K., Unberath, M., & Yohannan, J.",
    journal: "Scientific Reports",
    year: 2024,
    volume: "14(1)",
    pages: "599",
    doi: "https://doi.org/10.1038/s41598-023-50597-0"
  },
  {
    title: "Assessment of linear regression of peripapillary optical coherence tomography retinal nerve fiber layer measurements to forecast glaucoma trajectory",
    authors: "Bradley, C., Hou, K., Herbert, P., Unberath, M., Hager, G., Boland, M. V., Ramulu, P., & Yohannan, J.",
    journal: "PLoS One",
    year: 2024,
    volume: "19(1)",
    pages: "e0296674",
    doi: "https://doi.org/10.1371/journal.pone.0296674"
  },
  {
    title: "Opportunities for Improving Glaucoma Clinical Trials via Deep Learning-Based Identification of Patients with Low Visual Field Variability",
    authors: "Wang, R., Bradley, C., Herbert, P., Hou, K., Hager, G. D., Breininger, K., Unberath, M., Ramulu, P., & Yohannan, J.",
    journal: "Ophthalmology Glaucoma",
    year: 2024,
    volume: "7(3)",
    pages: "222-231",
    doi: "https://doi.org/10.1016/j.ogla.2024.01.005"
  },
  {
    title: "The Impact of Social Vulnerability on Structural and Functional Glaucoma Severity, Worsening, and Variability",
    authors: "Almidani, L., Bradley, C., Herbert, P., Ramulu, P., & Yohannan, J.",
    journal: "Ophthalmology Glaucoma",
    year: 2024,
    volume: "7(4)",
    pages: "380-390",
    doi: "https://doi.org/10.1016/j.ogla.2024.03.008"
  },
  {
    title: "Detecting Visual Field Worsening From Optic Nerve Head and Macular Optical Coherence Tomography Thickness Measurements",
    authors: "Pham, A. T., Pan, A. A., Bradley, C., Hou, K., Herbert, P., Johnson, C., Wall, M., & Yohannan, J.",
    journal: "Translational Vision Science & Technology",
    year: 2024,
    volume: "13(8)",
    pages: "12",
    doi: "https://doi.org/10.1167/tvst.13.8.12"
  },
  {
    title: "Forecasting Risk of Future Rapid Glaucoma Worsening Using Early Visual Field, OCT, and Clinical Data",
    authors: "Herbert, P., Hou, K., Bradley, C., Hager, G., Boland, M. V., Ramulu, P., Unberath, M., & Yohannan, J.",
    journal: "Ophthalmology Glaucoma",
    year: 2023,
    volume: "6(5)",
    pages: "466-473",
    doi: "https://doi.org/10.1016/j.ogla.2023.03.005"
  },
  {
    title: "Comparing the Accuracy of Peripapillary OCT Scans and Visual Fields to Detect Glaucoma Worsening",
    authors: "Bradley, C., Herbert, P., Hou, K., Unberath, M., Ramulu, P., & Yohannan, J.",
    journal: "Ophthalmology",
    year: 2023,
    volume: "130(6)",
    pages: "631-639",
    doi: "https://doi.org/10.1016/j.ophtha.2023.01.021"
  },
  {
    title: "Predicting Visual Field Worsening with Longitudinal OCT Data Using a Gated Transformer Network",
    authors: "Hou, K., Bradley, C., Herbert, P., Johnson, C., Wall, M., Ramulu, P. Y., Unberath, M., & Yohannan, J.",
    journal: "Ophthalmology",
    year: 2023,
    volume: "130(8)",
    pages: "854-862",
    doi: "https://doi.org/10.1016/j.ophtha.2023.03.019"
  },
  {
    title: "A deep learning model incorporating spatial and temporal information successfully detects visual field worsening using a consensus based approach",
    authors: "Sabharwal, J., Hou, K., Herbert, P., Bradley, C., Johnson, C. A., Wall, M., Ramulu, P. Y., Unberath, M., & Yohannan, J.",
    journal: "Scientific Reports",
    year: 2023,
    volume: "13(1)",
    pages: "1041",
    doi: "https://doi.org/10.1038/s41598-023-28003-6"
  },
  {
    title: "Evidence-Based Guidelines for the Number of Peripapillary OCT Scans Needed to Detect Glaucoma Worsening",
    authors: "Bradley, C., Hou, K., Herbert, P., Unberath, M., Boland, M. V., Ramulu, P., & Yohannan, J.",
    journal: "Ophthalmology",
    year: 2023,
    volume: "130(1)",
    pages: "39-47",
    doi: "https://doi.org/10.1016/j.ophtha.2022.07.025"
  }
];
