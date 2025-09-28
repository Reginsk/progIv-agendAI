import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../entities/User'
import { userMapper } from '../utils/mappers'

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'user' } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    await user.save()

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    const userResponse = userMapper(user)

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse
    })
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    console.log("user", user)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = password === user.password 
    // await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    const userResponse = userMapper(user)
    delete (userResponse as any).password

    return res.json({
      message: 'Login successful',
      token,
      user: userResponse
    })
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}

export const me = async (req: Request & { user?: User }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' })
    }

    const userResponse = userMapper(req.user)
    delete (userResponse as any).password

    return res.json({
      user: userResponse
    })
  } catch (error: any) {
    return res.status(400).json({ error: error.message })
  }
}