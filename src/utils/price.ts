import {DynamicGlobalProperties, ExtendedAccount} from 'dsteem';
import {CurrencyPrices} from 'actions/interfaces';
import api from 'api/keychain';
import {toSP} from 'utils/format';

export const getPrices = async () => {
  return (await api.get<CurrencyPrices>('bittrex_price.json')).data;
};

export const getAccountValue = (
  {
    sbd_balance,
    balance,
    vesting_shares,
    savings_balance,
    savings_sbd_balance,
  }: ExtendedAccount,
  {steem, steem_dollar}: CurrencyPrices,
  props: DynamicGlobalProperties,
) => {
  if (!steem_dollar?.usd || !steem?.usd) return 0;
  return (
    (parseFloat(sbd_balance as string) +
      parseFloat(savings_sbd_balance as string)) *
      steem_dollar?.usd +
    (toSP(vesting_shares as string, props) +
      parseFloat(balance as string) +
      parseFloat(savings_balance as string)) *
      steem.usd
  ).toFixed(3);
};
