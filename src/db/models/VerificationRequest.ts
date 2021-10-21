import { User } from '@db/models/User';
import { DataTypes, Optional } from 'sequelize';
import {
  Table,
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  AfterUpdate,
  BelongsTo,
  DefaultScope,
} from 'sequelize-typescript';

interface VerificationRequestAttributes {
  id: number;
  userId: number;
  idKey: string;
  failReason?: string;
  isVerified?: boolean;
  failedVerification?: boolean;
}

const accountSid = 'ACbb78bd582183017016a1de27efcdd4a8';
const authToken = '843a3e4f9407a94d0a1c65dfd4351b6a';
const client = require('twilio')(accountSid, authToken);

type VerificationRequestCreationAttributes = Optional<VerificationRequestAttributes, 'id'>;

@DefaultScope(() => ({
  include: ['user'],
}))
@Table({
  tableName: 'VerificationRequests',
})
export class VerificationRequest extends Model<VerificationRequestAttributes, VerificationRequestCreationAttributes> {
  @ForeignKey(() => User)
  @Column({
    allowNull: true,
    defaultValue: null,
  })
  userId: number;

  @BelongsTo(() => User, {
    constraints: false,
    foreignKey: 'userId',
    as: 'user',
  })
  user: User;

  @Column({
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  })
  isVerified: boolean;

  @Column({
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  })
  failedVerification: boolean;

  @Column
  idKey: string;

  @Column
  failReason: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @AfterUpdate
  static updateUser(instance: VerificationRequest): void {
    if (instance.isVerified) {
      instance.user.hasValidID = true;
      instance.user.hasUploadedID = true;
      instance.user.idKey = instance.idKey;
      instance.user.failReason = '';

      client.messages
        .create({
          body: `${`Hi from Sheesha,\nThank you for verifying your ID. Just a reminder, we do ask you to present your ID to our drivers in order to complete your order.`}`,
          messagingServiceSid: 'MG40b1ee7588a194dedd9244670a1b9fd6',
          to: `+1${instance.user.phoneNumber.replace('+1', '').replace(/\D/g, '')}`,
        })
        .then((message) => console.log(message.sid))
        .done();

      instance.user.save();
    } else if (instance.failedVerification) {
      instance.user.hasValidID = false;
      instance.user.hasUploadedID = false;
      instance.user.idKey = '';
      instance.user.failReason = instance.failReason;

      client.messages
        .create({
          body: `${`Hi from Sheesha,\nYour ID verification request was declined. You may attempt to upload another ID picture next time you log in or checkout.`}`,
          messagingServiceSid: 'MG40b1ee7588a194dedd9244670a1b9fd6',
          to: `+1${instance.user.phoneNumber.replace('+1', '').replace(/\D/g, '')}`,
        })
        .then((message) => console.log(message.sid))
        .done();
      instance.user.save();
    } else {
      instance.user.hasValidID = false;
      instance.user.save();
    }
  }
}
