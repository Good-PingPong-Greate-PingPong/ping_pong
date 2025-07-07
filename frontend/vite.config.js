// frontend/vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:443',
        changeOrigin: true,
        secure: false, // 개발용 인증서라면 false로
      }
    }
  }
}