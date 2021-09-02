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
      { name: 'Risk Analyzer', route: 'widgets/risk' }, 
      { name: 'Portfolio Optimizer', route: 'widgets/optimizer'},
      { name: 'Price Modeller', route: 'widgets/pricing'}
    ];
  }

  public getDocInfo() : staticInfo[]{
    return [
      { name: 'Browsable Docs', route: '' },
      { name: 'PyPi Package', route: '' },
      { name: 'Git Repository', route: ''},
      { name: 'Docker Repostiry', route: ''}
    ]
  }
}
