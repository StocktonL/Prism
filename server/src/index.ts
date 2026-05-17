import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import eligibilityRouter from './routes/eligibility'
import patientsRouter from './routes/patients'
import campaignsRouter from './routes/campaigns'

const app = express()
const PORT = process.env.PORT ?? 3001

// Security headers
app.use(helmet())

// CORS — allow Vite dev server
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  }),
)

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/eligibility', eligibilityRouter)
app.use('/api/patients', patientsRouter)
app.use('/api/campaigns', campaignsRouter)

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Prism server running on http://localhost:${PORT}`)
})

export default app
