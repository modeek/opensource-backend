// import { Order } from '@db/models/Order';
// import { Optional } from 'sequelize';
// import { Table, Model, Column, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';

// interface ItemAttributes {
//   id: number;
//   customerId: number;
//   cardId: number;
//   driverTip: number;
// }

// type ItemCreationAttributes = Optional<ItemAttributes, 'id'>;

// @Table({
//   tableName: 'Items',
// })
// export class Item extends Model<ItemAttributes, ItemCreationAttributes> {
//   @ForeignKey(() => Order)
//   @Column
//   orderId: number;

//   @CreatedAt
//   createdAt: Date;

//   @UpdatedAt
//   updatedAt: Date;
// }
