import { Component } from '@angular/core'
import { SelectItem } from 'src/app/shared/types/Select'
import { userSession } from 'src/stacksUserSession'

@Component({
  selector: 'app-earn',
  templateUrl: './earn.component.html',
  styleUrls: ['./earn.component.scss']
})
export class EarnComponent {
  userSession = userSession

  isLoadingRewardsAndBalance = false

  lpEarnToken: SelectItem = {
    name: 'GRE-RED-LP',
    icon: 'gre-red-lp.svg'
  }
  lpToken_amt_user_earn = 100
  lpTokenBalance = 0

  numCycles = 50

  constructor() {}

  setIsLoading(isLoading: boolean) {
    this.isLoadingRewardsAndBalance = isLoading
  }

  updateTokenAmount(amount: number) {
    this.lpToken_amt_user_earn = amount
  }

  onNumCyclesInputChange(value: number) {
    if (!value || value < 0) {
      this.numCycles = 0
      return
    }

    if (value > 100) {
      this.numCycles = 100
      return
    }

    this.numCycles = value
  }

  updateNumCycles(event: number) {
    if (!event) {
      this.numCycles = 0
      return
    }
    this.numCycles = event
  }

  stakeOrEscrow() {
    // TODO: implement this
  }
}
