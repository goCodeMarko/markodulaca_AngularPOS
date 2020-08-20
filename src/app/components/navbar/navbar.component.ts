import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "../../services/user/user.service";
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public fullName;
  public position;

  constructor(private _router: Router,
    public _userService: UserService,
    private _flashMessages: FlashMessagesService) { }

  ngOnInit(): void {

  }

  getUserData() {
    if (this.fullName === undefined) {
      const data = JSON.parse(localStorage.getItem('account'));

      if (data) {
        let mname = data.mname;

        if (mname.length > 0) {
          mname = `${data.mname[0]}.`;
        }

        this.fullName = `${data.fname} ${mname} ${data.lname}`;
        this.position = data["userType"];
      }
    }
  }

  logOut() {
    const account = JSON.parse(localStorage.getItem('account'));

    if (account) {
      let mname = account.mname;
      var title;

      if (mname.length > 0) {
        mname = `${account.mname[0]}.`;
      }

      if (account.sex == 1) {
        title = "Mr.";
      } else {
        title = "Ms.";
      }
    }

    this._flashMessages.show(`<span class= "fa fa-bullhorn fa-lg"> </span>&nbsp&nbsp${title} <strong>${this.fullName}</strong> is now offline.`, {
      cssClass: 'alert-dark',
      timeout: 3000
    })



    this.fullName = undefined;
    this.position = undefined;
    this._userService.logOut();
    this._router.navigate(['/login']);
  }
}
