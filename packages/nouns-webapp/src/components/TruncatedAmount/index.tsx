import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import React from 'react';

const TruncatedAmount: React.FC<{ amount: BigNumber }> = props => {
  const { amount } = props;
  const eth = new BigNumber(utils.formatEther(amount.toFixed(0))).toFixed(2);
  return <>Ξ {`${eth}`}</>;
};
export default TruncatedAmount;
