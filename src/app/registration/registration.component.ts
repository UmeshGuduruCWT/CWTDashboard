import { Component, OnInit } from '@angular/core';
import { DashboardServiceService } from '../dashboard-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  screenWidth : number;screenHeight  : number;
  FirstName : string;LastName : string;UID : string;Email : string;
  Manager : string;Password : string;C_Password : string;
  hide = true; c_hide = true;JobType : string;
  NameRegex;EmailRegex;UIDRegex;ManagerRegex;
  imageUrl : string = "assets/images/cwt.png";
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
  }
  OnLoginClick(){
    this.router.navigate(["/Login"]);
  }
  SignUp(){
    console.log(this.JobType);
    if(this.UID == null || this.FirstName == null || this.LastName == null || this.Email == null || this.Manager == null || this.Password == null || this.C_Password == null || this.JobType == null){
      alert("Please Fill all Fields");
    }else{
      this.NameRegex = new RegExp('^[A-Za-z]{3,20}$');
      this.EmailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
      this.UIDRegex = new RegExp('^[A-Z0-9]{7}$');
      this.ManagerRegex = new RegExp('^[A-Za-z]+\\ [a-zA-Z]{3,25}$');
      this.UID = this.UID.toUpperCase();
      if(this.NameRegex.test(this.FirstName)){
        if(this.NameRegex.test(this.LastName)){
          if(this.UIDRegex.test(this.UID)){
            if(this.EmailRegex.test(this.Email)){
              if(this.ManagerRegex.test(this.Manager)){
                if(this.Password.length > 4){
                  if(this.Password == this.C_Password){
                    this.service.UserRegistration(this.UID,this.FirstName,this.LastName,this.Email,this.Manager,this.Password,this.JobType).subscribe(data =>{
                      if(data.code == 200){
                        alert("Registered Succesfully");
                        this.router.navigate(["/Login"]);
                      }else{
                        alert(data.message);
                      }
                    });
                  }else{
                    alert("Please make sure your passwords Match!");
                  }
                }else{
                  alert("Password Should be atleast 5 Characters");
                }
              }else{
                alert("In-valid Manager Name, Make sure it is (Firstname Lastname)");
              }
            }else{
              alert("In-valid Email");
            }
          }else{
            alert("In-valid UID");
          }
        }else{
          alert("Not a valid Last Name");
        }
      }else{
        alert("Not a valid First Name");
      }
    }
  }
}