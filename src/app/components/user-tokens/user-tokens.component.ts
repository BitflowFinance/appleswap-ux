import { Component } from '@angular/core'
import { environment } from 'src/environments/environment'
import { userSession } from 'src/stacksUserSession'
import { OnInit } from '@angular/core'

@Component({
  selector: 'app-user-tokens',
  templateUrl: './user-tokens.component.html',
  styleUrls: ['./user-tokens.component.scss']
})
export class UserTokensComponent implements OnInit {
  public userSession = userSession
  network = environment.network

  redApplesBalance: string | null = null
  greenApplesBalance: string | null = null
  greRedLpBalance: string | null = null

  constructor() {}

  ngOnInit(): void {}
}
