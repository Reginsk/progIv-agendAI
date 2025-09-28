import { Router } from 'express'
import userRoutes from './userRoutes'
import itemRoutes from './itemRoutes'
import borrowRoutes from './borrowRoutes'
import authRoutes from './authRoutes'

const routes = Router()

routes.use(authRoutes)
routes.use(userRoutes)
routes.use(itemRoutes)
routes.use(borrowRoutes)

export default routes
