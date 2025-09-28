import { Request, Response } from 'express'
import { User } from '../entities/User'
import { mapArray, userMapper } from '../utils/mappers'

export const saveUser = async (req: Request, res: Response) => {
  try {
    const user = User.create(req.body)
    await user.save()
    return res.status(201).json(userMapper(user))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } })
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.json(user)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const listUser = async (_req: Request, res: Response) => {
  try {
    const users = await User.find()
    return res.json(mapArray(users, u => userMapper(u)))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    Object.assign(user, req.body)
    await user.save()

    return res.json(userMapper(user))
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    await user.remove()

    return res.json({ message: 'User deleted successfully' })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}
