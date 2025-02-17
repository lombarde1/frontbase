// src/utils/utm-manager.ts
export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  timestamp?: number;
}

export class UTMManager {
  private static instance: UTMManager;
  private utmData: any = null;
  private clientIP: string | null = null;
  private baseUrl = 'https://api.picoinvestbr.com';

  private constructor() {}

  static getInstance(): UTMManager {
    if (!UTMManager.instance) {
      UTMManager.instance = new UTMManager();
    }
    return UTMManager.instance;
  }

  async getClientIP(): Promise<string | null> {
    if (this.clientIP) return this.clientIP;

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      this.clientIP = data.ip;
      return this.clientIP;
    } catch (error) {
      console.error('Erro ao obter IP:', error);
      return null;
    }
  }

  async fetchStoredUTMs(): Promise<boolean> {
    try {
      const clientIP = await this.getClientIP();
      if (!clientIP) return false;

      const response = await fetch(`${this.baseUrl}/api/tracking/get-utms?ip=${clientIP}`);
      const data = await response.json();
      console.log('Resposta bruta da API:', data);

      if (data.success && data.data) {
        this.utmData = {
          utm_source: data.data.utm_source,
          utm_medium: data.data.utm_medium,
          timestamp: data.data.timestamp
        };
        console.log('UTMs salvas no manager:', this.utmData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao recuperar UTMs:', error);
      return false;
    }
  }

  getUTMData(): any {
    return this.utmData;
  }

  getIP(): string | null {
    return this.clientIP;
  }
}