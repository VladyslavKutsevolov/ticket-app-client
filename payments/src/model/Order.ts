import mongoose from "mongoose";
import { OrderStatus } from "@vladtickets/common";

interface OrderAttr {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (attrs: OrderAttr) => OrderDoc;
}
const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attr: OrderAttr) => {
  return new Order({
    _id: attr.id,
    price: attr.price,
    version: attr.version,
    userId: attr.userId,
    status: attr.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
