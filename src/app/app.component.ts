import { Component, OnInit } from '@angular/core';
import { FuraffinityService } from './services/furaffinity.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuraffinityLoginComponent } from './components/dialogs/furaffinity-login/furaffinity-login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public checkingLogin: boolean = false;
  public loggedIn: boolean = false;

  constructor(private furaffinityService: FuraffinityService, private dialog: MatDialog) {}

  public async openLoginDialog() {
    const dialogRef: MatDialogRef<any> = this.dialog.open(FuraffinityLoginComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(() => {
      this._checkLogin();
    });
  }

  ngOnInit() {
    this._checkLogin();
  }

  private _checkLogin(): void {
    this.checkingLogin = true;
    this.furaffinityService.checkLogin()
    .then(() => this.loggedIn = true)
    .catch(() => this.loggedIn = false)
    .finally(() => this.checkingLogin = false);
  }

}
