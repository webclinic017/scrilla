import { Injectable } from '@angular/core';

export interface staticInfo{
  name: string,
  route: string,
  description?: string
}

@Injectable({
  providedIn: 'root'
})
export class StaticService {

  constructor() { }

  public getWidgetInfo() : staticInfo[]{
    return [
      { name: 'Risk Profiler', route: 'analysis/risk' }, 
      { name: 'Portfolio Optimizer', route: 'analysis/optimizer'},
      { name: 'Price Modeller', route: 'analysis/pricing'}
    ];
  }

  public getDocInfo() : staticInfo[]{
    return [
      { name: 'Browsable Docs', route: '' },
      { name: 'PyPi Package', route: '' },
      { name: 'Source Code', route: ''},
    ]
  }
}
