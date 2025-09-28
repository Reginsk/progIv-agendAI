import { Router } from 'express'
import { register, login, me } from '../controllers/AuthController'
import { authenticateToken } from '../middleware/auth'

const authRoutes = Router()

authRoutes.post('/auth/register', register)
authRoutes.post('/auth/login', login)

authRoutes.get('/auth/me', authenticateToken, me)

export default authRoutes