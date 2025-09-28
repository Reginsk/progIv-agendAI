import { IsDate } from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Integration extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  url: string

  @Column()
  token: string

  @CreateDateColumn({ type: 'timestamptz' })
  @IsDate()
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  @IsDate()
  updated_at: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  @IsDate()
  deleted_at: Date
}
