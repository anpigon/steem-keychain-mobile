import ssc, {steemEngineAPI} from 'api/steemEngine';
import {AppThunk} from 'src/hooks/redux';
import {
  ActionPayload,
  Token,
  TokenBalance,
  TokenMarket,
  TokenTransaction,
} from './interfaces';
import {
  CLEAR_USER_TOKENS,
  LOAD_TOKENS,
  LOAD_TOKENS_MARKET,
  LOAD_TOKEN_HISTORY,
  LOAD_USER_TOKENS,
} from './types';

export const loadTokens = (): AppThunk => async (dispatch) => {
  const action: ActionPayload<Token[]> = {
    type: LOAD_TOKENS,
    payload: await ssc.find('tokens', 'tokens', {}, 1000, 0, []),
  };
  dispatch(action);
};

export const loadTokensMarket = (): AppThunk => async (dispatch) => {
  const action: ActionPayload<TokenMarket[]> = {
    type: LOAD_TOKENS_MARKET,
    payload: await ssc.find('market', 'metrics', {}, 1000, 0, []),
  };
  dispatch(action);
};

export const loadUserTokens =
  (account: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch({
        type: CLEAR_USER_TOKENS,
      });
      let tokensBalance: TokenBalance[] = await ssc.find('tokens', 'balances', {
        account,
      });
      tokensBalance = tokensBalance
        .filter((t) => parseFloat(t.balance) !== 0)
        .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
      const action: ActionPayload<TokenBalance[]> = {
        type: LOAD_USER_TOKENS,
        payload: tokensBalance,
      };
      dispatch(action);
    } catch (e) {
      console.log(e);
    }
  };

export const loadTokenHistory =
  (account: string, currency: string): AppThunk =>
  async (dispatch) => {
    let tokenHistory: TokenTransaction[] = (
      await steemEngineAPI.get('/history/accountHistory', {
        params: {account, symbol: currency, type: 'user', limit: 50, offset: 0},
      })
    ).data;
    tokenHistory = tokenHistory.map((e) => {
      e.amount = `${e.quantity} ${e.symbol}`;
      return e;
    });
    const action: ActionPayload<TokenTransaction[]> = {
      type: LOAD_TOKEN_HISTORY,
      payload: tokenHistory,
    };
    dispatch(action);
  };
