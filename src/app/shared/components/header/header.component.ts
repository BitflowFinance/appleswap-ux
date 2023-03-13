import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UserSession } from '@stacks/connect'
import { userSession } from 'src/stacksUserSession'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private userSession: UserSession
  authenticatedPages = ['Swap', 'Pool', 'Earn', 'Faucet']
  isOpen = false

  constructor(private router: Router) {
    this.userSession = userSession
  }

  ngOnInit(): void {}

  isUserSignedIn() {
    return this.userSession.isUserSignedIn()
  }

  navigateToHome() {
    this.router.navigate(['home'])
  }

  toggleMenu() {
    this.isOpen = !this.isOpen
  }
}
