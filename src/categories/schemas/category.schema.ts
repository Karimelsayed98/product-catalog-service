import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: false })
  id: string;

  @Prop({ required: true })
  name: string;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
  }
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category);
