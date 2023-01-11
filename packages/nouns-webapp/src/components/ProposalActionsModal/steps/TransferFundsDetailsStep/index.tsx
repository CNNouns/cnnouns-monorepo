import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import { ProposalActionModalStepProps } from '../..';
import BrandTextEntry from '../../../BrandTextEntry';
import BrandNumericEntry from '../../../BrandNumericEntry';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';
import classes from '../TransferFundsReviewStep/TransferFundsReviewStep.module.css';

export enum SupportedCurrency {
  ETH = 'ETH',
}

const TransferFundsDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, setState } = props;

  const [currency] = useState<SupportedCurrency>(
    SupportedCurrency.ETH,
  );
  const [amount, setAmount] = useState<string>(state.amount ?? '');
  const [formattedAmount, setFormattedAmount] = useState<string>(state.amount ?? '');
  const [address, setAddress] = useState(state.address ?? '');
  const [isValidForNextStage, setIsValidForNextStage] = useState(false);

  useEffect(() => {
    if (utils.isAddress(address) && parseFloat(amount) > 0 && !isValidForNextStage) {
      setIsValidForNextStage(true);
    }
  }, [amount, address, isValidForNextStage]);

  return (
    <div>
      <ModalTitle>
        <Trans>Add Transfer Funds Action</Trans>
      </ModalTitle>

      <span className={classes.label}>通貨</span>
      <div className={classes.text}>ETH</div>

      <BrandNumericEntry
        label={'金額'}
        value={formattedAmount}
        onValueChange={e => {
          setAmount(e.value);
          setFormattedAmount(e.formattedValue);
        }}
        placeholder='0 ETH'
        isInvalid={parseFloat(amount) > 0 && new BigNumber(amount).isNaN()}
      />

      <BrandTextEntry
        label={'受取ウォレットアドレス'}
        onChange={e => setAddress(e.target.value)}
        value={address}
        type="string"
        placeholder="0x..."
        isInvalid={address.length === 0 ? false : !utils.isAddress(address)}
      />

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Review and Add</Trans>}
        isNextBtnDisabled={!isValidForNextStage}
        onNextBtnClick={() => {
          setState(x => ({
            ...x,
            amount,
            address,
            TransferFundsCurrency: currency,
          }));
          onNextBtnClick();
        }}
      />
    </div>
  );
};

export default TransferFundsDetailsStep;
