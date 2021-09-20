import { CreateProductDto } from "./create-product.dto";
import { Product} from '../schemas/product.schema'

export class ProductDto extends CreateProductDto {
    constructor (product: Product) {
        super();
        this.name = product.name;
        this.price = product.price;
        this.sku = product.sku
        this.category = product.category.label;
        this.created_at = product.created_at;
        this.modified_at = product.modified_at


    }
    created_at: Date;
    modified_at: Date;
}