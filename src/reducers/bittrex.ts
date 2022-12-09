import {ActionPayload, CurrencyPrices} from 'actions/interfaces';
import {GET_BITTREX_PRICE} from 'actions/types';

const bittrexReducer = (
  state: CurrencyPrices = {btc: {}, steem: {}, steem_dollar: {}},
  {type, payload}: ActionPayload<CurrencyPrices>,
) => {
  switch (type) {
    case GET_BITTREX_PRICE:
      return payload!;
    default:
      return state;
  }
};

export default bittrexReducer;
