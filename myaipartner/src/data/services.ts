import { Layers, Sparkles, Rocket, PlugZap, Code2, Database, Building2, ShieldCheck, FlaskConical } from 'lucide-react';

export type ServiceCategory = {
  category: string;
  items: string[];
  overview: { desc: string; icon: any };
};

export const services: ServiceCategory[] = [
  {
    category: 'AI Strategy & Advisory',
    overview: { desc: 'Readiness, roadmaps, governance, and change management.', icon: Layers },
    items: [
      'AI Readiness Assessments',
      'AI Roadmap Development',
      'AI Governance & Compliance (Responsible AI, POPIA/GDPR)',
      'Change Management for AI Adoption',
      'Competitive Advantage Analysis with AI'
    ]
  },
  {
    category: 'AI Training & Upskilling',
    overview: { desc: 'Executive workshops and corporate training programs.', icon: Sparkles },
    items: [
      'Executive Workshops (AI for decision-makers)',
      'Corporate Training Programs',
      'Custom AI Bootcamps',
      'AI Awareness Sessions',
      'Train-the-Trainer Programs'
    ]
  },
  {
    category: 'AI Automation Services',
    overview: { desc: 'RPA, chatbots, and workflow automation.', icon: Rocket },
    items: [
      'Robotic Process Automation (RPA)',
      'Document Processing Automation (OCR + NLP)',
      'AI Chatbots & Virtual Assistants',
      'Workflow Automation & Orchestration',
      'Email & Communication Automation',
      'AI for HR (Recruitment, CV Screening, Performance Analytics)'
    ]
  },
  {
    category: 'AI Implementation & Integration',
    overview: { desc: 'Model development and systems integration at scale.', icon: PlugZap },
    items: [
      'Custom AI Model Development (NLP, Computer Vision, Predictive Analytics)',
      'Integration with ERP/CRM/HRM Systems',
      'Cloud AI Solutions (Azure, AWS, Google Cloud AI)',
      'Edge AI & IoT Integration',
      'AI in Data Pipelines (ETL Automation, Data Enrichment)'
    ]
  },
  {
    category: 'AI Application & Product Development',
    overview: { desc: 'Web/mobile AI apps, dashboards, and GenAI products.', icon: Code2 },
    items: [
      'Mobile AI App Development (iOS/Android)',
      'Web AI Solutions (recommendation systems, personalization engines)',
      'AI-Driven Analytics Dashboards',
      'Generative AI Applications (text, image, audio, video)',
      'AI in E-commerce (chatbots, personalization, forecasting)'
    ]
  },
  {
    category: 'Data & AI Infrastructure',
    overview: { desc: 'Data platforms, MLOps, and scalable AI infrastructure.', icon: Database },
    items: [
      'Data Collection & Cleaning Services',
      'Data Warehousing & Management',
      'Data Labeling & Annotation',
      'ML Ops & AI Deployment Pipelines',
      'Scalable AI Infrastructure Setup'
    ]
  },
  {
    category: 'AI for Business Functions (Industry-Specific)',
    overview: { desc: 'Applied AI for marketing, sales, finance, and more.', icon: Building2 },
    items: [
      'AI for Marketing (segmentation, sentiment analysis, ad optimization)',
      'AI for Sales (lead scoring, predictive sales)',
      'AI for Finance (fraud detection, credit scoring, forecasting)',
      'AI for Healthcare (diagnostics, medical imaging, patient monitoring)',
      'AI for Retail (inventory optimization, demand forecasting)',
      'AI for Manufacturing (predictive maintenance, quality control)',
      'AI for Education (personalized learning, grading automation)'
    ]
  },
  {
    category: 'AI Security & Ethics',
    overview: { desc: 'Bias mitigation, responsible AI, and risk management.', icon: ShieldCheck },
    items: [
      'AI Cybersecurity Solutions (threat & anomaly detection)',
      'AI Bias Detection & Mitigation',
      'Responsible AI Frameworks',
      'AI Risk Management & Compliance Consulting'
    ]
  },
  {
    category: 'AI Research & Innovation',
    overview: { desc: 'PoCs, rapid prototyping, and emerging tech exploration.', icon: FlaskConical },
    items: [
      'Custom AI R&D for Business Needs',
      'Proof of Concept (PoC) Development',
      'Rapid AI Prototyping',
      'Emerging Tech Exploration (Generative AI, Multimodal AI, Digital Twins)'
    ]
  },
  {
    category: 'Ongoing Support & Managed Services',
    overview: { desc: 'Monitoring, updates, and on-demand AI consultants.', icon: Layers },
    items: [
      'AI-as-a-Service (subscription-based support)',
      'Monitoring & Maintenance of AI Systems',
      'Continuous Model Training & Updating',
      'SLA-Based AI Support & Troubleshooting',
      'Dedicated AI Consultants On-Demand'
    ]
  }
];

export const servicesOverview = services.map(s => ({ title: s.category, desc: s.overview.desc, icon: s.overview.icon }));


