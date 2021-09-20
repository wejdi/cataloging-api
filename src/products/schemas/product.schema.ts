import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Category } from '../../categories/schemas/category.schema'

export type ProductDocument = Product & mongoose.Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;   
  
  @Prop({ required: true,  type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category; 

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  created_at: Date;

  @Prop({ required: true })
  modified_at: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);