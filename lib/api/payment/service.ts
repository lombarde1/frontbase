import { getUserId } from '@/lib/auth/storage';
import type { GeneratePixRequest, PixResponse, PaymentStatus } from './types';
import { getPersistedTrackingParams } from '@/services/tracking';

const API_URL = 'https://zcash.evolucaohot.online/api';

export async function generatePix(amount: number, email: string): Promise<PixResponse> {
  const userId = getUserId();
  if (!userId) throw new Error('User not authenticated');

  // Obter parâmetros de tracking
  const trackingParams = getPersistedTrackingParams();

  try {
    const response = await fetch(`${API_URL}/payment/generate-pix/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        email,
        trackingParams: {
          ...trackingParams,
          ip: await getClientIP(), // Opcional: implementar função para obter IP
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          page_url: window.location.href
        }
      })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate PIX');
    }

    

    return data.data;
  } catch (error) {
    console.error('Error generating PIX:', error);
    throw error;
  }
}

// Função auxiliar para obter IP do cliente (opcional)
async function getClientIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
}

export async function checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  try {

    const response = await fetch(`${API_URL}/payment/check-status/${transactionId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to check payment status');
    }

    return data.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
}