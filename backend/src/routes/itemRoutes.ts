import { Router } from 'express'
import { getItem, listItem, saveItem, updateItem, removeItem } from '../controllers/ItemController'

const itemRoutes = Router()

itemRoutes.post('/items', saveItem)

itemRoutes.get('/items', listItem)

itemRoutes.get('/items/:id', getItem)

itemRoutes.put('/items/:id', updateItem)

itemRoutes.delete('/items/:id', removeItem)

export default itemRoutes
