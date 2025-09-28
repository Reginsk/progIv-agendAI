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
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column()
  category: string

  @Column({ type: 'int' })
  total_quantity: number

  @Column({ type: 'int' })
  available_quantity: number

  @CreateDateColumn({ type: 'timestamptz' })
  @IsDate()
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  @IsDate()
  updated_at: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  @IsDate()
  deleted_at: Date

  @OneToMany(() => Borrow, borrow => borrow.item)
  borrows: Borrow[]
}
