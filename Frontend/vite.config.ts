import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize React runtime
      jsxRuntime: 'automatic',
    }),
  ],
  server: {
    port: 3000,
    host: true
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      // Reduce bundle size with aggressive tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        manualChunks: (id) => {
          // Split node_modules into separate chunks for better caching
          if (id.includes('node_modules')) {
            // Core React libraries - most critical
            if (id.includes('react') && !id.includes('react-dom') && !id.includes('react-router')) {
              return 'react-core';
            }
            if (id.includes('react-dom')) {
              return 'react-dom';
            }
            // Router - separate chunk
            if (id.includes('react-router')) {
              return 'react-router';
            }
            // Helmet - separate chunk
            if (id.includes('react-helmet')) {
              return 'helmet-vendor';
            }
            // Icons - separate chunk (usually not critical)
            if (id.includes('@heroicons') || id.includes('lucide')) {
              return 'icons-vendor';
            }
            // Other vendor code
            return 'vendor';
          }
          // Split large components into separate chunks for better progressive loading
          // Hero component - critical for LCP
          if (id.includes('/components/state/StateHero')) {
            return 'state-hero';
          }
          // Other state components
          if (id.includes('/components/state/')) {
            return 'state-components';
          }
          // Navbar - critical for initial render
          if (id.includes('/components/common/Navbar')) {
            return 'navbar';
          }
          // Footer - less critical, can load later
          if (id.includes('/components/common/Footer')) {
            return 'footer';
          }
          // Other common components
          if (id.includes('/components/common/')) {
            return 'common-components';
          }
          // Service components
          if (id.includes('/components/services/')) {
            return 'service-components';
          }
          // Service pages
          if (id.includes('/pages/services/')) {
            return 'service-pages';
          }
          // Other pages
          if (id.includes('/pages/')) {
            return 'pages';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/media/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/${ext}/[name]-[hash][extname]`;
        },
      },
    },
    // Optimize chunk size - smaller chunks for better loading
    chunkSizeWarningLimit: 300,
    // Enable minification (esbuild is faster than terser)
    minify: 'esbuild',
    // Remove console.log in production
    esbuild: {
      drop: ['console', 'debugger'],
      legalComments: 'none', // Remove comments
      treeShaking: true, // Enable tree shaking
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      target: 'es2015', // Target modern browsers
    },
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize assets - reduce inline limit for better caching
    assetsInlineLimit: 1024, // Inline assets smaller than 1kb only
    // Report compressed size
    reportCompressedSize: false, // Faster builds
    // Target modern browsers for smaller bundle
    target: 'es2015',
    // Optimize CSS
    css: {
      devSourcemap: false,
      postcss: {
        // Optimize CSS output
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
    // Exclude from optimization
    exclude: [],
  },
})

