import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardactivateGuard implements CanActivate {
  constructor (public router : Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
      if(localStorage.getItem("UID") == null && localStorage.getItem("Password") == null){
        this.router.navigate(["/Login"]);
        return false;
      }else{
        return true;
      }
    }
}
