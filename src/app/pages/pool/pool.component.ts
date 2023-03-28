import { Component } from '@angular/core'
import { SelectItem } from 'src/app/shared/types/Select'
import { userSession } from 'src/stacksUserSession'
import { StacksMocknet, StacksTestnet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';
import {
  AnchorMode,
  callReadOnlyFunction,
  ContractPrincipal,
  contractPrincipalCV,
  ContractPrincipalCV,
  contractPrincipalCVFromAddress,
  createAddress,
  createAssetInfo,
  createLPString,
  cvToValue,
  FungibleConditionCode,
  getTypeString,
  intCV,
  makeContractFungiblePostCondition,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
} from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';


@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})
export class PoolComponent {
  userSession = userSession
  // network = environment.network;
  network = new StacksTestnet();
  txSenderAddress = userSession.loadUserData().profile.stxAddress.testnet;
  deployerAddress: string = 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW';
  
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
  redApplesBalance = 0
  greenApplesBalance = 0
  greRedLpBalance = 0

  tokenAItem: SelectItem = this.tokenList[0];
  tokenBItem: SelectItem = this.tokenList[1];
  tokenA_amt = 0
  tokenB_amt = 0
  lpToken: SelectItem = {
    name: 'APPLES-LP',
    icon: 'gre-red-lp.svg'
  }

  withdrawalPct: number = 0

  poolChoice: 'add' | 'remove' = 'add'

  toggle(poolOption: 'add' | 'remove') {
    if (poolOption == 'add') {
      this.withdrawalPct = 0
    } else if (poolOption == 'remove') {
      this.tokenA_amt = 0
      this.tokenB_amt = 0
    } else {
      console.log('invalid pool option')
    }

    this.poolChoice = poolOption
  }

  selectToken(event: SelectItem, tokenType: string) {
    if (tokenType == 'A') {
      this.tokenAItem = event
    } else if (tokenType == 'B') {
      this.tokenBItem = event
    } else if (tokenType == 'LP') {
      this.lpToken = event
    }
  }

  updateTokenAmount(val: number, tokenType: string) {
    if (tokenType == 'A') {
      this.tokenA_amt = val
    } else if (tokenType == 'B') {
      this.tokenB_amt = val
    } else {
      console.log('tokenType: ', tokenType, 'value: ', val)
    }
  }

  updateWithdrawalPercentage(val: number) {
    console.log('update withdrawal pct input:', val)
    let pct = val
    if (!pct || pct < 0) pct = 1
    if (pct > 100) pct = 100
    this.withdrawalPct = pct
    console.log('update withdrawal pct output:', this.withdrawalPct)
  }

  handleConfirm() {
    if (this.poolChoice === 'add') return this.addToPool()
    else if (this.poolChoice === 'remove') return this.withdrawFromPool()
  }

  addToPool() {
    var tx_amt = this.tokenA_amt;
    var ty_amt = this.tokenB_amt;

    var createPoolPC1 = makeStandardFungiblePostCondition(
      this.txSenderAddress,
      FungibleConditionCode.LessEqual,
      tx_amt,
      createAssetInfo(this.deployerAddress, 'red-apples', 'red-apples')
    )

    var createPoolPC2 = makeStandardFungiblePostCondition(
      this.txSenderAddress,
      FungibleConditionCode.LessEqual,
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
      functionName: 'add-to-position',
      functionArgs: [tx, ty, uintCV(tx_amt), uintCV(ty_amt)],
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


  withdrawFromPool() {
    var PC1 = makeStandardFungiblePostCondition(
      this.txSenderAddress,
      FungibleConditionCode.GreaterEqual,
      0,
      createAssetInfo(this.deployerAddress, 'apple-lp', 'apple-lp')
    )

    var PC2 = makeContractFungiblePostCondition(
      this.deployerAddress,
      'appleswap-v1-1',
      FungibleConditionCode.GreaterEqual,
      0,
      createAssetInfo(this.deployerAddress, 'red-apples', 'red-apples') 
    )

    var PC3 = makeContractFungiblePostCondition(
      this.deployerAddress,
      'appleswap-v1-1',
      FungibleConditionCode.GreaterEqual,
      0,
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
      functionName: 'reduce-position',
      functionArgs: [tx, ty, uintCV(this.withdrawalPct)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [PC1, PC2, PC3],
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
