export interface dataPoint{
    actual_price: number,
    model_price: number
}

export interface dataSeries{
    [date: string]: dataPoint;
}

export interface DiscountDividend{
    ticker: string,
    net_present_value: number,
    model_alpha: number,
    model_beta: number,
    model_discount: number,
    model_data: dataSeries[]
}