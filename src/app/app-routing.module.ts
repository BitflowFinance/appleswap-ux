import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { authGuard } from './guards/authGuard'
import { EarnComponent } from './pages/earn/earn.component'
import { FaucetComponent } from './pages/faucet/faucet.component'
import { HomeComponent } from './pages/home/home.component'
import { PoolComponent } from './pages/pool/pool.component'
import { SwapComponent } from './pages/swap/swap.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'swap',
    component: SwapComponent,
    canActivate: [authGuard]
  },
  {
    path: 'pool',
    component: PoolComponent,
    canActivate: [authGuard]
  },
  {
    path: 'earn',
    component: EarnComponent,
    canActivate: [authGuard]
  },
  {
    path: 'faucet',
    component: FaucetComponent,
    canActivate: [authGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
