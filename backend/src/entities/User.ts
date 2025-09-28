import { IsDate } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Borrow } from './Borrow'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  role: string

  @CreateDateColumn({ type: 'timestamptz' })
  @IsDate()
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  @IsDate()
  updated_at: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  @IsDate()
  deleted_at: Date

  @OneToMany(() => Borrow, borrow => borrow.user)
  borrows: Borrow[]
}
