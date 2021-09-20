import { Logger, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema'

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}
  private readonly logger = new Logger(CategoriesService.name)
  /**
   * Add new category
   * @param createCategoryDto category to add
   */
  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.logger.log(`create: add new category : ${JSON.stringify(createCategoryDto)}`);
    const createdCategory = new this.categoryModel({
      ...createCategoryDto,
      created_at: new Date(),
      modified_at: new Date()

    });
    return createdCategory.save();
  }
  /**
   * Find all categories
   */
  async findAll(): Promise<Category[]> {
    this.logger.log(`findAll: find all categories`);
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      this.logger.error(`findAll: Unable to get categories du to a server error, error: ${error}`);
      throw new HttpException ('Server error: Unable to get categories', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * Find a category with the specfied label
   * @param label of the category
   */
  async findOne(label: string): Promise<Category> {
    this.logger.debug(`findOne: find category with label: ${label}`);
    try {
      return await this.categoryModel.findOne({label}).exec();
    } catch (error) {
      this.logger.error(`findOne: Unable to get category du to a server error, category label: ${label}, error: ${error}`);
      throw new HttpException ('Server error: Unable to get category', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    
  }

}
