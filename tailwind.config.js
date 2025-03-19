module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'weather-primary': '#00668A',
        'weather-secondary': '#3B3B54',
      },
      backgroundImage: {
        'my-background': "url('@/assets/image/Background.png')", // 根据实际路径调整
        'cloudy-bg': "url('@/assets/image/cloudy-pic.jpg')",
      },
    },
    fontFamily: {
      Roboto: ['Roboto, sans-serif'],
    },
    container: {
      padding: '2rem',
      center: true,
    },
    screens: {
      sm: '640px',
      md: '768px',
    },
  },
  plugins: [],
}
