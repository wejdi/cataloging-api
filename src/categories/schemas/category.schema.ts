import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';


export type CategoryDocument = Category & mongoose.Document;

@Schema()
export class Category {

  _id: mongoose.Schema.Types.ObjectId

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  created_at: Date;

  @Prop({ required: true })
  modified_at: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);