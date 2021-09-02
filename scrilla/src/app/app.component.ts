import { Component, ViewChild } from '@angular/core';
import { NavDrawerComponent } from './components/nav-drawer/nav-drawer.component';
import { StaticService } from './services/static.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('navDisplay')
  public navDrawer !:NavDrawerComponent ;

  title = 'scrilla';

  constructor(public staticData: StaticService) { }

  public toggle(){
    console.log('toggling')
    console.log(this.navDrawer)
    this.navDrawer.toggle()
  }
}
