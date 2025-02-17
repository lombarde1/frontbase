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
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);

      // Adiciona o IP apenas se estiver disponível
      if (this.clientIP) {
        params.set('ip', this.clientIP);
      }

      // Adiciona os parâmetros UTM apenas se existirem e forem válidos
      if (this.utmData) {
        const utmParams = {
          utm_source: this.utmData.utm_source,
          utm_medium: this.utmData.utm_medium,
          utm_campaign: this.utmData.utm_campaign,
          utm_content: this.utmData.utm_content,
          utm_term: this.utmData.utm_term,
          src: this.utmData.src,
          sck: this.utmData.sck
        };

        // Adiciona apenas os parâmetros que existem e têm valor
        Object.entries(utmParams).forEach(([key, value]) => {
          if (value && typeof value === 'string') {
            params.set(key, value);
          }
        });
      }

      // Constrói a URL final
      urlObj.search = params.toString();
      return urlObj.toString();
    } catch (error) {
      console.error('Erro ao aplicar UTMs na URL:', error);
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