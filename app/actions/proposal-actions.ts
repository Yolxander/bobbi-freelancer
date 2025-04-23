// Dummy data for development
const dummyProposals: Proposal[] = [
  {
    id: '1',
    client_id: '1',
    project_id: '1',
    title: 'Website Redesign Proposal',
    status: 'draft',
    is_template: false,
    current_version: 1,
    content: {
      id: '1',
      proposal_id: '1',
      scope_of_work: 'Redesign and development of company website',
      deliverables: JSON.stringify(['Homepage', 'About Page', 'Contact Form']),
      timeline_start: '2024-03-01',
      timeline_end: '2024-04-01',
      pricing: JSON.stringify([
        { item: 'Design', amount: 2000 },
        { item: 'Development', amount: 3000 }
      ]),
      payment_schedule: JSON.stringify({
        'Initial Deposit': 1000,
        'Mid-Project': 2000,
        'Final Payment': 2000
      }),
      terms_and_conditions: JSON.stringify({
        'Payment Terms': '50% upfront, 50% upon completion',
        'Cancellation Policy': 'No refunds after 50% completion'
      }),
      client_responsibilities: JSON.stringify([
        'Provide content and images',
        'Review and approve designs',
        'Provide feedback within 48 hours'
      ]),
      signature: JSON.stringify({ provider: '', client: '' })
    },
    client: {
      id: '1',
      name: 'Acme Corp',
      email: 'contact@acmecorp.com',
      phone: '555-123-4567'
    },
    project: {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete redesign of company website'
    }
  },
  {
    id: '2',
    client_id: '2',
    project_id: '2',
    title: 'Mobile App Development',
    status: 'sent',
    is_template: false,
    current_version: 1,
    content: {
      id: '2',
      proposal_id: '2',
      scope_of_work: 'Development of mobile application',
      deliverables: JSON.stringify(['iOS App', 'Android App', 'Admin Dashboard']),
      timeline_start: '2024-04-01',
      timeline_end: '2024-06-01',
      pricing: JSON.stringify([
        { item: 'iOS Development', amount: 5000 },
        { item: 'Android Development', amount: 5000 },
        { item: 'Backend Development', amount: 4000 }
      ]),
      payment_schedule: JSON.stringify({
        'Initial Deposit': 3000,
        'Mid-Project': 5000,
        'Final Payment': 6000
      }),
      signature: JSON.stringify({ provider: '', client: '' })
    },
    client: {
      id: '2',
      name: 'Tech Solutions Inc',
      email: 'info@techsolutions.com',
      phone: '555-987-6543'
    },
    project: {
      id: '2',
      name: 'Mobile App Project',
      description: 'Cross-platform mobile application development'
    }
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
    signed_at: "2024-02-20T10:00:00Z",
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z"
  }
];

// Dummy data for versions
const versions: Version[] = [
  {
    id: "1",
    proposal_id: "1",
    version: 1,
    content: {
      id: "1",
      proposal_id: "1",
      scope_of_work: "Develop a modern website with responsive design",
      deliverables: JSON.stringify([
        "Homepage design and development",
        "About page with team section",
        "Services page with pricing tables",
        "Contact form with email integration"
      ]),
      timeline_start: "2024-03-01",
      timeline_end: "2024-04-15",
      pricing: JSON.stringify([
        { item: "Design", amount: 2000 },
        { item: "Development", amount: 3000 },
        { item: "Content Creation", amount: 1000 }
      ]),
      payment_schedule: JSON.stringify({
        upfront: 50,
        completion: 50
      }),
      signature: JSON.stringify({ provider: "", client: "" }),
      created_at: "2024-02-20T10:00:00Z",
      updated_at: "2024-02-20T10:00:00Z"
    },
    created_at: "2024-02-20T10:00:00Z"
  }
];

// Types
export interface ProposalContent {
  id?: string;
  proposal_id?: string;
  scope_of_work?: string;
  deliverables: string;
  timeline_start: string;
  timeline_end: string;
  pricing: string;
  payment_schedule: string;
  terms_and_conditions: string;
  client_responsibilities: string;
  signature: string;
  created_at?: string;
  updated_at?: string;
}

export interface Proposal {
  id?: string;
  title: string;
  client_id: string;
  project_id: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected';
  content: ProposalContent;
  is_template?: boolean;
  current_version?: number;
  client_token?: string;
  client?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  project?: {
    id: string;
    name: string;
    description: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Attachment {
  id: string;
  proposal_id: string;
  filename: string;
  url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export interface Comment {
  id: string;
  proposal_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Signature {
  id: string;
  proposal_id: string;
  user_id: string;
  type: "provider" | "client";
  signed_at: string;
  created_at: string;
  updated_at: string;
}

export interface Version {
  id: string;
  proposal_id: string;
  version: number;
  content: Proposal["content"];
  created_at: string;
}

// Helper types for parsed content
export interface ParsedProposalContent {
  scope_of_work: string;
  deliverables: string[];
  timeline_start: string;
  timeline_end: string;
  pricing: Array<{ item: string; amount: number }>;
  payment_schedule: Record<string, number>;
  signature: { provider: string; client: string };
}

// Helper functions to parse content
export const parseDeliverables = (deliverables: string): string[] => {
  try {
    return JSON.parse(deliverables);
  } catch {
    return [];
  }
};

export const parsePricing = (pricing: string): Array<{ item: string; amount: number }> => {
  try {
    return JSON.parse(pricing);
  } catch {
    return [];
  }
};

export const parsePaymentSchedule = (schedule: string): Record<string, number> => {
  try {
    return JSON.parse(schedule);
  } catch {
    return {};
  }
};

export const parseSignature = (signature: string): { provider: string; client: string } => {
  try {
    return JSON.parse(signature);
  } catch {
    return { provider: '', client: '' };
  }
};

// Move API_BASE_URL to the top
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Update the getProposals function to use new property names
export const getProposals = async (): Promise<Proposal[]> => {
  const response = await fetch(`${API_BASE_URL}/proposals`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch proposals');
  }
  const data = await response.json();
  return data.map((proposal: any) => ({
    id: proposal.id,
    title: proposal.title,
    client_id: proposal.client_id,
    project_id: proposal.project_id,
    status: proposal.status,
    is_template: proposal.is_template,
    current_version: proposal.current_version,
    content: {
      id: proposal.content?.id || '',
      proposal_id: proposal.content?.proposal_id || '',
      scope_of_work: proposal.content?.scope_of_work || '',
      deliverables: proposal.content?.deliverables || JSON.stringify([]),
      timeline_start: proposal.content?.timeline_start || '',
      timeline_end: proposal.content?.timeline_end || '',
      pricing: proposal.content?.pricing || JSON.stringify([]),
      payment_schedule: proposal.content?.payment_schedule || JSON.stringify({}),
      signature: proposal.content?.signature || JSON.stringify({ provider: '', client: '' })
    },
    client: proposal.client || {
      id: '',
      name: '',
      email: '',
      phone: ''
    },
    project: proposal.project || {
      id: '',
      name: '',
      description: ''
    }
  }));
};

// Update the getProposal function to use new property names
export const getProposal = async (id: string): Promise<Proposal | null> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch proposal');
  }
  const data = await response.json();
  return {
    id: data.id,
    title: data.title,
    client_id: data.client_id,
    project_id: data.project_id,
    status: data.status,
    is_template: data.is_template,
    current_version: data.current_version,
    content: {
      id: data.content.id,
      proposal_id: data.content.proposal_id,
      scope_of_work: data.content.scope_of_work || '',
      deliverables: data.content.deliverables || '[]',
      timeline_start: data.content.timeline_start || '',
      timeline_end: data.content.timeline_end || '',
      pricing: data.content.pricing || '[]',
      payment_schedule: data.content.payment_schedule || '{}',
      terms_and_conditions: data.content.terms_and_conditions || '',
      client_responsibilities: data.content.client_responsibilities || '{}',
      signature: data.content.signature || '{}',
      created_at: data.content.created_at,
      updated_at: data.content.updated_at
    },
    client: data.client,
    project: data.project
  };
};

export async function createProposal(data: Partial<Proposal>): Promise<Proposal> {
  try {
    const response = await fetch(`${API_BASE_URL}/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        client_id: data.client_id,
        project_id: data.project_id,
        status: data.status || 'draft',
        is_template: data.is_template || false,
        current_version: data.current_version || 1,
        content: {
          id: data.content?.id,
          proposal_id: data.content?.proposal_id,
          scope_of_work: data.content?.scope_of_work || '',
          deliverables: data.content?.deliverables || '[]',
          timeline_start: data.content?.timeline_start || '',
          timeline_end: data.content?.timeline_end || '',
          pricing: data.content?.pricing || '[]',
          payment_schedule: data.content?.payment_schedule || '{}',
          terms_and_conditions: data.content?.terms_and_conditions || '',
          client_responsibilities: data.content?.client_responsibilities || '{}',
          signature: data.content?.signature || '{}'
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create proposal');
    }

    const proposal = await response.json();
    return proposal;
  } catch (error) {
    console.error('Error creating proposal:', error);
    throw error;
  }
}

export async function updateProposal(id: string, data: Partial<Proposal>): Promise<Proposal> {
  try {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        client_id: data.client_id,
        project_id: data.project_id,
        status: data.status,
        is_template: data.is_template,
        current_version: data.current_version,
        content: {
          id: data.content?.id,
          proposal_id: data.content?.proposal_id,
          scope_of_work: data.content?.scope_of_work || '',
          deliverables: data.content?.deliverables || '[]',
          timeline_start: data.content?.timeline_start || '',
          timeline_end: data.content?.timeline_end || '',
          pricing: data.content?.pricing || '[]',
          payment_schedule: data.content?.payment_schedule || '{}',
          terms_and_conditions: data.content?.terms_and_conditions || '',
          client_responsibilities: data.content?.client_responsibilities || '{}',
          signature: data.content?.signature || '{}'
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update proposal');
    }

    const proposal = await response.json();
    return proposal;
  } catch (error) {
    console.error('Error updating proposal:', error);
    throw error;
  }
}

export const deleteProposal = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete proposal');
  }
};

// Update the sendProposal function to use new property names
export async function sendProposal(proposalId: string) {
  try {
    const proposal = await getProposal(proposalId)
    if (!proposal) {
      throw new Error("Proposal not found")
    }

    // Generate a unique token for the client view
    const token = crypto.randomUUID()
    
    // Update the proposal with the token and set status to sent
    const updatedProposal = await updateProposal(proposalId, {
      title: proposal.title,
      client_id: proposal.client_id,
      project_id: proposal.project_id,
      content: proposal.content,
      client_token: token
    })

    // Generate the client view URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const clientUrl = `${baseUrl}/proposals/${proposalId}/client?token=${token}`

    return {
      success: true,
      clientUrl
    }
  } catch (error) {
    console.error('Error sending proposal:', error)
    throw error
  }
}

export async function acceptProposal(id: string, data: Partial<Proposal>): Promise<Proposal> {
  try {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        client_id: data.client_id,
        project_id: data.project_id,
        status: data.status, // You will pass status as 'approved' or 'signed'
        is_template: data.is_template,
        current_version: data.current_version,
        content: {
          id: data.content?.id,
          proposal_id: data.content?.proposal_id,
          scope_of_work: data.content?.scope_of_work || '',
          deliverables: data.content?.deliverables || '[]',
          timeline_start: data.content?.timeline_start || '',
          timeline_end: data.content?.timeline_end || '',
          pricing: data.content?.pricing || '[]',
          payment_schedule: data.content?.payment_schedule || '{}',
          terms_and_conditions: data.content?.terms_and_conditions || '',
          client_responsibilities: data.content?.client_responsibilities || '{}',
          signature: data.content?.signature || '{}'
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to accept proposal');
    }

    const proposal = await response.json();
    return proposal;
  } catch (error) {
    console.error('Error accepting proposal:', error);
    throw error;
  }
}


// Update the rejectProposal function to use new property names
export async function rejectProposal(id: string, data: Partial<Proposal>): Promise<Proposal> {
  try {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        client_id: data.client_id,
        project_id: data.project_id,
        status: data.status, // You will pass status as 'approved' or 'signed'
        is_template: data.is_template,
        current_version: data.current_version,
        content: {
          id: data.content?.id,
          proposal_id: data.content?.proposal_id,
          scope_of_work: data.content?.scope_of_work || '',
          deliverables: data.content?.deliverables || '[]',
          timeline_start: data.content?.timeline_start || '',
          timeline_end: data.content?.timeline_end || '',
          pricing: data.content?.pricing || '[]',
          payment_schedule: data.content?.payment_schedule || '{}',
          terms_and_conditions: data.content?.terms_and_conditions || '',
          client_responsibilities: data.content?.client_responsibilities || '{}',
          signature: data.content?.signature || '{}'
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to accept proposal');
    }

    const proposal = await response.json();
    return proposal;
  } catch (error) {
    console.error('Error accepting proposal:', error);
    throw error;
  }
}

// Update the duplicateProposal function to use new property names
export async function duplicateProposal(id: string): Promise<Proposal> {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}/duplicate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to duplicate proposal')
  }

  const data = await response.json()
  
  return {
    ...data,
    content: {
      id: data.content.id,
      proposal_id: data.content.proposal_id,
      scope_of_work: data.content.scope_of_work || '',
      deliverables: data.content.deliverables || '',
      timeline_start: data.content.timeline_start || '',
      timeline_end: data.content.timeline_end || '',
      pricing: data.content.pricing || '',
      payment_schedule: data.content.payment_schedule || '',
      terms_and_conditions: data.content.terms_and_conditions || '',
      client_responsibilities: data.content.client_responsibilities || '',
      signature: data.content.signature || '',
      created_at: data.content.created_at,
      updated_at: data.content.updated_at
    }
  }
}

// Attachments
export const getAttachments = async (proposalId: string): Promise<Attachment[]> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/attachments`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch attachments');
  }
  return response.json();
};

export const addAttachment = async (proposalId: string, file: File): Promise<Attachment> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/attachments`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add attachment');
  }
  return response.json();
};

export const deleteAttachment = async (proposalId: string, attachmentId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/attachments/${attachmentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete attachment');
  }
};

// Comments
export const getComments = async (proposalId: string): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/comments`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch comments');
  }
  return response.json();
};

export const addComment = async (proposalId: string, userId: string, content: string): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      content: content,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add comment');
  }
  return response.json();
};

export const updateComment = async (proposalId: string, commentId: string, content: string): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: content,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update comment');
  }
  return response.json();
};

export const deleteComment = async (proposalId: string, commentId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete comment');
  }
};

// Signatures
export async function getSignatures(proposalId: string): Promise<Signature[]> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/signatures`);
  if (!response.ok) throw new Error('Failed to fetch signatures');
  return response.json();
}

export async function addSignature(proposalId: string, userId: string, type: "provider" | "client", signature: string): Promise<Signature> {
  const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/signatures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId, type, signature }),
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

// Fix the filterProposals function to return a value
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

export async function updateProposalSignature(id: string, signature: string): Promise<Proposal> {
  try {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}/signature`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ signature }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error);
      throw new Error(error.message || 'Failed to update proposal signature');
    }

    const result = await response.json();
    console.log('API Response:', result);
    return result;
  } catch (error) {
    console.error('Error updating proposal signature:', error);
    throw error;
  }
} 