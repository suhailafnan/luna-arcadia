import axios from 'axios';

const PHOTON_API_URL = process.env.NEXT_PUBLIC_PHOTON_API_URL!;
const PHOTON_API_KEY = process.env.NEXT_PUBLIC_PHOTON_API_KEY!;

const photonClient = axios.create({
  baseURL: PHOTON_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': PHOTON_API_KEY,
  },
});

export interface PhotonUser {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  wallet: {
    photonUserId: string;
    walletAddress: string;
  };
}

// Onboard user with JWT
export async function registerUserWithJWT(
  jwt: string,
  clientUserId: string
): Promise<PhotonUser> {
  const response = await photonClient.post('/identity/register', {
    provider: 'jwt',
    data: {
      token: jwt,
      client_user_id: clientUserId,
    },
  });
  
  return response.data.data;
}

// Send rewarded campaign event
export async function sendRewardedEvent(
  eventId: string,
  eventType: string,
  clientUserId: string,
  campaignId: string
) {
  const response = await photonClient.post('/attribution/events/campaign', {
    event_id: eventId,
    event_type: eventType,
    client_user_id: clientUserId,
    campaign_id: campaignId,
    metadata: {},
    timestamp: new Date().toISOString(),
  });
  
  return response.data.data;
}

export default photonClient;
