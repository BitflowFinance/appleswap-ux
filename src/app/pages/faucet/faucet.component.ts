import { Component } from '@angular/core'
import { SelectItem } from 'src/app/shared/types/Select'
import { userSession } from 'src/stacksUserSession'

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.scss']
})
export class FaucetComponent {
  userSession = userSession

  mintAmount = 0
  tokenChoice?: SelectItem

  tokenList: SelectItem[] = [
    {
      name: 'RED APPLES',
      icon: 'red-apple.svg'
    },
    {
      name: 'GREEN APPLES',
      icon: 'green-apple.svg'
    }
  ]

  constructor() {}

  selectToken(event: SelectItem) {
    this.tokenChoice = event
    if (this.tokenChoice.name == 'RED APPLES') {
      // TODO: implement this
    } else if (this.tokenChoice.name == 'GREEN APPLES') {
      // TODO: implement this
    } else {
      console.log('tokenChoice: ', this.tokenChoice)
    }
  }

  mintTokens() {
    // TODO: implement mint tokens
  }
}
