import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  public getHost(){
    if(isPlatformServer(this.platformId)){
      return environment.renderHost;
    }
    return environment.apiHost;
  }
  
}
