import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import {
  SwapTransactionSettingsDialogComponent,
  SwapTransactionSettingsDialogData
} from 'src/app/components/swap-transaction-settings-dialog/swap-transaction-settings-dialog.component'
import { SelectItem } from 'src/app/shared/types/Select'
import { userSession } from 'src/stacksUserSession'

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent {
  public userSession = userSession

  redApplesBalance = 0
  greenApplesBalance = 0

  tokenAItem?: SelectItem
  tokenBItem?: SelectItem
  tokenA_amt = 0
  tokenB_amt = 0

  tokenBAmtLoading = false

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

  slippageTolerance = 0.001
  slippageTolerancePct = 100 * this.slippageTolerance

  swapRateRatioDisplay = 'A-to-B'

  constructor(private dialog: MatDialog) {}

  flipSwapRateRatioDisplayed() {
    const srrd = this.swapRateRatioDisplay
    if (srrd == 'A-to-B') {
      this.swapRateRatioDisplay = 'B-to-A'
    } else {
      this.swapRateRatioDisplay = 'A-to-B'
    }
  }

  selectToken(event: SelectItem, tokenAorB: string) {
    if (tokenAorB == 'A') {
      this.tokenAItem = event
    } else if (tokenAorB == 'B') {
      this.tokenBItem = event
    }

    if (this.tokenAItem?.name != '' && this.tokenBItem?.name != '') {
      if (this.tokenAItem?.name == this.tokenBItem?.name) {
        this.tokenA_amt = 0
        this.tokenB_amt = 0
      }
    }
  }

  openTransactionSettings() {
    const dialogOptions: SwapTransactionSettingsDialogData = {
      slippageToleranceValue: this.slippageTolerancePct,
      onConfirm: (slippageToleranceValue: number) => {
        this.slippageTolerancePct = slippageToleranceValue
        this.slippageTolerance = slippageToleranceValue / 1e2
        this.dialog.closeAll()
      }
    }

    this.dialog.open(SwapTransactionSettingsDialogComponent, {
      data: dialogOptions
    })
  }

  async swapXforY(tokenX?: SelectItem, tokenY?: SelectItem, x?: number, y?: number) {
    if (!tokenX || !tokenY || !x || !y) return
    // TODO: implement swap logic
  }

  updateTokenAmount(val: number, tokenType: string) {
    // TODO: implement update logic

    if (tokenType == 'A') {
      this.tokenA_amt = val
    } else if (tokenType == 'B') {
      this.tokenB_amt = val
    }
  }

  switchTokens() {
    const tokenAItem = this.tokenAItem
    const tokenBItem = this.tokenBItem
    const tokenA_amt = this.tokenA_amt
    const tokenB_amt = this.tokenB_amt

    this.tokenAItem = tokenBItem
    this.tokenBItem = tokenAItem
    this.tokenA_amt = tokenB_amt
    this.tokenB_amt = tokenA_amt
  }
}
