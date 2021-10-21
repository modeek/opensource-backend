import { AuthToken } from '@db/models/AuthToken';
import { Optional } from 'sequelize';
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

interface DriverAttributes {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePicture: string;
  carBrand: string;
  carModel: string;
  carColor: string;
}

type DriverCreationAttributes = Optional<DriverAttributes, 'id'>;

@Table({
  tableName: 'Drivers',
})
export class Driver extends Model<DriverAttributes, DriverCreationAttributes> {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Unique
  @Column
  phoneNumber: string;

  @Column
  profilePicture: string;

  @Column
  carBrand: string;
  @Column
  carModel: string;
  @Column
  carColor: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => AuthToken)
  @AllowNull
  @Column
  currentAuthTokenId: number;

  @BelongsTo(() => AuthToken, {
    foreignKey: 'currentAuthTokenId',
    constraints: false,
  })
  currentAuthToken: AuthToken;
}
