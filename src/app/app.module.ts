import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { SwapComponent } from './pages/swap/swap.component';
import { PoolComponent } from './pages/pool/pool.component';
import { EarnComponent } from './pages/earn/earn.component';
import { FaucetComponent } from './pages/faucet/faucet.component'

@NgModule({
  declarations: [AppComponent, HomeComponent, SwapComponent, PoolComponent, EarnComponent, FaucetComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
