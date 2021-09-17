import { Injectable } from '@angular/core';

export interface staticInfo{
  name: string,
  route: string,
  description?: string
}

const widgetInfo : staticInfo[] = [
  { name: 'Risk Analysis', route: '/analysis/risk' }, 
  { name: 'Price Models', route: '/analysis/pricing'},
  { name: 'Correlation Matrix', route: '/analysis/correlation' },
  { name: 'Portfolio Optimization', route: '/analysis/optimizer'},
]

const docInfo: staticInfo[] = [
  { name: 'Browsable Docs', route: '' },
  { name: 'PyPi Package', route: 'https://pypi.org/project/scrilla/' },
  { name: 'Source Code', route: 'https://github.com/chinchalinchin/scrilla'},
]

@Injectable({
  providedIn: 'root'
})
export class StaticService {

  constructor() { }

  public exchangeWidgetRouteForTitle(route: string) : string{
    if(widgetInfo.some((value) => value.route === route)){
      widgetInfo.filter( element =>{ return element.route === route })
      return " : ".concat(widgetInfo.filter( element =>{ return element.route === route })[0].name.toLowerCase());
    }
    return "";
  }

  public getWidgetInfo() : staticInfo[]{ return widgetInfo; }

  public getDocInfo() : staticInfo[]{ return docInfo }
  
}
