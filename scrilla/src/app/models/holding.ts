export interface Holding{
    ticker: string,
    annual_return ?: number,
    annual_volatility ?: number,
    asset_beta ?: number,
    sharpe_ratio ?: number,
    allocation ?: number,
    shares ?: number
}

export interface Portfolio{
    holdings: Holding[],
    portfolio_return: number,
    portfolio_volatility: number,
    total ?: number
}

export interface Frontier{
    portfolios: Portfolio[]
}