import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService} from "ngx-cookie-service"
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
loginCard = true; 

loginForm = this.formBuilder.group({
  email: ['', Validators.required],
  password: ['', Validators.required],
});
signupForm = this.formBuilder.group({
  name: ['', Validators.required],
  email: ['', Validators.required],
  password: ['', Validators.required],
});

constructor(
  private formBuilder: FormBuilder,
   private userService: UserService,
   private cookieService: CookieService,
   private messageService: MessageService,
   private router: Router
){}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

onSubimitLoginForm(): void {
if (this.loginForm.value && this.loginForm.valid){
  this.userService.authUser(this.loginForm.value as AuthRequest)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (response) => {
      if (response){
this.cookieService.set('USER_INFO', response?.token);
this.loginForm.reset();
this.router.navigate(['/dashboard']);

this.messageService.add({
  severity: "sucess",
  summary: 'Sucesso',
  detail: `Bem vindo de volta ${response?.name}!`,
  life: 2000,
});
      }
    },
    error: (err) => {
      this.messageService.add({
      severity: "error",
  summary: 'Erro',
  detail: 'erro ao fazer login',
  life: 2000,
});
      console.log(err);
},
  })
}
}

onSubimitSignupForm(): void {
if(this.signupForm.value && this.signupForm.valid){
  this.userService.singnupUser(this.signupForm.value as SignupUserRequest)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next:(response) => {
      if (response) {
        this.signupForm.reset();
        this.loginCard = true;
        this.messageService.add({
          severity: "sucess",
          summary: 'Sucesso',
          detail: 'Usuario criado com sucesso !',
          life: 2000,
        });
      }
    },
    error: (err) => {
      this.messageService.add({
        severity: "error",
    summary: 'Erro',
    detail: 'erro ao criar usuario!',
    life: 2000,
  });
    },
  })
}
}
}
