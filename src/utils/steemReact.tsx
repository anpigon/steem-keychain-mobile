import {ExtendedAccount} from 'dsteem';
import Hbd from 'assets/wallet/icon_hbd.svg';
import Hive from 'assets/wallet/icon_hive.svg';
import Hp from 'assets/wallet/icon_sp.svg';
import React from 'react';

export const getCurrencyProperties = (
  currency: string,
  account?: ExtendedAccount,
) => {
  let color, value, logo;
  switch (currency) {
    case 'STEEM':
      color = '#4ca2f0';
      logo = <Hive />;
      value = account ? account.balance : null;
      break;
    case 'SBD':
      color = '#005C09';
      value = account ? account.sbd_balance : null;
      logo = <Hbd />;
      break;
    default:
      color = '#AC4F00';
      value = account ? account.vesting_shares : null;
      logo = <Hp />;
      break;
  }
  return {currency, color, value, logo};
};
