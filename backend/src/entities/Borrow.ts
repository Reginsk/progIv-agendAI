import { IsDate } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './User'
import { Item } from './Item'

@Entity()
export class Borrow extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, user => user.borrows)
  user: User

  @ManyToOne(() => Item, item => item.borrows)
  item: Item

  @Column({ type: 'timestamptz' })
  @IsDate()
  borrow_date: Date

  @Column({ type: 'timestamptz' })
  @IsDate()
  due_date: Date

  @Column({ type: 'timestamptz', nullable: true })
  @IsDate()
  returned_date: Date

  @Column({ type: 'int' })
  quantity: number

  @Column()
  status: string

  @CreateDateColumn({ type: 'timestamptz' })
  @IsDate()
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  @IsDate()
  updated_at: Date
}
