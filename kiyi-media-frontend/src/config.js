export const SERVER_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5002'  // <--- DİKKAT: "https" DEĞİL "http" OLMALI
  : 'https://kiyi.trackbangserver.com'; // Canlı sunucun https olabilir