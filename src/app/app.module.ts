import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SharedModule } from './shared/shared.module'
import { HomeComponent } from './pages/home/home.component'
import { SwapComponent } from './pages/swap/swap.component'
import { PoolComponent } from './pages/pool/pool.component'
import { EarnComponent } from './pages/earn/earn.component'
import { FaucetComponent } from './pages/faucet/faucet.component'
import { SwapTransactionSettingsDialogComponent } from './components/swap-transaction-settings-dialog/swap-transaction-settings-dialog.component'
import { MatDialogModule } from '@angular/material/dialog'
import { MatSliderModule } from '@angular/material/slider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UserTokensComponent } from './components/user-tokens/user-tokens.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SwapComponent,
    PoolComponent,
    EarnComponent,
    FaucetComponent,
    SwapTransactionSettingsDialogComponent,
    UserTokensComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatDialogModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
