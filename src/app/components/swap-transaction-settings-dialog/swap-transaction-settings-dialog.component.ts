import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

export interface SwapTransactionSettingsDialogData {
  slippageToleranceValue?: number
  onConfirm: (slippageTolerance: number) => void
}

@Component({
  selector: 'app-swap-transaction-settings-dialog',
  templateUrl: './swap-transaction-settings-dialog.component.html',
  styleUrls: ['./swap-transaction-settings-dialog.component.scss']
})
export class SwapTransactionSettingsDialogComponent implements OnInit {
  slippageTolerance: number

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: SwapTransactionSettingsDialogData
  ) {
    this.slippageTolerance = this.dialogData.slippageToleranceValue || 0.1
  }

  ngOnInit(): void {}

  updateSlippageTolerance(value: number) {
    if (!value) return

    if (value >= 0 && value <= 1) {
      this.slippageTolerance = value
    }
  }

  confirm() {
    this.dialogData.onConfirm(this.slippageTolerance)
  }
}
