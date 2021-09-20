import { Logger, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema'
import { CategoriesService } from '../categories/categories.service';
import { ProductDto } from './dto/product.dto';
import { Category } from 'src/categories/schemas/category.schema';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name)

  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>,
              private readonly categoriesService: CategoriesService) {}
  /**
   *  Add a new product, specified category will be created if it is not found in the db
   * @param createProductDto New product to add
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.debug(`create: Add a new product: ${JSON.stringify(createProductDto)}`);
    const category = await this.getOrCreateCategory(createProductDto.category); 
    const createdProduct = new this.productModel({
      ...createProductDto,
      category: category._id,
      created_at: new Date(),
      modified_at: new Date()

    });
    try {
      return await createdProduct.save();
    } catch (error) {
      this.logger.error(`create: Unable to add product du to a server error, error: ${error}`);
      throw new HttpException ('Server error: Unable to add new product', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * Find all product
   */
  async findAll(): Promise<Product[]> {
    this.logger.debug(`findAll: Search all products`);
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      this.logger.error(`findAll: Unable to get products du to a server error, error: ${error}`);
      throw new HttpException ('Server error: Unable to get products', HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }
  /**
   * Find product by it's id
   * @param id of the product to find
   */
  async findOne(id: string): Promise <ProductDto> {
    this.logger.debug(`findOne: Search product with Id: ${id}`);
    let product: Product;
    try {
      product = await this.productModel.findById(id)
      .populate({path: 'category', select: 'label'})
      .exec();
    } catch (error) {
      this.logger.error(`findOne: Unable to get product du to a server error, product Id: ${id}, error: ${error}`);
      throw new HttpException ('Server error: Unable to get product', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if(!product) {
      this.logger.log(`findOne: product was not found, Id: ${id}`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return new ProductDto(product);
  }
  /**
   * Update product with specified id using updateProductDto data, new category value will be created if it's not found 
   * @param id of the product to update
   * @param updateProductDto properties to update
   */
  async update(id: string, updateProductDto: UpdateProductDto): Promise <Product> {
    this.logger.debug(`update: Update product with Id: ${id}`);
    let category: Category;
    // TODO: check if product exists before adding category
    if (updateProductDto.category) {
      category = await this.getOrCreateCategory(updateProductDto.category);
    }
    
    const updateProduct = {
      ...updateProductDto,
      category: category,
      modified_at: new Date()
    };
    try {
      return await this.productModel.findByIdAndUpdate(id, updateProduct).exec();
    } catch (error) {
      this.logger.error(`update: Unable to update product du to a server error, product Id: ${id}, error: ${error}`);
      throw new HttpException ('Server error: Unable to update product', HttpStatus.INTERNAL_SERVER_ERROR)
    }
   
  }
  /**
   * Remove product with the a given id
   * @param id of the product to remove
   */
  async remove(id: string): Promise<Product> {
    try {
      return await this.productModel.findByIdAndDelete(id).exec();
    } catch (error) {
      this.logger.error(`remove: Unable to remove product du to a server error, product Id: ${id}, error: ${error}`);
      throw new HttpException ('Server error: Unable to remove product', HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  private async getOrCreateCategory(categoryLabel: string): Promise<Category> {
    let category = await this.categoriesService.findOne(categoryLabel) 
    || await this.categoriesService.create({label: categoryLabel});
    return category;

  }
}
