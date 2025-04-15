import { Proposal } from "./proposal-actions";

export type ProposalTemplate = {
  id: string;
  provider_id: string;
  title: string;
  content: Proposal["content"];
  created_at: string;
  updated_at: string;
};

// Dummy data for templates
const dummyTemplates: ProposalTemplate[] = [
  {
    id: "1",
    provider_id: "1",
    title: "Website Development Template",
    content: {
      scope: "Standard website development scope",
      deliverables: ["Homepage", "About page", "Contact page", "Blog section"],
      timeline: "4-6 weeks",
      budget: [
        { item: "Design", amount: 3000 },
        { item: "Development", amount: 5000 },
        { item: "Content", amount: 2000 }
      ],
      terms: "50% upfront, 50% upon completion",
      signature: ""
    },
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-03-15T10:00:00Z"
  }
];

export async function getTemplates(providerId: string): Promise<ProposalTemplate[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyTemplates.filter(t => t.provider_id === providerId);
}

export async function getTemplate(id: string): Promise<ProposalTemplate | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyTemplates.find(t => t.id === id) || null;
}

export async function createTemplate(template: Omit<ProposalTemplate, "id" | "created_at" | "updated_at">): Promise<ProposalTemplate> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const newTemplate: ProposalTemplate = {
    ...template,
    id: (dummyTemplates.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  dummyTemplates.push(newTemplate);
  return newTemplate;
}

export async function updateTemplate(id: string, template: Partial<ProposalTemplate>): Promise<ProposalTemplate> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyTemplates.findIndex(t => t.id === id);
  if (index === -1) throw new Error("Template not found");
  
  const updatedTemplate = {
    ...dummyTemplates[index],
    ...template,
    updated_at: new Date().toISOString()
  };
  dummyTemplates[index] = updatedTemplate;
  return updatedTemplate;
}

export async function deleteTemplate(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyTemplates.findIndex(t => t.id === id);
  if (index === -1) throw new Error("Template not found");
  dummyTemplates.splice(index, 1);
}

export async function useTemplate(templateId: string): Promise<Proposal> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const template = dummyTemplates.find(t => t.id === templateId);
  if (!template) throw new Error("Template not found");

  // Create a new proposal based on the template
  const newProposal: Omit<Proposal, "id" | "created_at" | "updated_at"> = {
    provider_id: template.provider_id,
    client_id: "",
    project_id: "",
    title: `New Proposal from ${template.title}`,
    status: "draft",
    content: template.content,
    pdf_url: null,
    sent_at: null,
    accepted_at: null,
    client_name: "",
    project_name: ""
  };

  // Use the existing createProposal function
  const { createProposal } = await import("./proposal-actions");
  return createProposal(newProposal);
} 