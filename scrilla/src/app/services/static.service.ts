import { Injectable } from '@angular/core';

export interface staticInfo{
  name: string,
  route: string,
  description?: string
}

const appInfo: staticInfo[] = [
  { name: 'Registration', route: '/register' },
  { name: 'Login', route: '/login' }
]

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

  public exchangeRouteForTitle(route: string) : string{
    if(widgetInfo.some((value) => value.route === route)){
      console.log(route)
      return " : ".concat(widgetInfo.filter( element =>{ return route.includes(element.route) })[0].name.toLowerCase());
    }
    else if(docInfo.some((value)=> value.route === route)){
      return " : ".concat(docInfo.filter( element=> { return route.includes(element.route)})[0].name.toLowerCase());
    }
    else if(appInfo.some( (value)=> value.route === route)){
      return " : ".concat(appInfo.filter( element => { return route.includes(element.route)})[0].name.toLowerCase());
    }
    return "";
  }

  public getWidgetInfo() : staticInfo[]{ return widgetInfo; }

  public getDocInfo() : staticInfo[]{ return docInfo }
  
}
