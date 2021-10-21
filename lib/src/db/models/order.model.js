var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { User } from '@db/models/user.model';
import { Table, Model, Column, CreatedAt, UpdatedAt, BelongsTo, ForeignKey } from 'sequelize-typescript';
let Order = class Order extends Model {
};
__decorate([
    Column,
    __metadata("design:type", String)
], Order.prototype, "firstName", void 0);
__decorate([
    ForeignKey(() => User),
    Column,
    __metadata("design:type", Number)
], Order.prototype, "customerId", void 0);
__decorate([
    BelongsTo(() => User, 'customerId'),
    __metadata("design:type", User)
], Order.prototype, "customer", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
Order = __decorate([
    Table
], Order);
export { Order };
//# sourceMappingURL=order.model.js.map