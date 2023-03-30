import { Component, EventEmitter, Output } from '@angular/core'
import { TokenStatement } from './types'
import { openContractCall } from '@stacks/connect';
import { StacksMocknet, StacksTestnet } from '@stacks/network';
import { userSession } from 'src/stacksUserSession'
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
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
  listCV,
} from '@stacks/transactions';

@Component({
  selector: 'app-earn-page-data',
  templateUrl: './earn-page-data.component.html',
  styleUrls: ['./earn-page-data.component.scss']
})
export class EarnPageDataComponent {
  userSession = userSession
  network = new StacksTestnet();
  txSenderAddress = userSession.loadUserData().profile.stxAddress.testnet;
  deployerAddress: string = 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW';
  
  redApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress(this.deployerAddress),
    createLPString('red-apples')
  );

  greenApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress(this.deployerAddress),
    createLPString('green-apples')
  );

  lpContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
    createAddress(this.deployerAddress),
    createLPString('apple-lp')
  )

  escrowedTokens: TokenStatement[] = []
  appleLpInEscrow = 6962.33

  principalToClaimTokens: TokenStatement[] = []
  appleLpPrincipalToClaim = 1000.33

  userRewardsTokens: TokenStatement[] = []
  redAppleRewards = 3600.9
  greenAppleRewards = 2000.8

  isLoading = false
  currentCycle: number = 0;

  @Output()
  loadingChange = new EventEmitter<boolean>();

  constructor() {
    this.escrowedTokens = [
      {
        name: 'APPLES-LP',
        amount: this.appleLpInEscrow,
        icon: 'gre-red-lp.svg'
      }
    ]

    this.principalToClaimTokens = [
      {
        name: 'APPLES-LP',
        amount: this.appleLpPrincipalToClaim,
        icon: 'gre-red-lp.svg'
      }
    ]

    this.userRewardsTokens = [
      {
        name: 'RAPL',
        amount: this.redAppleRewards,
        icon: 'red-apple.svg'
      },
      {
        name: 'GAPL',
        amount: this.greenAppleRewards,
        icon: 'green-apple.svg'
      }
    ]
  }

  ngOnInit(): void {
    this.setLoading(true);
    this.getTokensEscrowedInCurrentCycle().then((x) =>
      this.getRewardsAndPrincipalPast30CyclesWrapper()    
      .then((rap) => console.log(rap))
      .finally(() => this.setLoading(false))
    )
  }

  formatAmount(amount: number) {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4
    })
  }

  getUserRewardsAmount() {
    const value = this.userRewardsTokens.reduce(
      (acc, token) => acc + token.amount,
      0
    )

    return this.formatAmount(value)
  }

  async getCurrentCycle() {

    var options = {
      network: this.network,
      contractAddress: this.deployerAddress,
      contractName: 'appleswap-v1-1',
      functionName: 'get-current-cycle',
      functionArgs: [],
      senderAddress: this.txSenderAddress

    }
    const result = await callReadOnlyFunction(options);
    var output = cvToValue(result);
    console.log(output.value);
    this.currentCycle = output.value
  }

  async getTokensEscrowedInCurrentCycle() {
    var txSenderAddress: string;
    
    (await this.getCurrentCycle());

    // read only function args
    var token_x = this.redApplesContract;
    var token_y = this.greenApplesContract;
    var token_lp = this.lpContract;

    var who = principalCV(this.txSenderAddress)

    // get APPLES-LP info
    var options_lp = {
      network: this.network,
      contractAddress: this.deployerAddress,
      contractName: 'appleswap-v1-1',
      functionName: 'get-lp-staked-by-user-at-cycle',
      functionArgs: [token_x, token_y, uintCV(this.currentCycle), who],
      senderAddress: this.txSenderAddress

    }
    const result_lp = await callReadOnlyFunction(options_lp);
    var output_lp = cvToValue(result_lp);
    this.escrowedTokens[0].amount = output_lp['lp-staked'].value;

  }

  async getRewardsAndPrincipalPast30CyclesWrapper() {
    let output = (await this.getRewardsAndPrincipalPast30Cycles());
    return output
  }

  async getRewardsAndPrincipalPast30Cycles() {
    // iterative over getRewardsAndPrincipalAtCycleI here b/c of read limit on devnet for getRewardsAndPrincipalSummary. 
    // can use an alternate method on test/main net

    // get a list of most recent 1000 cycles to check
    (await this.getCurrentCycle());
    var cycleNum = Number(this.currentCycle);
    var cycleList : any[] = []
    for (let i=0; i < 30; i++) {
      if (cycleNum - i >= 0) {
        cycleList.push(cycleNum - i)
      }
    }
    cycleList.reverse();

    var rapArray = cycleList.map(this.getRewardsAndPrincipalAtCycleI);
    var rapArrayDone = Promise.all(rapArray);
    console.log("rapArray: ", rapArrayDone);

    var res: any[] = [];

    for(var i=0;i<cycleList.length;i++){
      for(var j=0;j<4;j++){
        res[j] = (res[j] || 0) + Number((await rapArrayDone)[i][j]);
      }
    }
    console.log("res: ", res);

    // this.xrewards = res[0];
    // this.yrewards = res[1];
    // this.lp_principal = res[2];

    this.userRewardsTokens[0].amount = res[0];
    this.userRewardsTokens[1].amount = res[1];
    this.principalToClaimTokens[0].amount = res[2];

    return rapArrayDone
  }

  async getRewardsAndPrincipalAtCycleI(i: number) {
    var cycleNum = uintCV(i);


    // var who = principalCV(this.txSenderAddress) //unclear why this failed, and needed to redefine these variables.
    var txSenderAddress = userSession.loadUserData().profile.stxAddress.testnet;
    var deployerAddress: string = 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW';
    var who = principalCV(txSenderAddress)
    var redApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
      createAddress(deployerAddress),
      createLPString('red-apples')
    );
  
    var greenApplesContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
      createAddress(deployerAddress),
      createLPString('green-apples')
    );
  
    var lpContract: ContractPrincipalCV = contractPrincipalCVFromAddress(
      createAddress(deployerAddress),
      createLPString('apple-lp')
    )

    var options = {
      // network: this.network,
      network: new StacksTestnet(),
      contractAddress: deployerAddress,
      contractName: 'appleswap-v1-1',
      functionName: 'get-rewards-at-cycle',
      functionArgs: [cycleNum, who, redApplesContract, greenApplesContract, lpContract],
      senderAddress: txSenderAddress
    }
    const result = await callReadOnlyFunction(options);
    var output = cvToValue(result);
    var xrewards = output.value[0].value;
    var yrewards = output.value[1].value;
    var lp_principal = output.value[2].value;
    return [xrewards, yrewards, lp_principal]
  }

  async claimAllRewards() {
    console.log('Claim all rewards');

    (await this.getCurrentCycle());
    var txSenderAddress: string;
    console.log(this.currentCycle)
    var cycleNum = Number(this.currentCycle);
    var cycleList : any[] = []
    for (let i=0; i < 1000; i++) {
      if (cycleNum - i >= 0) {
        cycleList.push(uintCV(cycleNum - i))
      }
    }
    cycleList.reverse();

    if (this.network.isMainnet()) {
      txSenderAddress = userSession.loadUserData().profile.stxAddress.mainnet;
      console.log(txSenderAddress)
    }
    else {

      txSenderAddress = userSession.loadUserData().profile.stxAddress.testnet;
    }

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
      functionName: 'claim-rewards-many',
      functionArgs: [listCV(cycleList), token_x, token_y, token_lp],
      postConditionMode: PostConditionMode.Allow,
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

  async getRewardsAndPrincipalOverManyCycles() {
    var txSenderAddress: string;
    
    // get a list of most recent 1000 cycles to check
    (await this.getCurrentCycle());
    var txSenderAddress: string;
    console.log(this.currentCycle)
    var cycleNum = Number(this.currentCycle);
    var cycleList : any[] = []
    for (let i=0; i < 1000; i++) {
      if (cycleNum - i >= 0) {
        cycleList.push(uintCV(cycleNum - i))
      }
    }
    cycleList.reverse();

    // read only function args
    var token_x = this.redApplesContract;
    var token_y = this.greenApplesContract;
    var token_lp = this.lpContract;

    txSenderAddress = userSession.loadUserData().profile.stxAddress.testnet;

    var who = principalCV(txSenderAddress)


    var options = {
      network: this.network,
      contractAddress: 'STRP7MYBHSMFH5EGN3HGX6KNQ7QBHVTBPF1669DW',
      contractName: 'appleswap-v1-1',
      functionName: 'get-rewards-and-principal-many-cycles',
      functionArgs: [listCV(cycleList), who, token_x, token_y, token_lp],
      senderAddress: txSenderAddress

    }
    const result = await callReadOnlyFunction(options);
    var output = cvToValue(result);
    console.log(output);
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
    this.loadingChange.emit(loading);
  }
}
