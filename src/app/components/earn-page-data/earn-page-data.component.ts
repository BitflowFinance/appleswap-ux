import { Component, EventEmitter, Output } from '@angular/core'
import { TokenStatement } from './types'

@Component({
  selector: 'app-earn-page-data',
  templateUrl: './earn-page-data.component.html',
  styleUrls: ['./earn-page-data.component.scss']
})
export class EarnPageDataComponent {
  escrowedTokens: TokenStatement[] = []
  greRedLpInEscrow = 6962.33

  principalToClaimTokens: TokenStatement[] = []
  greRedLpPrincipal = 1000.33

  userRewardsTokens: TokenStatement[] = []
  redAppleRewards = 3600.9
  greenAppleRewards = 2000.8

  isLoading = false

  @Output()
  loadingChange = new EventEmitter<boolean>();

  constructor() {
    this.escrowedTokens = [
      {
        name: 'GRE-RED-LP',
        amount: this.greRedLpInEscrow,
        icon: 'gre-red-lp.svg'
      }
    ]

    this.principalToClaimTokens = [
      {
        name: 'GRE-RED-LP',
        amount: this.greRedLpPrincipal,
        icon: 'gre-red-lp.svg'
      }
    ]

    this.userRewardsTokens = [
      {
        name: 'RED APPLES',
        amount: this.redAppleRewards,
        icon: 'red-apple.svg'
      },
      {
        name: 'GREEN APPLES',
        amount: this.greenAppleRewards,
        icon: 'green-apple.svg'
      }
    ]
  }

  formatAmount(amount: number) {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })
  }

  getUserRewardsAmount() {
    const value = this.userRewardsTokens.reduce(
      (acc, token) => acc + token.amount,
      0
    )

    return this.formatAmount(value)
  }

  claimAllRewards() {
    // TODO: implement claim all rewards
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
    this.loadingChange.emit(loading);
  }
}
