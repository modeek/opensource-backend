import { User } from '@db/models/User';
import { DataTypes, Optional } from 'sequelize';
import { Table, Model, Column, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';

interface AuthTokenAttributes {
  id: number;
  userId: number;
}

type AuthTokenCreationAttributes = Optional<AuthTokenAttributes, 'id'>;

@Table({
  tableName: 'AuthTokens',
})
export class AuthToken extends Model<AuthTokenAttributes, AuthTokenCreationAttributes> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({
    defaultValue: DataTypes.UUIDV4,
    type: DataTypes.UUID,
  })
  token: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column({
    defaultValue: new Date().getTime() + 1000 * 60 * 60 * 2,
    type: DataTypes.DATE,
  })
  expiresAt: Date;
}
