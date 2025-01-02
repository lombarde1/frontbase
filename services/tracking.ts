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
  
  export function getTrackingParams(): TrackingParams {
    if (typeof window === 'undefined') return {};
  
    const urlParams = new URLSearchParams(window.location.search);
    const trackingParams: TrackingParams = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_content: urlParams.get('utm_content'),
      utm_term: urlParams.get('utm_term'),
      src: urlParams.get('src'),
      sck: urlParams.get('sck')
    };
  
    return trackingParams;
  }
  
  // Função para persistir parâmetros UTM na sessão
  export function persistTrackingParams() {
    if (typeof window === 'undefined') return;
    
    const params = getTrackingParams();
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