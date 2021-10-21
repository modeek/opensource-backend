import { User } from '@db/models/User';
import { DataTypes, Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  Unique,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';

interface CreationTokenAttributes {
  id?: number;
  phoneNumber: string;
  token?: string;
  used?: boolean;
}

type CreationTokenCreationAttributes = Optional<CreationTokenAttributes, 'id'>;

@Table({
  tableName: 'CreationTokens',
})
export class CreationToken extends Model<CreationTokenAttributes, CreationTokenCreationAttributes> {
  @Unique
  @Column({
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
  })
  token: string;

  @Column({
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  })
  used: boolean;

  @Column
  phoneNumber: string;

  @ForeignKey(() => User)
  @AllowNull
  @Column
  userId: number;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    constraints: false,
  })
  user: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
