// Dummy data for proposals
const proposals: Proposal[] = [
  {
    id: "1",
    provider_id: "1",
    client_id: "1",
    project_id: "1",
    title: "Website Development Proposal",
    status: "draft",
    content: {
      scope: "Develop a modern website with responsive design",
      deliverables: [
        "Homepage design and development",
        "About page with team section",
        "Services page with pricing tables",
        "Contact form with email integration"
      ],
      timeline: {
        start: "2024-03-01",
        end: "2024-04-15"
      },
      budget: [
        { item: "Design", amount: 2000 },
        { item: "Development", amount: 3000 },
        { item: "Content Creation", amount: 1000 }
      ],
      terms: "Payment: 50% upfront, 50% upon completion",
      signature: {
        provider: "",
        client: ""
      }
    },
    pdf_url: null,
    sent_at: null,
    accepted_at: null,
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z",
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
      timeline: {
        start: "2024-03-01",
        end: "2024-05-24"
      },
      budget: [
        { item: "iOS Development", amount: 15000 },
        { item: "Android Development", amount: 15000 },
        { item: "Backend Development", amount: 10000 }
      ],
      terms: "30% upfront, 40% mid-project, 30% upon completion",
      signature: {
        provider: "",
        client: ""
      }
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
const signatures: Signature[] = [
  {
    id: "1",
    proposal_id: "1",
    user_id: "1",
    type: "provider",
    signed_at: "2024-02-20T10:00:00Z"
  }
];

// Dummy data for versions
const versions: Version[] = [
  {
    id: "1",
    proposal_id: "1",
    version: 1,
    content: {
      scope: "Develop a modern website with responsive design",
      deliverables: [
        "Homepage design and development",
        "About page with team section",
        "Services page with pricing tables",
        "Contact form with email integration"
      ],
      timeline: {
        start: "2024-03-01",
        end: "2024-04-15"
      },
      budget: [
        { item: "Design", amount: 2000 },
        { item: "Development", amount: 3000 },
        { item: "Content Creation", amount: 1000 }
      ],
      terms: "Payment: 50% upfront, 50% upon completion",
      signature: {
        provider: "",
        client: ""
      }
    },
    created_at: "2024-02-20T10:00:00Z"
  }
];

// Types
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
    timeline: {
      start: string;
      end: string;
    };
    budget: { item: string; amount: number }[];
    terms: string;
    signature: {
      provider: string;
      client: string;
    };
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

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Basic CRUD Operations
export async function getProposals(providerId: string): Promise<Proposal[]> {
  const response = await fetch(`${API_BASE_URL}/proposals?provider_id=${providerId}`);
  if (!response.ok) throw new Error('Failed to fetch proposals');
  return response.json();
}

export async function getProposal(id: string): Promise<Proposal | null> {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}`);
  if (!response.ok) throw new Error('Failed to fetch proposal');
  return response.json();
}

export const createProposal = async (
  proposal: Omit<Proposal, "id" | "created_at" | "updated_at">
): Promise<Proposal> => {
  const response = await fetch(`${API_BASE_URL}/proposals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: proposal.title,
      client_id: proposal.client_id,
      project_id: proposal.project_id,
      status: proposal.status,
      content: {
        scope: proposal.content.scope,
        deliverables: proposal.content.deliverables,
        timeline: proposal.content.timeline,
        budget: proposal.content.budget,
        terms: proposal.content.terms,
        signature: proposal.content.signature,
      },
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create proposal');
  }
  return response.json();
};

export const updateProposal = async (
  id: string,
  proposal: Partial<Proposal>
): Promise<Proposal> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proposal),
  });
  if (!response.ok) throw new Error('Failed to update proposal');
  return response.json();
};

export async function deleteProposal(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete proposal');
}

// Status Management
export async function sendProposal(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}/send`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to send proposal');
}

export async function acceptProposal(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}/accept`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to accept proposal');
}

export async function rejectProposal(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}/reject`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to reject proposal');
}

export async function duplicateProposal(id: string): Promise<Proposal> {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}/duplicate`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to duplicate proposal');
  return response.json();
}

// Attachments
export async function getAttachments(proposalId: string): Promise<Attachment[]> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/attachments`);
  if (!response.ok) throw new Error('Failed to fetch attachments');
  return response.json();
}

export async function addAttachment(proposalId: string, file: File): Promise<Attachment> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/attachments`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to add attachment');
  return response.json();
}

export async function deleteAttachment(proposalId: string, attachmentId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/attachments/${attachmentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete attachment');
}

// Comments
export async function getComments(proposalId: string): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/comments`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  return response.json();
}

export async function addComment(proposalId: string, userId: string, content: string): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, content }),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
}

export async function updateComment(proposalId: string, commentId: string, content: string): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Failed to update comment');
  return response.json();
}

export async function deleteComment(proposalId: string, commentId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete comment');
}

// Signatures
export async function getSignatures(proposalId: string): Promise<Signature[]> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/signatures`);
  if (!response.ok) throw new Error('Failed to fetch signatures');
  return response.json();
}

export async function addSignature(proposalId: string, userId: string, type: "provider" | "client"): Promise<Signature> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/signatures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, type }),
  });
  if (!response.ok) throw new Error('Failed to add signature');
  return response.json();
}

// Versions
export async function getVersions(proposalId: string): Promise<Version[]> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/versions`);
  if (!response.ok) throw new Error('Failed to fetch versions');
  return response.json();
}

export async function getVersion(proposalId: string, versionId: string): Promise<Version | null> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/versions/${versionId}`);
  if (!response.ok) throw new Error('Failed to fetch version');
  return response.json();
}

export async function restoreVersion(proposalId: string, versionId: string): Promise<Proposal> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/versions/${versionId}/restore`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to restore version');
  return response.json();
}

// Export
export async function generateProposalPDF(id: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}/export/pdf`);
  if (!response.ok) throw new Error('Failed to generate PDF');
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function generateProposalDOCX(id: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}/export/docx`);
  if (!response.ok) throw new Error('Failed to generate DOCX');
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

// Search and Filter
export async function searchProposals(query: string): Promise<Proposal[]> {
  const response = await fetch(`${API_BASE_URL}/proposals/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search proposals');
  return response.json();
}

export async function filterProposals(filters: {
  status?: Proposal["status"];
  client_id?: string;
  project_id?: string;
}): Promise<Proposal[]> {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.client_id) queryParams.append('client_id', filters.client_id);
  if (filters.project_id) queryParams.append('project_id', filters.project_id);

  const response = await fetch(`${API_BASE_URL}/proposals/filter?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Failed to filter proposals');
  return response.json();
} 