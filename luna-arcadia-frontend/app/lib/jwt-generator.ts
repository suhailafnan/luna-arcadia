// Simple JWT generator for demo (uses client-side generation)
// In production, this should be done server-side

export function generateUserJWT(email: string): string {
    // Using the JWT builder format from your Postman
    const header = {
      typ: "JWT",
      alg: "HS256"
    };
    
    const payload = {
      iss: "Luna Arcadia",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year
      aud: "www.luna-arcadia.com",
      sub: email,
      Email: email
    };
    
    const secret = "luna_arcadia_hackathon_secret_2025";
    
    // Simple base64 encoding (for demo only)
    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));
    const signature = btoa(`${base64Header}.${base64Payload}.${secret}`);
    
    return `${base64Header}.${base64Payload}.${signature}`;
  }
  