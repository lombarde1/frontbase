// services/tracking.ts
export interface TrackingParams {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  src?: string | null;
  sck?: string | null;
}

// Função para obter IP do cliente
async function getClientIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return null;
  }
}
//
// Função para buscar UTMs da API
export async function getTrackingParams(): Promise<TrackingParams> {
  if (typeof window === 'undefined') return {};

  try {
    // Primeiro obtém o IP
    const clientIP = await getClientIP();
    if (!clientIP) {
      console.log('IP não encontrado');
      return {};
    }

    // Depois busca as UTMs usando o IP
    const response = await fetch(`https://apicoinbase2.operacao2k25.shop/api/tracking/get-utms?ip=${clientIP}`);
    const data = await response.json();

    if (data.success && data.found && data.data) {
      // Remove o timestamp e retorna apenas os parâmetros UTM
      const { timestamp, ...utmParams } = data.data;
      console.log('UTMs encontradas:', utmParams);
      return utmParams;
    }
  } catch (error) {
    console.error('Erro ao buscar UTMs:', error);
  }

  return {};
}

// Função para persistir parâmetros UTM na sessão
export async function persistTrackingParams() {
  if (typeof window === 'undefined') return;
  
  const params = await getTrackingParams();
  if (Object.values(params).some(value => value)) {
    sessionStorage.setItem('tracking_params', JSON.stringify(params));
  }
}

// Função para recuperar parâmetros UTM persistidos
export function getPersistedTrackingParams(): TrackingParams {
  if (typeof window === 'undefined') return {};

  const stored = sessionStorage.getItem('tracking_params');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }
  return {};
}