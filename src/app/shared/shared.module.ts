import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ConnectWalletComponent } from './components/connect-wallet/connect-wallet.component'
import { HeaderComponent } from './components/header/header.component'
import { MatIconModule } from '@angular/material/icon'
import { SelectComponent } from './components/select/select.component'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { AmountInputComponent } from './components/amount-input/amount-input.component';
import { FooterComponent } from './components/footer/footer.component'

@NgModule({
  declarations: [
    HeaderComponent,
    ConnectWalletComponent,
    SelectComponent,
    AmountInputComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  exports: [
    HeaderComponent,
    ConnectWalletComponent,
    SelectComponent,
    AmountInputComponent,
    FooterComponent
  ],
  providers: []
})
export class SharedModule {}
