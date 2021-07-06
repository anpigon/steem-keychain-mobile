import {DynamicGlobalProperties} from 'dsteem';
import {translate} from 'utils/localize';
import {HiveErrorMessage} from './keychain.types';

export const withCommas = (nb: string, decimals = 3) =>
  parseFloat(parseFloat(nb).toFixed(decimals))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const toSP = (vests: string, props?: DynamicGlobalProperties) =>
  props
    ? (parseFloat(vests) * parseFloat(props.total_vesting_fund_steem + '')) /
      parseFloat(props.total_vesting_shares + '')
    : 0;

export const fromSP = (hp: string, props: DynamicGlobalProperties) =>
  (parseFloat(hp) / parseFloat(props.total_vesting_fund_steem + '')) *
  parseFloat(props.total_vesting_shares + '');

export const chunkArray = (myArray: any[], chunk_size: number) => {
  const arrayLength = myArray.length;
  let tempArray = [];

  for (let index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
};

export const signedNumber = (nb: number) =>
  nb > 0 ? `+ ${nb}` : `${nb.toString().replace('-', '- ')}`;

export const formatBalance = (balance: number) =>
  balance > 1000 ? withCommas(balance + '', 0) : withCommas(balance + '');

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const beautifyTransferError = (
  err: HiveErrorMessage,
  {currency, username, to}: {currency?: string; username?: string; to?: string},
) => {
  if (!err.data && err.message.includes('Unable to serialize')) {
    return translate('request.error.transfer.encrypt');
  }
  switch (err.data.stack[0].context.method) {
    case 'adjust_balance':
      return translate('request.error.transfer.adjust_balance', {
        currency,
        username,
      });
    case 'get_account':
      return translate('request.error.transfer.get_account', {to});
    default:
      return translate('request.error.broadcasting');
  }
};
