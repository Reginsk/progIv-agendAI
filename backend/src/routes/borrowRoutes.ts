import { Router } from 'express'
import { saveBorrow, getBorrow, listBorrow, updateBorrow } from '../controllers/BorrowController'

const borrowRoutes = Router()

borrowRoutes.post('/borrows', saveBorrow)

borrowRoutes.get('/borrows', listBorrow)

borrowRoutes.get('/borrows/:id', getBorrow)

borrowRoutes.put('/borrows/:id', updateBorrow)

export default borrowRoutes
