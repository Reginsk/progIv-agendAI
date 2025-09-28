import './bootstrap'
import 'reflect-metadata'
import 'express-async-errors'
import express from 'express'
import { init } from '@sentry/node'
import routes from './routes'
import cors from 'cors';

init({ dsn: process.env.SENTRY_DSN })

const app = express()

app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true
}));

app.use(express.json())
app.use(routes)

export default app
