import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Holding, Portfolio } from '../models/holding';
import { DiscountDividend } from '../models/pricing';
import { HostService } from './host.service';

export interface QueryParams{
  tickers: string[],
  start?: string, end?: string,
  target?: number, invest?:number,
  mode?: string, prob?: number, 
  expiry?: number
}

export const endpoints = {
  api:{
    optimize: 'api/optimize',
    risk_profile: 'api/risk-return',
    correlation: 'api/correlation',
    efficient_fronter: 'api/efficient-frontier',
    discount_dividend: 'api/discount-dividend'
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private host : HostService, private http: HttpClient) { }

  private constructQuery(params : QueryParams): string{
    let query = "";
    params.tickers.forEach(ticker=>{
      if(query){ query = query.concat(`&`)}
      query = query.concat(`tickers=${ticker}`)
    })
    if(params.start){ query = query.concat(`&start=${params.start}`)}
    if(params.end){ query = query.concat(`&end=${params.end}`)}
    if(params.target){ query = query.concat(`&target=${params.target}`)}
    if(params.invest){ query = query.concat(`&invest=${params.invest}`)}
    if(params.mode){ query = query.concat(`&mode=${params.mode}`)}
    if(params.prob) { query = query.concat(`&prob=${params.prob}`)}
    if(params.expiry) { query = query.concat(`&expiry=${params.expiry}`)}
    return query;
  }

  public optimize_portfolio(params: QueryParams): Observable<Portfolio>{
    let url = `${this.host.getHost()}/${endpoints.api.optimize}?${this.constructQuery(params)}`
    return this.http.get<Portfolio>(url)
  }

  public risk_profile(params: QueryParams): Observable<Holding[]>{
    let url =`${this.host.getHost()}/${endpoints.api.risk_profile}?${this.constructQuery(params)}`
    return this.http.get<Holding[]>(url)
  }

  public dividend_model(params: QueryParams): Observable<DiscountDividend[]>{
    let url = `${this.host.getHost()}/${endpoints.api.discount_dividend}?${this.constructQuery(params)}`
    return this.http.get<DiscountDividend[]>(url);
  }
}
