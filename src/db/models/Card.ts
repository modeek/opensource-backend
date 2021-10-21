import { User } from '@db/models/User';
import { Optional } from 'sequelize';
import { Table, Model, Column, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';

interface CardAttributes {
  id: number;
  currentUserId?: number;
  userId: number;
  paymentId: string;
  brand: string;
  last4: string;
  exp_year: number;
  exp_month: number;
  funding: string;
  name: string;
}

type CardCreationAttributes = Optional<CardAttributes, 'id'>;

@Table({
  tableName: 'Cards',
})
export class Card extends Model<CardAttributes, CardCreationAttributes> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => User)
  @Column
  currentUserId: number;

  @Column
  paymentId: string;

  @Column
  brand: string;

  @Column
  last4: string;

  @Column
  exp_year: number;

  @Column
  exp_month: number;

  @Column
  funding: string;

  @Column
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
