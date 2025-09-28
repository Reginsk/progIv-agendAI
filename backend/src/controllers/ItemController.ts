import { Request, Response } from 'express'
import { Item } from '../entities/Item'
import { itemMapper, mapArray } from '../utils/mappers'

export const saveItem = async (req: Request, res: Response) => {
  try {
    const item = Item.create(req.body)
    await item.save()
    return res.status(201).json(itemMapper(item))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const getItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } })
    if (!item) return res.status(404).json({ message: 'Item not found' })
    return res.json(itemMapper(item))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const listItem = async (_req: Request, res: Response) => {
  try {
    const items = await Item.find()
    return res.json(mapArray(items, i => itemMapper(i)))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const updateItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } })
    if (!item) return res.status(404).json({ message: 'Item not found' })

    Object.assign(item, req.body)
    await item.save()

    return res.json(itemMapper(item))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const removeItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } })
    if (!item) return res.status(404).json({ message: 'Item not found' })

    await item.softRemove()

    return res.json({
      message: 'Item removed'
    })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}
