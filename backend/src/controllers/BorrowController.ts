import { Request, Response } from 'express'
import { Borrow } from '../entities/Borrow'
import { Item } from '../entities/Item'
import { User } from '../entities/User'
import { borrowMapper, mapArray } from '../utils/mappers'

export const saveBorrow = async (req: Request, res: Response) => {
  try {
    const { userId, itemId, quantity, borrow_date, due_date } = req.body

    const user = await User.findOne({ where: { id: userId } })
    const item = await Item.findOne({ where: { id: itemId } })

    if (!user) return res.status(404).json({ message: 'User not found' })
    if (!item) return res.status(404).json({ message: 'Item not found' })

    if (item.available_quantity < quantity) {
      return res.status(400).json({ message: 'Not enough items available' })
    }

    const borrow = Borrow.create({
      user,
      item,
      quantity,
      borrow_date,
      due_date,
      status: 'borrowed'
    })

    // Atualiza estoque
    item.available_quantity -= quantity
    await item.save()
    await borrow.save()

    return res.status(201).json(borrowMapper(borrow))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const getBorrow = async (req: Request, res: Response) => {
  try {
    const borrow = await Borrow.findOne({
      where: { id: req.params.id },
      relations: ['user', 'item']
    })
    if (!borrow) return res.status(404).json({ message: 'Borrow not found' })
    return res.json(borrowMapper(borrow))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const listBorrow = async (_req: Request, res: Response) => {
  try {
    const borrows = await Borrow.find({ relations: ['user', 'item'] })
    return res.json(mapArray(borrows, b => borrowMapper(b)))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const updateBorrow = async (req: Request, res: Response) => {
  try {
    const borrow = await Borrow.findOne({
      where: { id: req.params.id },
      relations: ['item']
    })
    if (!borrow) return res.status(404).json({ message: 'Borrow not found' })

    const prevReturnedDate = borrow.returned_date

    Object.assign(borrow, req.body)
    await borrow.save()

    // Se devolveu agora e antes não estava devolvido → aumenta estoque
    if (!prevReturnedDate && borrow.returned_date) {
      borrow.item.available_quantity += borrow.quantity
      await borrow.item.save()
    }

    return res.json(borrowMapper(borrow))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}
