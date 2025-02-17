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
  private baseUrl = 'https://6rc6t6tt-8010.brs.devtunnels.ms';

  private constructor() {}

  static getInstance(): UTMManager {
    if (!UTMManager.instance) {
      UTMManager.instance = new UTMManager();
    }
    return UTMManager.instance;
  }

  async fetchStoredUTMs(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tracking/get-utms`);
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
    if (!this.utmData) return url;

    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);

      // Adiciona os parâmetros UTM apenas se não existirem na URL
      Object.entries(this.utmData).forEach(([key, value]) => {
        if (key !== 'timestamp' && value && !params.has(key)) {
          params.set(key, value);
        }
      });

      urlObj.search = params.toString();
      return urlObj.toString();
    } catch {
      // Se a URL for inválida, retorna a original
      return url;
    }
  }

  getUTMData(): UTMData | null {
    return this.utmData;
  }
}

// Hook personalizado para usar o UTMManager
import { useEffect, useState } from 'react';

export function useUTMs() {
  const [utms, setUtms] = useState<UTMData | null>(null);

  useEffect(() => {
    const loadUTMs = async () => {
      const manager = UTMManager.getInstance();
      await manager.fetchStoredUTMs();
      setUtms(manager.getUTMData());
    };

    loadUTMs();
  }, []);

  return utms;
}