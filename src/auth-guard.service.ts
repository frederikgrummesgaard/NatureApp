import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { UserService } from "./app/shared/services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate() {
        if (UserService.isLoggedIn()) {
            return true;
        }
        else {
            this.router.navigate(["/login"]);
            return false;
        }
    }
}