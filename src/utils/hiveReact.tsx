import {ExtendedAccount} from '@upvu/dsteem';
import Steem from 'assets/wallet/icon_steem.svg';
import Sp from 'assets/wallet/icon_power.svg';
import React from 'react';

export const getCurrencyProperties = (
  currency: string,
  account?: ExtendedAccount,
) => {
  let color, value, logo;
  switch (currency) {
    case 'STEEM':
      color = '#4CA2F0';
      logo = <Steem fill="#4CA2F0" />;
      value = account ? account.balance : null;
      break;
    case 'SBD':
      color = '#005C09';
      value = account ? account.sbd_balance : null;
      logo = <Steem fill="#005C09" />;
      break;
    default:
      color = '#AC4F00';
      value = account ? account.vesting_shares : null;
      logo = <Sp fill="#e59d15" />;
      break;
  }
  return {currency, color, value, logo};
};
