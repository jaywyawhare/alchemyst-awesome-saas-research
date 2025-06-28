const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CitationRequest {
  paper_url: string;
  citation_style: string;
}

export interface LiteratureRequest {
  topic: string;
  max_results: number;
}

export interface CollaborationRequest {
  paper_id: string;
  comment: string;
  user_id: string;
}

export interface DataExtractionRequest {
  file_content: string;
  extraction_type: string;
}

export interface ProposalRequest {
  research_topic: string;
  research_question: string;
  methodology: string;
  expected_outcomes: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Citation Agent
  async generateCitation(request: CitationRequest) {
    return this.request<{ citation: string; style: string }>('/api/citation/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getCitationStyles() {
    return this.request<{ styles: string[] }>('/api/citation/styles');
  }

  // Literature Agent
  async searchLiterature(request: LiteratureRequest) {
    return this.request<{ papers: any[]; topic: string }>('/api/literature/search', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async categorizePapers(papers: any[]) {
    return this.request<{ categorized_papers: any[] }>('/api/literature/categorize', {
      method: 'POST',
      body: JSON.stringify(papers),
    });
  }

  // Collaboration Agent
  async addComment(request: CollaborationRequest) {
    return this.request<{ success: boolean; comment_id: string }>('/api/collaboration/comment', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getComments(paperId: string) {
    return this.request<{ comments: any[] }>(`/api/collaboration/comments/${paperId}`);
  }

  // Data Extraction Agent
  async extractData(request: DataExtractionRequest) {
    return this.request<{ extracted_data: any }>('/api/data/extract', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async analyzeData(data: any) {
    return this.request<{ analysis: any }>('/api/data/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Proposal Agent
  async generateProposal(request: ProposalRequest) {
    return this.request<{ proposal: any }>('/api/proposal/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async improveProposal(proposalText: string, feedback: string) {
    return this.request<{ improved_proposal: any }>('/api/proposal/improve', {
      method: 'POST',
      body: JSON.stringify({ proposal_text: proposalText, feedback }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; agents: string[] }>('/health');
  }
}

export const apiService = new ApiService(); 