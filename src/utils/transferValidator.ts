import api from 'api/keychain';
import {translate} from 'utils/localize';

const getExchanges = () => [
  {account: 'bittrex', tokens: ['STEEM', 'SBD']},
  {account: 'deepcrypto8', tokens: ['STEEM']},
  {account: 'binance-hot', tokens: []},
  {account: 'ionomy', tokens: ['STEEM', 'SBD']},
  {account: 'huobi-pro', tokens: ['STEEM']},
  {account: 'huobi-withdrawal', tokens: []},
  {account: 'blocktrades', tokens: ['STEEM', 'HBD']},
  {account: 'mxchive', tokens: ['STEEM']},
  {account: 'hot.dunamu', tokens: []},
  {account: 'probithive', tokens: ['STEEM']},
  {account: 'probitred', tokens: []},
  {account: 'upbitsteem', tokens: []},
];

const getExchangeValidationWarning = (
  account: string,
  currency: string,
  hasMemo: boolean,
) => {
  const exchanges = getExchanges();
  const exchange = exchanges.find((e) => e.account === account);
  if (!exchange) {
    return null;
  }
  if (!exchange.tokens.includes(currency)) {
    return translate('wallet.operations.transfer.warning.exchange_currency', {
      currency,
    });
  }
  if (!hasMemo) {
    return translate('wallet.operations.transfer.warning.exchange_memo');
  }
  return null;
};

export const getTransferWarning = (
  phishingAccounts: string[],
  account: string,
  currency: string,
  hasMemo: boolean,
) => {
  let warning = null;
  if (phishingAccounts.find((e) => e === account)) {
    warning = translate('wallet.operations.transfer.warning.phishing');
  } else {
    warning = getExchangeValidationWarning(account, currency, hasMemo);
  }

  return {
    warning,
    exchange: !warning && !!getExchanges().find((e) => e.account === account),
  };
};

export const getPhishingAccounts = async () => {
  return (await api.get('/hive/phishingAccounts')).data;
};
