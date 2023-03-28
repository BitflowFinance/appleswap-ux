import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import {
  SwapTransactionSettingsDialogComponent,
  SwapTransactionSettingsDialogData
} from 'src/app/components/swap-transaction-settings-dialog/swap-transaction-settings-dialog.component'
import { SelectItem } from 'src/app/shared/types/Select'
import { userSession } from 'src/stacksUserSession'
import { environment } from 'src/environments/environment'
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
  FungibleConditionCode,
  intCV,
  makeContractFungiblePostCondition,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  cvToValue,
} from '@stacks/transactions';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent {
  public userSession = userSession
  network = environment.network;
  txSenderAddress = userSession.loadUserData().profile.stxAddress.testnet;
  deployerAddress: string = 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW';

  tokenList = [
    {
      name: 'RAPL',
      icon: 'red-apple.svg'
    },
    {
      name: 'GAPL',
      icon: 'green-apple.svg'
    }
  ]

  redApplesBalance = 0
  greenApplesBalance = 0

  tokenAItem: SelectItem = this.tokenList[0];
  tokenBItem: SelectItem = this.tokenList[1];
  tokenA_amt = 0
  tokenB_amt = 0

  tokenBAmtLoading = false

  redApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress('STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW'),
    createLPString('red-apples')
  );

  greenApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress('STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW'),
    createLPString('green-apples')
  );

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

  async swapXforY(tokenX: SelectItem, tokenY: SelectItem, x: number, y: number) {
    // if (!tokenX || !tokenY || !x || !y) return
    // TODO: implement swap logic
    x = Math.floor(x * 1e6);
    y = Math.floor(y * 1e6);
    var slippageFactor = 1 - this.slippageTolerance;
    var min_dy = Math.floor(y * slippageFactor);

    console.log('tokenX: ', tokenX.name, 'tokenY: ', tokenY.name);
    console.log('amounts: ', x, y);
    if (tokenX.name == 'RAPL' && tokenY.name == 'GAPL') {
      var tX = this.redApplesContract;
      var tY = this.greenApplesContract;
      var fname = 'swap-x-for-y';
      var createPoolPC1 = makeStandardFungiblePostCondition(
        this.txSenderAddress,
        FungibleConditionCode.Equal,
        x, 
        createAssetInfo(this.deployerAddress, 'red-apples', 'red-apples')
      );

      var createPoolPC2 = makeContractFungiblePostCondition(
        this.deployerAddress,
        'appleswap-v1-1',
        FungibleConditionCode.GreaterEqual,
        min_dy,
        createAssetInfo(this.deployerAddress, 'green-apples', 'green-apples')
      );
    } else {
      //(tokenX == 'GAPL' && tokenY=='RAPL')
      var tX = this.greenApplesContract;
      var tY = this.redApplesContract;
      var fname = 'swap-y-for-x';
      var createPoolPC1 = makeStandardFungiblePostCondition(
        this.txSenderAddress,
        FungibleConditionCode.Equal,
        x,
        createAssetInfo(this.deployerAddress, 'green-apples', 'green-apples')
      );

      var createPoolPC2 = makeContractFungiblePostCondition(
        this.deployerAddress,
        'appleswap-v1-1',
        FungibleConditionCode.GreaterEqual,
        min_dy,
        createAssetInfo(this.deployerAddress, 'red-apples', 'red-apples')
      );
    }

    openContractCall({
      network: this.network,
      anchorMode: AnchorMode.Any,
      contractAddress: 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW',
      contractName: 'appleswap-v1-1',
      functionName: fname,
      functionArgs: [tX, tY, uintCV(x), uintCV(min_dy)],
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

  updateTokenAmount(val: number, tokenType: string) {
    //tokenType: A means token selected in upper half of swap box. For B, the lower half.
    if (tokenType == 'A') {
      this.tokenA_amt = val;
      console.log('tokenA amt: ', this.tokenA_amt);
      if (this.tokenAItem.name == 'RAPL' && this.tokenBItem.name == 'GAPL') {
        // get the green-apples price based on pool ratio
        this.tokenBAmtLoading = true;
        this.get_dy(val)
          .then((dy) => (this.tokenB_amt = dy / 1e6))
          .finally(() => (this.tokenBAmtLoading = false));

      } else if (this.tokenAItem.name == 'GAPL' && this.tokenBItem.name == 'RAPL') {
        // get the red-apples price based on pool ratio
        this.tokenBAmtLoading = true;
        this.get_dx(val)
          .then((dx) => (this.tokenB_amt = dx / 1e6))
          .finally(() => (this.tokenBAmtLoading = false));
      }
    } else if (tokenType == 'B') {
      console.log('error in updateTokenAmount');
    }  
  
  }

  async get_dy(dx: number) {
    var tX = this.redApplesContract;
    var tY = this.greenApplesContract;
    var contractAddress = 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW';
    var contractName = 'appleswap-v1-1';

    var options = {
      network: this.network,
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: 'get-dy',
      functionArgs: [tX, tY, uintCV(dx * 1e6)],
      senderAddress: this.txSenderAddress,
    };
    const result = await callReadOnlyFunction(options);
    var output = cvToValue(result);
    console.log(output);
    return output.value;
  }

  async get_dx(dy: number) {
    var tX = this.redApplesContract;
    var tY = this.greenApplesContract;
    var contractAddress = 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW';
    var contractName = 'appleswap-v1-1';

    var options = {
      network: this.network,
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: 'get-dx',
      functionArgs: [tY, tX, uintCV(dy * 1e6)],
      senderAddress: this.txSenderAddress,
    };
    const result = await callReadOnlyFunction(options);
    var output = cvToValue(result);
    console.log(output);
    return output.value;
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
