import { Component } from '@angular/core'
import { SelectItem } from 'src/app/shared/types/Select'
import { userSession } from 'src/stacksUserSession'

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent {
  userSession = userSession

  redApplesBalance = 0
  greenApplesBalance = 0
  greRedLpBalance = 0

  tokenAItem?: SelectItem
  tokenBItem?: SelectItem
  tokenA_amt = 0
  tokenB_amt = 0
  lpToken: SelectItem = {
    name: 'GRE-RED-LP',
    icon: 'gre-red-lp.svg'
  }

  withdrawalPct: number = 0

  tokenList = [
    {
      name: 'RED APPLES',
      icon: 'red-apple.svg'
    },
    {
      name: 'GREEN APPLES',
      icon: 'green-apple.svg'
    }
  ]

  poolChoice: 'add' | 'remove' = 'add'

  toggle(poolOption: 'add' | 'remove') {
    if (poolOption == 'add') {
      this.withdrawalPct = 0
    } else if (poolOption == 'remove') {
      this.tokenA_amt = 0
      this.tokenB_amt = 0
    } else {
      console.log('invalid pool option')
    }

    this.poolChoice = poolOption
  }

  selectToken(event: SelectItem, tokenType: string) {
    if (tokenType == 'A') {
      this.tokenAItem = event
    } else if (tokenType == 'B') {
      this.tokenBItem = event
    } else if (tokenType == 'LP') {
      this.lpToken = event
    }
  }

  updateTokenAmount(val: number, tokenType: string) {
    if (tokenType == 'A') {
      this.tokenA_amt = val
    } else if (tokenType == 'B') {
      this.tokenB_amt = val
    } else {
      console.log('tokenType: ', tokenType, 'value: ', val)
    }
  }

  updateWithdrawalPercentage(val: number) {
    console.log('update withdrawal pct input:', val)
    let pct = val
    if (!pct || pct < 0) pct = 1
    if (pct > 100) pct = 100
    this.withdrawalPct = pct
    console.log('update withdrawal pct output:', this.withdrawalPct)
  }

  handleConfirm() {
    // TODO: implement confirm logic
  }
}
