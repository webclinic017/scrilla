import { Injectable } from '@angular/core';

export interface widgetInfo{
  name: string,
  route: string,
  description?: string
}

@Injectable({
  providedIn: 'root'
})
export class StaticService {

  constructor() { }

  public getWidgetInfo() : widgetInfo[]{
    return [
      { name: 'Risk Analyzer', route: 'widgets/risk' }, 
      { name: 'Portfolio Optimizer', route: 'widgets/optimizer'},
      { name: 'Price Modeller', route: 'widgets/pricing'}
    ];
  }
}
