import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5174,
      host: '0.0.0.0',
      proxy: {
        '/api/replicate': {
          target: 'https://api.replicate.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/replicate/, '/v1'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.REPLICATE_API_TOKEN}`);
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader('Prefer', 'wait');
              // The Vercel function expects "path" query param but locally we are using rewrite.
              // We need to allow the frontend to use a unified URL structure.
              // If frontend calls /api/replicate/predictions, rewrite logic above handles it:
              // /api/replicate/predictions -> /v1/predictions -> https://api.replicate.com/v1/predictions
              // This is slightly different from the Vercel function approach I wrote above.
              // Let's align them.
            });
          },
        },
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': '/src',
      }
    }
  };
});
