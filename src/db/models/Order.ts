import { User } from '@db/models/User';
import { Card } from '@db/models/Card';
import { DataTypes, Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
  DefaultScope,
  AfterUpdate,
} from 'sequelize-typescript';
import { Driver } from './Driver';

const accountSid = 'ACbb78bd582183017016a1de27efcdd4a8';
const authToken = '843a3e4f9407a94d0a1c65dfd4351b6a';
const client = require('twilio')(accountSid, authToken);

interface FlavorAttribs {
  Name: string;
}

interface AddonAttribs {
  Name: string;
  Price: number;
}

interface ItemAttribs {
  Name: string;
  Flavors: Array<FlavorAttribs>;
  Quantity: number;
  Price: number;
  Addons: Array<AddonAttribs>;
}

interface OrderAttributes {
  id: number;
  customerId: number;
  cardId: number;
  driverTip: number;
  items: Array<ItemAttribs>;
  address: string;
  deliverAt: Date;
  notes?: string;
  paid?: boolean;
  paymentIntentId?: string;
  contactNumber: string;
  status?: number;
}

type OrderCreationAttributes = Optional<OrderAttributes, 'id'>;

@DefaultScope(() => ({
  include: ['driver', 'card'],
}))
@Table({
  tableName: 'Orders',
})
export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  @ForeignKey(() => User)
  @Column
  customerId: number;

  @BelongsTo(() => User, 'customerId')
  customer: User;

  @ForeignKey(() => Card)
  @Column
  cardId: number;

  @BelongsTo(() => Card, 'cardId')
  card: Card;

  @ForeignKey(() => Driver)
  @Column
  driverId: number;

  @BelongsTo(() => Driver, 'driverId')
  driver: Driver;

  @Column
  address: string;

  @Column
  contactNumber: string;

  @Column
  driverTip: number;

  @Column({
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  })
  paid: boolean;

  @Column(DataTypes.DATE)
  deliverAt: Date;

  @Column(DataTypes.TIME)
  dropoffTime: Date;

  @Column
  notes?: string;

  @Column
  paymentIntentId?: string;

  @Column(DataTypes.JSON)
  items: Array<ItemAttribs>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column({
    defaultValue: 1,
    type: DataTypes.INTEGER,
  })
  status: number;

  @Column(DataTypes.VIRTUAL)
  get totalPrice(): number {
    let total = 0;
    const items: Array<ItemAttribs> = this.getDataValue('items');

    items.forEach((order) => {
      total += order.Price * order.Quantity;
      order.Addons.forEach((addon) => {
        total += addon.Price * order.Quantity;
      });
    });
    return total + this.getDataValue('driverTip');
  }

  @AfterUpdate
  static updateUser(instance: Order): void {
    if (instance.status === 2) {
      client.messages
        .create({
          body: `${`Hi from Sheesha,\nYour order has been prepared & is on its way!\n\nTrack it by clicking the link below!\n\nhttps://sheesha.app/trackOrder?id=${instance.id}`}`,
          messagingServiceSid: 'MG40b1ee7588a194dedd9244670a1b9fd6',
          to: `+1${instance.contactNumber.replace(/\D/g, '')}`,
        })
        .then((message) => console.log(message.sid))
        .done();
    } else if (instance.status === 3) {
      client.messages
        .create({
          body: `Your driver has arrived, make sure to have your ID in order to recieve your products!`,
          messagingServiceSid: 'MG40b1ee7588a194dedd9244670a1b9fd6',
          to: `+1${instance.contactNumber.replace(/\D/g, '')}`,
        })
        .then((message) => console.log(message.sid))
        .done();
    } else if (instance.status === 4) {
      client.messages
        .create({
          body: `Thank you for using Sheesha, we hope to cater you again soon!`,
          messagingServiceSid: 'MG40b1ee7588a194dedd9244670a1b9fd6',
          to: `+1${instance.contactNumber.replace(/\D/g, '')}`,
        })
        .then((message) => console.log(message.sid))
        .done();
    }
  }
}
