import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Portfolio } from '../models/holding';
import { HostService } from './host.service';

export interface QueryParams{
  tickers: string[],
  start: string | undefined, end?: string,
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

  public optimize(params: QueryParams): Observable<Portfolio>{
    let url = `${this.host.getHost()}/${endpoints.api.optimize}?${this.constructQuery(params)}`
    console.log(url);
    return this.http.get<Portfolio>(url)
  }

}
