// src/utils/utm-manager.ts
export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  src?: string;
  sck?: string;
  timestamp?: number;
}

export class UTMManager {
  private static instance: UTMManager;
  private utmData: UTMData | null = null;
  private clientIP: string | null = null;
  private baseUrl = 'https://6rc6t6tt-8010.brs.devtunnels.ms';

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

      if (data.found && data.data) {
        // Verifica se os dados não estão expirados (24 horas)
        const now = Date.now();
        if (now - data.data.timestamp < 24 * 60 * 60 * 1000) {
          this.utmData = data.data;
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erro ao recuperar UTMs:', error);
      return false;
    }
  }

  applyUTMsToURL(url: string): string {
    if (!this.utmData || !this.clientIP) return url;

    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);

      // Adiciona o IP
      params.set('ip', this.clientIP);

      // Adiciona os parâmetros UTM individualmente
      if (this.utmData.utm_source) params.set('utm_source', this.utmData.utm_source);
      if (this.utmData.utm_medium) params.set('utm_medium', this.utmData.utm_medium);
      if (this.utmData.utm_campaign) params.set('utm_campaign', this.utmData.utm_campaign);
      if (this.utmData.utm_content) params.set('utm_content', this.utmData.utm_content);
      if (this.utmData.utm_term) params.set('utm_term', this.utmData.utm_term);
      if (this.utmData.src) params.set('src', this.utmData.src);
      if (this.utmData.sck) params.set('sck', this.utmData.sck);

      urlObj.search = params.toString();
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  getUTMData(): UTMData | null {
    return this.utmData;
  }

  getIP(): string | null {
    return this.clientIP;
  }
}

// Hook personalizado para usar o UTMManager
import { useEffect, useState } from 'react';

export function useUTMs() {
  const [utms, setUtms] = useState<UTMData | null>(null);
  const [clientIP, setClientIP] = useState<string | null>(null);

  useEffect(() => {
    const loadUTMs = async () => {
      const manager = UTMManager.getInstance();
      const ip = await manager.getClientIP();
      setClientIP(ip);
      
      await manager.fetchStoredUTMs();
      setUtms(manager.getUTMData());
    };

    loadUTMs();
  }, []);

  return { utms, clientIP };
}