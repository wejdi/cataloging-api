import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/product.schema'
import { CategoriesModule } from '../categories/categories.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    CategoriesModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
  ]
})
export class ProductsModule {}
