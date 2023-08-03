
export class Paginate {
    pageNo: number;
    pageSize: number;
    total: number;
   
    /**
     * Constructor
     *
     * @param product
     */
    constructor(paginate:any)
    {
        paginate = paginate || {};
        this.pageNo = paginate.pageNo;
        this.pageSize = 5;
        this.total = 0;
    }
}