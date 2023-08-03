import {FuseUtils} from "../utils";


export class Item {
    id: string;
    code: string;
    name: string;
    description: string;
    defaultPrice: number;
    defaultCost: number;
    categoryId: string;

    /**
     * Constructor
     *
     * @param product
     */
    constructor(item:any)
    {
        item = item || {};
        this.id = item.id || FuseUtils.generateGUID();
        this.code = item.code;
        this.name = item.name;
        this.description = item.description;
        this.defaultPrice = 0 || item.defaultPrice;
        this.defaultCost = 0 || item.defaultCost;
        this.categoryId = item.categoryId;      
    }
}