import { Router } from 'express'
import { getUser, listUser, saveUser, updateUser, deleteUser } from '../controllers/UserController'

const userRoutes = Router()

userRoutes.post('/users', saveUser)

userRoutes.get('/users', listUser)

userRoutes.get('/users/:id', getUser)

userRoutes.put('/users/:id', updateUser)

userRoutes.delete('/users/:id', deleteUser)

export default userRoutes
