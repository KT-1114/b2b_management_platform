const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('env', {
  supabaseConfig: {
    url: process.env.SUPABASE_URL,
    apiKey: process.env.SUPABASE_API_KEY
  }
});
