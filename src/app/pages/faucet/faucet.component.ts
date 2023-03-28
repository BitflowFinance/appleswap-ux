import { Component } from '@angular/core'
import { SelectItem } from 'src/app/shared/types/Select'
import { userSession } from 'src/stacksUserSession'
import { StacksMocknet, StacksTestnet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';
import { environment } from 'src/environments/environment'
import {
  AnchorMode,
  ContractPrincipal,
  contractPrincipalCV,
  ContractPrincipalCV,
  callReadOnlyFunction,
  contractPrincipalCVFromAddress,
  createAddress,
  createAssetInfo,
  createLPString,
  FungibleConditionCode,
  intCV,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  cvToValue,
  trueCV
} from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.scss']
})
export class FaucetComponent {
  userSession = userSession
  // network = environment.network;
  network = new StacksTestnet();
  txSenderAddress = userSession.loadUserData().profile.stxAddress.testnet;
  deployerAddress: string = 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW';
  loggedInAsAdmin: boolean = false;
  
  mintAmount = 0
  tokenChoice?: SelectItem

  tokenList: SelectItem[] = [
    {
      name: 'RAPL',
      icon: 'red-apple.svg'
    },
    {
      name: 'GAPL',
      icon: 'green-apple.svg'
    }
  ]

  redApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress('STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW'),
    createLPString('red-apples')
  );

  greenApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress('STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW'),
    createLPString('green-apples')
  );

  tokenChoiceContract: any;
  tokenChoiceContractName: string = '';

  constructor() {}
  ngOnInit(): void {
    if (this.userSession.loadUserData().profile.stxAddress.testnet == this.deployerAddress) {
      this.loggedInAsAdmin = true;
      console.log("loggedInAsAdmin: ", this.loggedInAsAdmin)
    }
  }

  selectToken(event: SelectItem) {
    this.tokenChoice = event
    if (this.tokenChoice.name == 'RAPL') {
      this.tokenChoiceContract = this.redApplesContract;
      this.tokenChoiceContractName = 'red-apples';
    } else if (this.tokenChoice.name == 'GAPL') {
      this.tokenChoiceContract = this.greenApplesContract;
      this.tokenChoiceContractName = 'green-apples'
    } else {
      console.log('invalid token')
    }
    console.log('tokenChoice: ', this.tokenChoice.name)
  }

  mintTokens() {
    var amount = this.mintAmount;
    console.log("minting ", amount, " of ", this.tokenChoice?.name);

    openContractCall({
      network: this.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.deployerAddress,
      contractName: this.tokenChoiceContractName,
      functionName: 'mint',
      functionArgs: [uintCV(amount), principalCV(this.txSenderAddress)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log('onFinish:', data);
        window
          ?.open(
            `http://explorer.stacks.co/txid/${data.txId}?chain=testnet`,
            '_blank'
          )
          ?.focus();
      },
      onCancel: () => {
        console.log('onCancel:', 'Transaction was canceled');
      },
    });

  }

  createPool() {
    var tx_amt = 1000000;
    var ty_amt = 1000000;

    var createPoolPC1 = makeStandardFungiblePostCondition(
      this.txSenderAddress,
      FungibleConditionCode.Equal,
      tx_amt,
      createAssetInfo(this.deployerAddress, 'red-apples', 'red-apples')
    )

    var createPoolPC2 = makeStandardFungiblePostCondition(
      this.txSenderAddress,
      FungibleConditionCode.Equal,
      ty_amt,
      createAssetInfo(this.deployerAddress, 'green-apples', 'green-apples')
    )

    var tx = this.redApplesContract;
    var ty = this.greenApplesContract;
    console.log("tx: ", tx)
    console.log("ty: ", ty)
    openContractCall({
      network: this.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.deployerAddress,
      contractName: 'appleswap-v1-1',
      functionName: 'create-pair',
      functionArgs: [tx, ty, stringAsciiCV("RAPL-GAPL"), uintCV(tx_amt), uintCV(ty_amt)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [createPoolPC1, createPoolPC2],
      onFinish: (data) => {
        console.log('onFinish:', data);
        window
          ?.open(
            `http://explorer.stacks.co/txid/${data.txId}?chain=testnet`,
            '_blank'
          )
          ?.focus();
      },
      onCancel: () => {
        console.log('onCancel:', 'Transaction was canceled');
      },
    });
  }

  setPairApproval() {
    var tx = this.redApplesContract;
    var ty = this.greenApplesContract;
    openContractCall({
      network: this.network,
      anchorMode: AnchorMode.Any,
      contractAddress: this.deployerAddress,
      contractName: 'appleswap-v1-1',
      functionName: 'set-pair-approval',
      functionArgs: [tx, ty, trueCV()],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log('onFinish:', data);
        window
          ?.open(
            `http://explorer.stacks.co/txid/${data.txId}?chain=testnet`,
            '_blank'
          )
          ?.focus();
      },
      onCancel: () => {
        console.log('onCancel:', 'Transaction was canceled');
      },
    });
  }

}
