/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.12.1.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { AssetInfo, Addr, Uint128, InstantiateMsg, IncentivizationFeeInfo, Coin, ExecuteMsg, Binary, Cw20ReceiveMsg, InputSchedule, Asset, QueryMsg, ArrayOfTupleOfStringAndUint128, ArrayOfAssetInfo, Config, Decimal256, ArrayOfScheduleResponse, ScheduleResponse, Boolean, ArrayOfString, ArrayOfAsset, RewardType, PoolInfoResponse, RewardInfo, ArrayOfRewardInfo } from "./AstroportIncentives.types";
export interface AstroportIncentivesMsg {
  contractAddress: string;
  sender: string;
  setupPools: ({
    pools
  }: {
    pools: string[][];
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  claimRewards: ({
    lpTokens
  }: {
    lpTokens: string[];
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  receive: ({
    amount,
    msg,
    sender
  }: {
    amount: Uint128;
    msg: Binary;
    sender: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  deposit: ({
    recipient
  }: {
    recipient?: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  withdraw: ({
    amount,
    lpToken
  }: {
    amount: Uint128;
    lpToken: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  setTokensPerSecond: ({
    amount
  }: {
    amount: Uint128;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  incentivize: ({
    lpToken,
    schedule
  }: {
    lpToken: string;
    schedule: InputSchedule;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  incentivizeMany: (funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  removeRewardFromPool: ({
    bypassUpcomingSchedules,
    lpToken,
    receiver,
    reward
  }: {
    bypassUpcomingSchedules: boolean;
    lpToken: string;
    receiver: string;
    reward: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  claimOrphanedRewards: ({
    limit,
    receiver
  }: {
    limit?: number;
    receiver: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  updateConfig: ({
    astroToken,
    generatorController,
    guardian,
    incentivizationFeeInfo,
    tokenTransferGasLimit,
    vestingContract
  }: {
    astroToken?: AssetInfo;
    generatorController?: string;
    guardian?: string;
    incentivizationFeeInfo?: IncentivizationFeeInfo;
    tokenTransferGasLimit?: number;
    vestingContract?: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  updateBlockedTokenslist: ({
    add,
    remove
  }: {
    add?: AssetInfo[];
    remove?: AssetInfo[];
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  deactivatePool: ({
    lpToken
  }: {
    lpToken: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  deactivateBlockedPools: (funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  proposeNewOwner: ({
    expiresIn,
    owner
  }: {
    expiresIn: number;
    owner: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  dropOwnershipProposal: (funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  claimOwnership: (funds_?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class AstroportIncentivesMsgComposer implements AstroportIncentivesMsg {
  sender: string;
  contractAddress: string;
  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.setupPools = this.setupPools.bind(this);
    this.claimRewards = this.claimRewards.bind(this);
    this.receive = this.receive.bind(this);
    this.deposit = this.deposit.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.setTokensPerSecond = this.setTokensPerSecond.bind(this);
    this.incentivize = this.incentivize.bind(this);
    this.incentivizeMany = this.incentivizeMany.bind(this);
    this.removeRewardFromPool = this.removeRewardFromPool.bind(this);
    this.claimOrphanedRewards = this.claimOrphanedRewards.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
    this.updateBlockedTokenslist = this.updateBlockedTokenslist.bind(this);
    this.deactivatePool = this.deactivatePool.bind(this);
    this.deactivateBlockedPools = this.deactivateBlockedPools.bind(this);
    this.proposeNewOwner = this.proposeNewOwner.bind(this);
    this.dropOwnershipProposal = this.dropOwnershipProposal.bind(this);
    this.claimOwnership = this.claimOwnership.bind(this);
  }
  setupPools = ({
    pools
  }: {
    pools: string[][];
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          setup_pools: {
            pools
          }
        })),
        funds: funds_
      })
    };
  };
  claimRewards = ({
    lpTokens
  }: {
    lpTokens: string[];
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          claim_rewards: {
            lp_tokens: lpTokens
          }
        })),
        funds: funds_
      })
    };
  };
  receive = ({
    amount,
    msg,
    sender
  }: {
    amount: Uint128;
    msg: Binary;
    sender: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          receive: {
            amount,
            msg,
            sender
          }
        })),
        funds: funds_
      })
    };
  };
  deposit = ({
    recipient
  }: {
    recipient?: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          deposit: {
            recipient
          }
        })),
        funds: funds_
      })
    };
  };
  withdraw = ({
    amount,
    lpToken
  }: {
    amount: Uint128;
    lpToken: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          withdraw: {
            amount,
            lp_token: lpToken
          }
        })),
        funds: funds_
      })
    };
  };
  setTokensPerSecond = ({
    amount
  }: {
    amount: Uint128;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          set_tokens_per_second: {
            amount
          }
        })),
        funds: funds_
      })
    };
  };
  incentivize = ({
    lpToken,
    schedule
  }: {
    lpToken: string;
    schedule: InputSchedule;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          incentivize: {
            lp_token: lpToken,
            schedule
          }
        })),
        funds: funds_
      })
    };
  };
  incentivizeMany = (funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          incentivize_many: {}
        })),
        funds: funds_
      })
    };
  };
  removeRewardFromPool = ({
    bypassUpcomingSchedules,
    lpToken,
    receiver,
    reward
  }: {
    bypassUpcomingSchedules: boolean;
    lpToken: string;
    receiver: string;
    reward: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          remove_reward_from_pool: {
            bypass_upcoming_schedules: bypassUpcomingSchedules,
            lp_token: lpToken,
            receiver,
            reward
          }
        })),
        funds: funds_
      })
    };
  };
  claimOrphanedRewards = ({
    limit,
    receiver
  }: {
    limit?: number;
    receiver: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          claim_orphaned_rewards: {
            limit,
            receiver
          }
        })),
        funds: funds_
      })
    };
  };
  updateConfig = ({
    astroToken,
    generatorController,
    guardian,
    incentivizationFeeInfo,
    tokenTransferGasLimit,
    vestingContract
  }: {
    astroToken?: AssetInfo;
    generatorController?: string;
    guardian?: string;
    incentivizationFeeInfo?: IncentivizationFeeInfo;
    tokenTransferGasLimit?: number;
    vestingContract?: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_config: {
            astro_token: astroToken,
            generator_controller: generatorController,
            guardian,
            incentivization_fee_info: incentivizationFeeInfo,
            token_transfer_gas_limit: tokenTransferGasLimit,
            vesting_contract: vestingContract
          }
        })),
        funds: funds_
      })
    };
  };
  updateBlockedTokenslist = ({
    add,
    remove
  }: {
    add?: AssetInfo[];
    remove?: AssetInfo[];
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_blocked_tokenslist: {
            add,
            remove
          }
        })),
        funds: funds_
      })
    };
  };
  deactivatePool = ({
    lpToken
  }: {
    lpToken: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          deactivate_pool: {
            lp_token: lpToken
          }
        })),
        funds: funds_
      })
    };
  };
  deactivateBlockedPools = (funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          deactivate_blocked_pools: {}
        })),
        funds: funds_
      })
    };
  };
  proposeNewOwner = ({
    expiresIn,
    owner
  }: {
    expiresIn: number;
    owner: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          propose_new_owner: {
            expires_in: expiresIn,
            owner
          }
        })),
        funds: funds_
      })
    };
  };
  dropOwnershipProposal = (funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          drop_ownership_proposal: {}
        })),
        funds: funds_
      })
    };
  };
  claimOwnership = (funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          claim_ownership: {}
        })),
        funds: funds_
      })
    };
  };
}