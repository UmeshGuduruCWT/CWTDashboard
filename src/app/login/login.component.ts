import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardServiceService } from '../dashboard-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  screenWidth : number;screenHeight  : number;
  hide = true;UIDEmail : string; Password : string;
  EmailRegex;UIDRegex;
  SuccessID;
  constructor(private router: Router,public datepipe : DatePipe,public dialog: MatDialog,public service : DashboardServiceService) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  ngOnInit() {
    var Loggintime = new Date();
    let LoggedinTime = new Date(localStorage.getItem("LastLoggedIn"));
    if(localStorage.getItem("LastLoggedIn") == null){
      localStorage.clear();
    }else{
      let SecondLoggedInTime = new Date(new Date(localStorage.getItem("LastLoggedIn")).setSeconds(LoggedinTime.getSeconds()+10));
      if(Loggintime > LoggedinTime && Loggintime < SecondLoggedInTime){
        if(localStorage.getItem("LoggedIn") == "true"){
          if(localStorage.getItem("UID") != null){
            this.router.navigate(["/Dashboard",localStorage.getItem("UID")]);
          }else{
            localStorage.clear();
          }
        }else{
          localStorage.clear();
        }
      }else{
        localStorage.clear();
      }
    }
    // if(localStorage.getItem("LoggedIn") == "true"){
    //   if(localStorage.getItem("UID") != null){
    //     this.router.navigate(["/Dashboard",localStorage.getItem("UID")]);
    //   }else{
    //     localStorage.clear();
    //   }
    // }else{
    //   localStorage.clear();
    // }
  }
  OnRegisterClick(){
    this.router.navigate(["/Register"]);
  }
  OnForgotPasswordClick(){
    this.router.navigate(["/ForgotPassword"]);
  }
  currentdate;
  SignIN(){
    if(this.UIDEmail == null || this.UIDEmail == "" || this.Password == "" || this.Password == null){
      alert("Please Fill all Fields");
    }else{
      if(this.Password.length > 4){
        if(this.UIDEmail.includes('@')){
          this.EmailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
          if(this.EmailRegex.test(this.UIDEmail)){
            this.service.UserLogin("",this.UIDEmail,this.Password).subscribe(data =>{
              if(data.code == 200){
                if(data.UserStatus == 'Deleted'){
                  alert("Hi "+data.FirstName+" "+data.LastName+", Your account has been Deleted.");
                }else if(data.UserStatus == 'Deactivate'){
                  alert("Hi "+data.FirstName+" "+data.LastName+", Your account has been Deactivated by the Admin. Please contact to your Leader to Re-actiavte the account.");
                }else{
                  localStorage.setItem("LoggedIn",'true');
                  localStorage.setItem("UID",data.UID);
                  localStorage.setItem("Password",data.Password);
                  localStorage.setItem("Username",data.FirstName+" "+data.LastName);
                  this.currentdate = new Date();
                  localStorage.setItem("LastLoggedIn",this.currentdate);
                  this.SuccessID = data.UID;
                  this.router.navigate(["/Dashboard",this.SuccessID]);
                }
              }else{
                alert(data.message);
              }
            });
          }else{
            alert("Invalid Email ID");
          }
        }else{
          this.UIDRegex = new RegExp('^[A-Z0-9]{7}$');
          if(this.UIDRegex.test(this.UIDEmail)){
            this.service.UserLogin(this.UIDEmail,"",this.Password).subscribe(data =>{
              if(data.code == 200){
                if(data.UserStatus == 'Deleted'){
                  alert("Hi "+data.FirstName+" "+data.LastName+", Your account has been Deleted.");
                }else if(data.UserStatus == 'Deactivate'){
                  alert("Hi "+data.FirstName+" "+data.LastName+", Your account has been Deactivated by the Admin. Please contact to your Leader to Re-actiavte the account.");
                }else{
                  localStorage.setItem("LoggedIn",'true');
                  localStorage.setItem("UID",data.UID);
                  localStorage.setItem("Password",data.Password);
                  localStorage.setItem("Username",data.FirstName+" "+data.LastName);
                  this.currentdate = new Date();
                  localStorage.setItem("LastLoggedIn",this.currentdate);
                  this.SuccessID = data.UID;
                  this.router.navigate(["/Dashboard",this.SuccessID]);
                  // this.router.navigate(["/Dashboard"]);
                }
              }else{
                alert(data.message);
              }
            });
          }else{
            alert("Invalid UID");
          }
        }
      }else{
        alert("Password Should be atleast 5 Characters");
      }
    }
  }
}