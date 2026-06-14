export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        shield: {
          black: '#0B1020',
          panel: '#11182C',
          blue: '#00E5FF',
          purple: '#8B5CF6',
          emerald: '#00FF88',
          danger: '#FF3864',
          amber: '#FFB020',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(0, 229, 255, 0.24)',
        purple: '0 0 32px rgba(139, 92, 246, 0.24)',
      },
      backgroundImage: {
        cybergrid: 'linear-gradient(rgba(0,229,255,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.09) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
