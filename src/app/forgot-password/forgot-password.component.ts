import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardServiceService } from '../dashboard-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  screenWidth;screenHeight;
  constructor(private router: Router,public service : DashboardServiceService) { 
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  Email;UID;EmailRegex;UIDRegex;
  ngOnInit(): void {
  }
  SendEmail(){
    if(this.UID == null || this.Email == null){
      alert("Please Fill all Fields");
    }else{
      this.EmailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
      this.UIDRegex = new RegExp('^[A-Z0-9]{7}$');
      if(this.UIDRegex.test(this.UID)){
        if(this.EmailRegex.test(this.Email)){
          this.service.SendPasswordToUser(this.UID,this.Email).subscribe(data =>{
            if(data.code == 200){
              alert(data.message);
              this.router.navigate(["/Login"]);
            }else{
              alert(data.message);
            }
          });
        }else{
          alert("Invalid Email ID");
        }
      }else{
        alert("Invalid UID");
      }
    }
  }
  OnLoginClick(){
    this.router.navigate(["/Login"]);
  }
}