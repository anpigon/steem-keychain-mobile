import {DynamicGlobalProperties, ExtendedAccount} from 'dsteem';
import {Bittrex} from 'actions/interfaces';
import api from 'api/keychain';
import {toSP} from 'utils/format';

export const getBittrexPrices = async () => {
  try {
    return (await api.get('price.json')).data as Bittrex;
  } catch (e) {}
  return {
    steem: {
      Usd: 0.0,
      DailyUsd: 0.0,
    },
    sbd: {
      Usd: 0.0,
      DailyUsd: 0.0,
    },
  };
};

export const getAccountValue = (
  {hbd_balance, balance, vesting_shares}: ExtendedAccount,
  {steem, sbd}: Bittrex,
  props: DynamicGlobalProperties,
) => {
  if (!sbd?.Usd || !steem?.Usd) return 0;
  return (
    parseFloat(hbd_balance as string) * parseFloat(sbd?.Usd) +
    (toSP(vesting_shares as string, props) + parseFloat(balance as string)) *
      parseFloat(steem.Usd)
  ).toFixed(3);
};
