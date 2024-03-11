import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Supplier } from '../../suppliers/schemas/supplier.schema';
import { Category } from '../../categories/schemas/category.schema';

export enum Style {
  V_NECK = 'V-Neck',
  ROUNDED_NECK = 'Rounded-Neck',
}

export class Variant {
  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true, enum: Style })
  style: Style;

  @Prop({ required: false })
  stock: number;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: false })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  soldCount: number;

  @Prop({ required: true })
  variants: Variant[];

  @Prop({ required: true, type: Types.ObjectId, ref: Supplier.name })
  supplier: Supplier;

  @Prop({ required: true, type: Types.ObjectId, ref: Category.name })
  category: Category;
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
