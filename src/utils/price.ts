import {DynamicGlobalProperties, ExtendedAccount} from 'dsteem';
import {Bittrex} from 'actions/interfaces';
import api from 'api/keychain';
import {toSP} from 'utils/format';

export const getBittrexPrices = async () => {
  try {
    return (await api.get('bittrex_price.json')).data as Bittrex;
  } catch (e) {}
};

export const getAccountValue = (
  {sbd_balance, balance, vesting_shares}: ExtendedAccount,
  {steem, sbd}: Bittrex,
  props: DynamicGlobalProperties,
) => {
  if (!sbd?.Usd || !steem?.Usd) return 0;
  return (
    parseFloat(sbd_balance as string) * parseFloat(sbd?.Usd) +
    (toSP(vesting_shares as string, props) + parseFloat(balance as string)) *
      parseFloat(steem.Usd)
  ).toFixed(3);
};
