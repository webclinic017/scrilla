import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators'
import { AnimationControl, AnimationService } from 'src/app/services/animations.service';
import { StaticService } from 'src/app/services/static.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: [
    AnimationService.getScaleTrigger(1.10),
    AnimationService.getHighlightTrigger("#9E9E9E")
  ]
})

export class BannerComponent implements OnInit {

  @Output()
  public toggle : EventEmitter<string> = new EventEmitter<string>();

  public menuState : string = 'closed';

  public helpBar : boolean = false;

  public title !: string;

  public whatBtnAnimationControl = this.animator.initAnimation();
  public supportBtnAnimationControl = this.animator.initAnimation();
  public featureBtnAnimationControl = this.animator.initAnimation();

  public constructor(private router: Router, private staticService: StaticService,
                      public animator: AnimationService){
    this.router.events
                    .pipe( 
                      filter( (data : any) => data instanceof NavigationEnd))
                    .subscribe((val)=>{
                      this.title = this.staticService.exchangeRouteForTitle(val.url)
    })

  }

  ngOnInit(): void {

  }

  public toggleMenu(): void{
    if (this.menuState === 'closed'){ this.menuState = 'open'; }
    else { this.menuState = 'closed'}
    this.toggle.emit(this.menuState)
  }

  public toggleHelp(): void{
    this.helpBar = !this.helpBar;
  }

  public animateButton(): AnimationControl{
    return {...this.animator.animateScale(), ...this.animator.animateHighlight()}
  }
}
