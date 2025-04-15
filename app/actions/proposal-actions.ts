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

// Dummy data for attachments
const dummyAttachments = [
  {
    id: "1",
    proposal_id: "1",
    filename: "project-specs.pdf",
    url: "https://example.com/attachments/project-specs.pdf",
    size: 1024 * 1024, // 1MB
    mime_type: "application/pdf",
    created_at: "2024-03-15T10:00:00Z"
  }
];

// Dummy data for comments
const dummyComments = [
  {
    id: "1",
    proposal_id: "1",
    user_id: "1",
    content: "Please review the budget section",
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-03-15T10:00:00Z"
  }
];

// Dummy data for signatures
const dummySignatures = [
  {
    id: "1",
    proposal_id: "1",
    user_id: "1",
    type: "provider",
    signed_at: "2024-03-15T10:00:00Z"
  }
];

// Dummy data for versions
const dummyVersions = [
  {
    id: "1",
    proposal_id: "1",
    version: 1,
    content: {
      scope: "Initial scope",
      deliverables: ["Initial deliverables"],
      timeline: "Initial timeline",
      budget: [{ item: "Initial item", amount: 1000 }],
      terms: "Initial terms",
      signature: ""
    },
    created_at: "2024-03-15T10:00:00Z"
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

export type Attachment = {
  id: string;
  proposal_id: string;
  filename: string;
  url: string;
  size: number;
  mime_type: string;
  created_at: string;
};

export type Comment = {
  id: string;
  proposal_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Signature = {
  id: string;
  proposal_id: string;
  user_id: string;
  type: "provider" | "client";
  signed_at: string;
};

export type Version = {
  id: string;
  proposal_id: string;
  version: number;
  content: Proposal["content"];
  created_at: string;
};

// Basic CRUD Operations
export async function getProposals(providerId: string): Promise<Proposal[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyProposals;
}

export async function getProposal(id: string): Promise<Proposal | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyProposals.find(p => p.id === id) || null;
}

export async function createProposal(proposal: Omit<Proposal, "id" | "created_at" | "updated_at">): Promise<Proposal> {
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
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyProposals.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Proposal not found");
  dummyProposals.splice(index, 1);
}

// Status Management
export async function sendProposal(id: string, email: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const proposal = dummyProposals.find(p => p.id === id);
  if (!proposal) throw new Error("Proposal not found");
  
  proposal.status = "sent";
  proposal.sent_at = new Date().toISOString();
  proposal.updated_at = new Date().toISOString();
}

export async function acceptProposal(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const proposal = dummyProposals.find(p => p.id === id);
  if (!proposal) throw new Error("Proposal not found");
  
  proposal.status = "accepted";
  proposal.accepted_at = new Date().toISOString();
  proposal.updated_at = new Date().toISOString();
}

export async function rejectProposal(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const proposal = dummyProposals.find(p => p.id === id);
  if (!proposal) throw new Error("Proposal not found");
  
  proposal.status = "rejected";
  proposal.updated_at = new Date().toISOString();
}

export async function duplicateProposal(id: string): Promise<Proposal> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const proposal = dummyProposals.find(p => p.id === id);
  if (!proposal) throw new Error("Proposal not found");

  const newProposal: Omit<Proposal, "id" | "created_at" | "updated_at"> = {
    ...proposal,
    title: `${proposal.title} (Copy)`,
    status: "draft",
    pdf_url: null,
    sent_at: null,
    accepted_at: null
  };

  return createProposal(newProposal);
}

// Attachments
export async function getAttachments(proposalId: string): Promise<Attachment[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyAttachments.filter(a => a.proposal_id === proposalId);
}

export async function addAttachment(proposalId: string, file: File): Promise<Attachment> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newAttachment: Attachment = {
    id: (dummyAttachments.length + 1).toString(),
    proposal_id: proposalId,
    filename: file.name,
    url: `https://example.com/attachments/${file.name}`,
    size: file.size,
    mime_type: file.type,
    created_at: new Date().toISOString()
  };
  dummyAttachments.push(newAttachment);
  return newAttachment;
}

export async function deleteAttachment(proposalId: string, attachmentId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyAttachments.findIndex(a => a.id === attachmentId && a.proposal_id === proposalId);
  if (index === -1) throw new Error("Attachment not found");
  dummyAttachments.splice(index, 1);
}

// Comments
export async function getComments(proposalId: string): Promise<Comment[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyComments.filter(c => c.proposal_id === proposalId);
}

export async function addComment(proposalId: string, userId: string, content: string): Promise<Comment> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newComment: Comment = {
    id: (dummyComments.length + 1).toString(),
    proposal_id: proposalId,
    user_id: userId,
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  dummyComments.push(newComment);
  return newComment;
}

export async function updateComment(proposalId: string, commentId: string, content: string): Promise<Comment> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyComments.findIndex(c => c.id === commentId && c.proposal_id === proposalId);
  if (index === -1) throw new Error("Comment not found");
  
  const updatedComment = {
    ...dummyComments[index],
    content,
    updated_at: new Date().toISOString()
  };
  dummyComments[index] = updatedComment;
  return updatedComment;
}

export async function deleteComment(proposalId: string, commentId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyComments.findIndex(c => c.id === commentId && c.proposal_id === proposalId);
  if (index === -1) throw new Error("Comment not found");
  dummyComments.splice(index, 1);
}

// Signatures
export async function getSignatures(proposalId: string): Promise<Signature[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummySignatures.filter(s => s.proposal_id === proposalId);
}

export async function addSignature(proposalId: string, userId: string, type: "provider" | "client"): Promise<Signature> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newSignature: Signature = {
    id: (dummySignatures.length + 1).toString(),
    proposal_id: proposalId,
    user_id: userId,
    type,
    signed_at: new Date().toISOString()
  };
  dummySignatures.push(newSignature);
  return newSignature;
}

// Versions
export async function getVersions(proposalId: string): Promise<Version[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyVersions.filter(v => v.proposal_id === proposalId);
}

export async function getVersion(proposalId: string, versionId: string): Promise<Version | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyVersions.find(v => v.id === versionId && v.proposal_id === proposalId) || null;
}

export async function restoreVersion(proposalId: string, versionId: string): Promise<Proposal> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const version = dummyVersions.find(v => v.id === versionId && v.proposal_id === proposalId);
  if (!version) throw new Error("Version not found");

  const proposal = dummyProposals.find(p => p.id === proposalId);
  if (!proposal) throw new Error("Proposal not found");

  const updatedProposal = {
    ...proposal,
    content: version.content,
    updated_at: new Date().toISOString()
  };

  return updateProposal(proposalId, updatedProposal);
}

// Export
export async function generateProposalPDF(id: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return `https://example.com/proposal-${id}.pdf`;
}

export async function generateProposalDOCX(id: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return `https://example.com/proposal-${id}.docx`;
}

// Search and Filter
export async function searchProposals(query: string): Promise<Proposal[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyProposals.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.content.scope.toLowerCase().includes(query.toLowerCase())
  );
}

export async function filterProposals(filters: {
  status?: Proposal["status"];
  client_id?: string;
  project_id?: string;
}): Promise<Proposal[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyProposals.filter(p => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.client_id && p.client_id !== filters.client_id) return false;
    if (filters.project_id && p.project_id !== filters.project_id) return false;
    return true;
  });
} 