import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ required: false })
  id: string;

  @Prop({ required: true })
  name: string;

  constructor(supplier: Supplier) {
    this.id = supplier.id;
    this.name = supplier.name;
  }
}

export type SupplierDocument = Supplier & Document;

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
