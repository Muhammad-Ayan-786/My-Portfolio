import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const vendorChunks = {
  react: ['react', 'react-dom', 'react-router', 'scheduler'],
  gsap: ['gsap', '@gsap/react', 'lenis'],
  motion: ['motion', 'framer-motion', 'motion-dom', 'motion-utils'],
  three: ['three'],
}

/**
 * Dev only: serve the Vercel functions in /api through Vite, so `npm run dev`
 * handles POST /api/contact exactly like production does.
 */
function vercelApi() {
  return {
    name: 'vercel-api-dev',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))
      server.middlewares.use('/api', async (req, res, next) => {
        const route = req.url.split('?')[0].replace(/^\/+|\/+$/g, '')
        if (!/^[\w-]+$/.test(route)) return next()
        let mod
        try {
          mod = await server.ssrLoadModule(`/api/${route}.js`)
        } catch {
          return next()
        }
        let raw = ''
        for await (const chunk of req) raw += chunk
        try {
          req.body = raw ? JSON.parse(raw) : {}
        } catch {
          req.body = raw
        }
        res.status = (code) => ((res.statusCode = code), res)
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        try {
          await mod.default(req, res)
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.end('Internal error')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApi()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Long-term cacheable vendor chunks
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          for (const [name, pkgs] of Object.entries(vendorChunks)) {
            if (pkgs.some((p) => id.includes(`/node_modules/${p}/`))) return name
          }
        },
      },
    },
  },
})
