import { useContractCall, useEthers, useContractFunction } from '@usedapp/core';
import { connectContractToSigner } from '@usedapp/core/dist/cjs/src/hooks';
import { BigNumber as EthersBN, utils } from 'ethers';
import { NounsAuctionHouseABI, NounsAuctionHouseFactory } from '@nouns/sdk';
import config from '../config';
import BigNumber from 'bignumber.js';
import { isNounderNoun } from '../utils/nounderNoun';
import { useAppSelector } from '../hooks';
import { AuctionState } from '../state/slices/auction';

export enum AuctionHouseContractFunction {
  auction = 'auction',
  duration = 'duration',
  minBidIncrementPercentage = 'minBidIncrementPercentage',
  nouns = 'nouns',
  createBid = 'createBid',
  settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
}

export interface Auction {
  amount: EthersBN;
  bidder: string;
  endTime: EthersBN;
  startTime: EthersBN;
  nounId: EthersBN;
  settled: boolean;
}

const abi = new utils.Interface(NounsAuctionHouseABI);
const nounsAuctionHouseContract = new NounsAuctionHouseFactory().attach(
  config.addresses.nounsAuctionHouseProxy,
);

export const useAuction = (auctionHouseProxyAddress: string) => {
  const auction = useContractCall<Auction>({
    abi,
    address: auctionHouseProxyAddress,
    method: 'auction',
    args: [],
  });
  return auction as Auction;
};

export const useAuctionMinBidIncPercentage = () => {
  const minBidIncrement = useContractCall({
    abi,
    address: config.addresses.nounsAuctionHouseProxy,
    method: 'minBidIncrementPercentage',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};

/**
 * Computes timestamp after which a Noun could vote
 * @param nounId TokenId of Noun
 * @returns Unix timestamp after which Noun could vote
 */
export const useNounCanVoteTimestamp = (nounId: number) => {
  const nextNounId = nounId + 1;

  const nextNounIdForQuery = isNounderNoun(EthersBN.from(nextNounId)) ? nextNounId + 1 : nextNounId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  const maybeNounCanVoteTimestamp = pastAuctions.find((auction: AuctionState, i: number) => {
    const maybeNounId = auction.activeAuction?.nounId;
    return maybeNounId ? EthersBN.from(maybeNounId).eq(EthersBN.from(nextNounIdForQuery)) : false;
  })?.activeAuction?.startTime;

  if (!maybeNounCanVoteTimestamp) {
    // This state only occurs during loading flashes
    return EthersBN.from(0);
  }

  return EthersBN.from(maybeNounCanVoteTimestamp);
};

export const useSettleCurrentAndCreateNewAuction = () => {
  const { library } = useEthers();
  const { send: settleAuction, state: settleAuctionState } = useContractFunction(
    nounsAuctionHouseContract,
    AuctionHouseContractFunction.settleCurrentAndCreateNewAuction,
  );

  return {
    send: async (...args: any[]): Promise<void> => {
      const contract = connectContractToSigner(nounsAuctionHouseContract, undefined, library);
      const gasLimit = await contract.estimateGas.settleCurrentAndCreateNewAuction(...args);
      settleAuction(...args, {
        gasLimit: gasLimit.add(45_000), // A 45,000 gas pad is used to avoid 'Out of gas' errors
      });
    },
    state: settleAuctionState,
  };
};
