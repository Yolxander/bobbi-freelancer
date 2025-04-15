// Dummy data for proposals
const dummyProposals = [
  {
    id: "1",
    provider_id: "1",
    client_id: "1",
    project_id: "1",
    title: "Website Redesign Proposal",
    status: "draft",
    content: {
      scope: "Complete website redesign including UI/UX improvements",
      deliverables: ["New homepage design", "Mobile responsive layout", "Content management system"],
      timeline: "6 weeks",
      budget: [
        { item: "Design", amount: 5000 },
        { item: "Development", amount: 8000 },
        { item: "Content", amount: 3000 }
      ],
      terms: "50% upfront, 50% upon completion",
      signature: "John Doe"
    },
    pdf_url: null,
    sent_at: null,
    accepted_at: null,
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-03-15T10:00:00Z",
    client_name: "Acme Corp",
    project_name: "Website Redesign"
  },
  {
    id: "2",
    provider_id: "1",
    client_id: "2",
    project_id: "2",
    title: "Mobile App Development",
    status: "sent",
    content: {
      scope: "iOS and Android app development",
      deliverables: ["Native iOS app", "Native Android app", "Backend API"],
      timeline: "12 weeks",
      budget: [
        { item: "iOS Development", amount: 15000 },
        { item: "Android Development", amount: 15000 },
        { item: "Backend Development", amount: 10000 }
      ],
      terms: "30% upfront, 40% mid-project, 30% upon completion",
      signature: "John Doe"
    },
    pdf_url: "https://example.com/proposal2.pdf",
    sent_at: "2024-03-20T14:30:00Z",
    accepted_at: null,
    created_at: "2024-03-18T09:00:00Z",
    updated_at: "2024-03-20T14:30:00Z",
    client_name: "TechStart Inc",
    project_name: "Mobile App"
  }
];

export type Proposal = {
  id: string;
  provider_id: string;
  client_id: string;
  project_id: string;
  title: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  content: {
    scope: string;
    deliverables: string[];
    timeline: string;
    budget: { item: string; amount: number }[];
    terms: string;
    signature: string;
  };
  pdf_url: string | null;
  sent_at: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
  client_name: string;
  project_name: string;
};

export async function getProposals(providerId: string): Promise<Proposal[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyProposals;
}

export async function getProposal(id: string): Promise<Proposal | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyProposals.find(p => p.id === id) || null;
}

export async function createProposal(proposal: Omit<Proposal, "id" | "created_at" | "updated_at">): Promise<Proposal> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const newProposal: Proposal = {
    ...proposal,
    id: (dummyProposals.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  dummyProposals.push(newProposal);
  return newProposal;
}

export async function updateProposal(id: string, proposal: Partial<Proposal>): Promise<Proposal> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyProposals.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Proposal not found");
  
  const updatedProposal = {
    ...dummyProposals[index],
    ...proposal,
    updated_at: new Date().toISOString()
  };
  dummyProposals[index] = updatedProposal;
  return updatedProposal;
}

export async function deleteProposal(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyProposals.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Proposal not found");
  dummyProposals.splice(index, 1);
}

export async function generateProposalPDF(id: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return `https://example.com/proposal-${id}.pdf`;
}

export async function sendProposal(id: string, email: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const proposal = dummyProposals.find(p => p.id === id);
  if (!proposal) throw new Error("Proposal not found");
  
  proposal.status = "sent";
  proposal.sent_at = new Date().toISOString();
  proposal.updated_at = new Date().toISOString();
} 