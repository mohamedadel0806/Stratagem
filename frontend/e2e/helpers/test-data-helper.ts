import { Page } from '@playwright/test';

export interface RiskData {
  title: string;
  description?: string;
  risk_statement?: string;
  category?: string;
  status?: string;
  likelihood?: string;
  impact?: string;
  threat_source?: string;
  risk_velocity?: string;
}

export interface TreatmentData {
  title: string;
  description?: string;
  strategy?: string;
  status?: string;
  priority?: string;
}

export interface KRIData {
  name: string;
  description?: string;
  measurement_frequency?: string;
}

export interface AssessmentRequestData {
  notes?: string;
  assessment_type?: string;
  priority?: string;
}

export class TestDataHelper {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page, baseURL: string) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async findExistingRiskId(): Promise<string | null> {
    try {
      const response = await this.page.request.get(`${this.baseURL}/api/risks`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok()) {
        const data = await response.json();
        if (data?.risks?.length > 0) {
          return data.risks[0].id;
        }
      }
    } catch (error) {
      console.log('Failed to fetch existing risk:', error);
    }
    return null;
  }

  async createTestRisk(data: Partial<RiskData> = {}): Promise<string> {
    const riskData: RiskData = {
      title: `E2E Test Risk ${Date.now()}`,
      description: 'E2E test risk description',
      risk_statement: 'If unauthorized users exploit weak authentication, then data breach may occur',
      category: 'Cybersecurity',
      status: 'Identified',
      likelihood: '4 - Likely',
      impact: '4 - Major',
      threat_source: 'External',
      risk_velocity: 'Fast (Days)',
      ...data
    };

    const response = await this.page.request.post(`${this.baseURL}/api/risks`, {
      headers: this.getAuthHeaders(),
      data: riskData
    });

    if (!response.ok()) {
      const error = await response.text();
      throw new Error(`Failed to create test risk: ${error}`);
    }

    const result = await response.json();
    return result.id || result.risk?.id;
  }

  async createTestTreatment(riskId: string, data: Partial<TreatmentData> = {}): Promise<string> {
    const treatmentData: TreatmentData = {
      title: `E2E Test Treatment ${Date.now()}`,
      description: 'E2E test treatment description',
      strategy: 'Mitigate',
      status: 'Planned',
      priority: 'High',
      ...data
    };

    const response = await this.page.request.post(`${this.baseURL}/api/treatments`, {
      headers: this.getAuthHeaders(),
      data: {
        ...treatmentData,
        risk_id: riskId
      }
    });

    if (!response.ok()) {
      const error = await response.text();
      throw new Error(`Failed to create test treatment: ${error}`);
    }

    const result = await response.json();
    return result.id || result.treatment?.id;
  }

  async createTestKRI(data: Partial<KRIData> = {}): Promise<string> {
    const kriData: KRIData = {
      name: `E2E Test KRI ${Date.now()}`,
      description: 'E2E test KRI description',
      measurement_frequency: 'Monthly',
      ...data
    };

    const response = await this.page.request.post(`${this.baseURL}/api/kris`, {
      headers: this.getAuthHeaders(),
      data: kriData
    });

    if (!response.ok()) {
      const error = await response.text();
      throw new Error(`Failed to create test KRI: ${error}`);
    }

    const result = await response.json();
    return result.id || result.kri?.id;
  }

  async createTestAssessmentRequest(riskId: string, data: Partial<AssessmentRequestData> = {}): Promise<string> {
    const requestData: AssessmentRequestData = {
      assessment_type: 'Current',
      priority: 'Medium',
      notes: 'E2E test assessment request',
      ...data
    };

    const response = await this.page.request.post(`${this.baseURL}/api/assessment-requests`, {
      headers: this.getAuthHeaders(),
      data: {
        ...requestData,
        risk_id: riskId
      }
    });

    if (!response.ok()) {
      const error = await response.text();
      throw new Error(`Failed to create test assessment request: ${error}`);
    }

    const result = await response.json();
    return result.id || result.request?.id;
  }

  async cleanupTestRisk(riskId: string): Promise<void> {
    try {
      await this.page.request.delete(`${this.baseURL}/api/risks/${riskId}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.log(`Failed to cleanup risk ${riskId}:`, error);
    }
  }

  async cleanupTestTreatment(treatmentId: string): Promise<void> {
    try {
      await this.page.request.delete(`${this.baseURL}/api/treatments/${treatmentId}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.log(`Failed to cleanup treatment ${treatmentId}:`, error);
    }
  }

  async cleanupTestKRI(kriId: string): Promise<void> {
    try {
      await this.page.request.delete(`${this.baseURL}/api/kris/${kriId}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.log(`Failed to cleanup KRI ${kriId}:`, error);
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const cookies = this.page.context().cookies();
    const authCookie = cookies.find(c => c.name.includes('token') || c.name.includes('session'));

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (authCookie) {
      headers['Authorization'] = `Bearer ${authCookie.value}`;
    }

    return headers;
  }

  generateUniqueId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}