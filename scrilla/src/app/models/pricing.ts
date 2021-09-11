export interface dataSeries{
    date: string,
    model_price: number,
    actual_price: number
}

export interface DiscountDividend{
    ticker: string,
    net_present_value: number,
    model_alpha: number,
    model_beta: number,
    model_discount: number,
    model_data: dataSeries[]
}