import { Order } from '@db/models/Order';
import { AuthToken } from '@db/models/AuthToken';
import { Card } from '@db/models/Card';
import { DataTypes, Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  HasMany,
  Unique,
  ForeignKey,
  AllowNull,
  BelongsTo,
  DefaultScope,
  HasOne,
} from 'sequelize-typescript';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthday: Date;
  hasValidID?: boolean;
  hasUploadedID?: boolean;
  idKey?: string;
  failReason?: string;
  stripeId?: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

@DefaultScope(() => ({
  include: ['card'],
}))
@Table({
  tableName: 'Users',
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Unique
  @Column
  phoneNumber: string;

  @Column({
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  })
  hasValidID: boolean;

  @Column({
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  })
  hasUploadedID: boolean;

  @Column
  idKey: string;

  @Column
  failReason: string;

  @Column
  stripeId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Order)
  orders: Order[];

  @ForeignKey(() => AuthToken)
  @AllowNull
  @Column
  currentAuthTokenId: number;

  @BelongsTo(() => AuthToken, {
    foreignKey: 'currentAuthTokenId',
    constraints: false,
  })
  currentAuthToken: AuthToken;

  @HasOne(() => Card, {
    foreignKey: 'currentUserId',
    constraints: false,
  })
  card: Card;

  @HasMany(() => Card, {
    foreignKey: 'userId',
    constraints: false,
  })
  cards: Card;

  @Column({
    type: DataTypes.DATEONLY,
  })
  birthday: Date;
}
