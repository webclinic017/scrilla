import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimationControl, AnimationService } from 'src/app/services/animations.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    AnimationService.getScaleTrigger(1.025),
    AnimationService.getHighlightTrigger('#A5D6A7'),
    AnimationService.getFontColorTrigger('#212121')
  ]
})
export class LoginComponent implements OnInit {

  public loginFormGroup: FormGroup;
  public loginBtnAnimationControl : AnimationControl = this.animator.initAnimation();
  
  constructor(public animator: AnimationService, private formBuilder : FormBuilder) {
    this.loginFormGroup = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      password: this.formBuilder.control('', [Validators.required])
    })
   }

  ngOnInit(): void { }

  public animateButton(): AnimationControl{
    return {...this.animator.animateScale(), 
              ...this.animator.animateHighlight(),
              ...this.animator.animateFontColor()}
  }

}
