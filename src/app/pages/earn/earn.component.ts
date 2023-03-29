import { Component } from '@angular/core'
import { SelectItem } from 'src/app/shared/types/Select'
import { StacksMocknet, StacksTestnet } from '@stacks/network';
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
  selector: 'app-earn',
  templateUrl: './earn.component.html',
  styleUrls: ['./earn.component.scss']
})
export class EarnComponent {
  userSession = userSession
  network = new StacksTestnet();
  txSenderAddress = userSession.loadUserData().profile.stxAddress.testnet;
  deployerAddress: string = 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW';
  isLoadingRewardsAndBalance = false

  lpTokenContractName: string = 'apple-lp';
  lpTokenAssetName: string = 'apple-lp';
  lpContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress(this.deployerAddress),
    createLPString(this.lpTokenContractName)
  )

  lpToken: SelectItem = {
    name: 'APPLES-LP',
    icon: 'gre-red-lp.svg'
  }

  lpToken_amt_user_earn = 100
  lpTokenBalance = 0

  numCycles = 50

  redApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress('STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW'),
    createLPString('red-apples')
  );

  greenApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress('STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW'),
    createLPString('green-apples')
  );

  constructor() {}

  setIsLoading(isLoading: boolean) {
    this.isLoadingRewardsAndBalance = isLoading
  }

  updateTokenAmount(amount: number) {
    this.lpToken_amt_user_earn = amount
  }

  onNumCyclesInputChange(value: number) {
    if (!value || value < 0) {
      this.numCycles = 0
      return
    }

    if (value > 100) {
      this.numCycles = 100
      return
    }

    this.numCycles = value
  }

  updateNumCycles(event: number) {
    if (!event) {
      this.numCycles = 0
      return
    }
    this.numCycles = event
  }

  escrow() {
    var txSenderAddress: string;
    var amountLPtokens = this.lpToken_amt_user_earn

    var PC1 = makeStandardFungiblePostCondition(
      this.txSenderAddress,
      FungibleConditionCode.Equal,
      amountLPtokens,
      createAssetInfo(this.deployerAddress, this.lpTokenContractName, this.lpTokenAssetName)
    )

    if (this.lpToken.name == 'APPLES-LP') {
      var token_x = this.redApplesContract;
      var token_y = this.greenApplesContract;
      var token_lp = this.lpContract;
      console.log("tx: ", token_x)
      console.log("ty: ", token_y)
      openContractCall({
        network: this.network,
        anchorMode: AnchorMode.Any,
        contractAddress: this.deployerAddress,
        contractName: 'appleswap-v1-1',
        functionName: 'stake-LP-tokens',
        functionArgs: [token_lp, token_x, token_y, uintCV(amountLPtokens), uintCV(this.numCycles)],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [PC1],
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
    else {
      console.log("invalid LP token")
    }
  }
}
