import { Component, OnInit } from '@angular/core';
import { showConnect } from '@stacks/connect';
import { userSession } from 'src/stacksUserSession';

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss'],
})
export class ConnectWalletComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  showNetworkAddresses: boolean = false;
  public userSession = userSession;

  authenticate() {
    showConnect({
      appDetails: {
        name: 'Apple Swap',
        icon: window.location.origin + '/logo240.png',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  }

  disconnect() {
    userSession.signUserOut('/');
  }
}
