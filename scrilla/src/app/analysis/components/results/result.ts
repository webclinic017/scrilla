import { DomSanitizer } from "@angular/platform-browser";
import { Frontier, Portfolio } from "src/app/models/holding";
import { DiscountDividend } from "src/app/models/pricing";
import { Correlation } from "src/app/models/statistics";
import { AnimationControl, AnimationService } from "src/app/services/animations.service";

export class Result{

    public downloadResultsBtnAnimationControl = this.animator.initAnimation();
    public downloadChartBtnAnimationControl = this.animator.initAnimation();

    public constructor(public animator: AnimationService, public sanitizer: DomSanitizer){
        
    }

    public formatResultJsonUri(result: Portfolio | Correlation[] | Frontier | DiscountDividend[]){
        let jsonFormat = JSON.stringify(result)
        return this.sanitizer.bypassSecurityTrustResourceUrl("data:text/json;charset=UTF-8," + encodeURIComponent(jsonFormat));
    }

    public animateDownload(): AnimationControl{ return {...this.animator.animateScale(), ...this.animator.animateHighlight()} }

}