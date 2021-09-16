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
      { name: 'Risk Analysis', route: 'analysis/risk' }, 
      { name: 'Price Models', route: 'analysis/pricing'},
      { name: 'Correlation Matrix', route: 'analysis/correlation' },
      { name: 'Portfolio Optimization', route: 'analysis/optimizer'},
    ];
  }

  public getDocInfo() : staticInfo[]{
    return [
      { name: 'Browsable Docs', route: '' },
      { name: 'PyPi Package', route: 'https://pypi.org/project/scrilla/' },
      { name: 'Source Code', route: 'https://github.com/chinchalinchin/scrilla'},
    ]
  }
}
