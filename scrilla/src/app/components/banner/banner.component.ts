import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators'
import { StaticService } from 'src/app/services/static.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})

export class BannerComponent implements OnInit {

  @Output()
  public toggle : EventEmitter<string> = new EventEmitter<string>();

  public menuState : string = 'closed';

  public title !: string;

  public constructor(private router: Router, private staticService: StaticService){
    this.router.events
                    .pipe( 
                      filter( (data : any) => data instanceof NavigationEnd))
                    .subscribe((val)=>{
                      this.title = this.staticService.exchangeWidgetRouteForTitle(val.url)
    })

  }

  ngOnInit(): void {

  }

  public toggleMenu(): void{
    if (this.menuState === 'closed'){ this.menuState = 'open'; }
    else { this.menuState = 'closed'}
    this.toggle.emit(this.menuState)
  }
}
