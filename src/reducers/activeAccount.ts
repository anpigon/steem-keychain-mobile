import {ExtendedAccount} from '@upvu/dsteem';
import {Manabar} from 'dsteem/lib/steem/rc';
import {AccountKeys, ActionPayload, ActiveAccount} from 'actions/interfaces';
import {
  ACTIVE_ACCOUNT,
  ACTIVE_ACCOUNT_RC,
  FORGET_ACCOUNT,
  FORGET_ACCOUNTS,
} from 'actions/types';

const activeAccountReducer = (
  state: ActiveAccount = {
    account: {} as ExtendedAccount,
    keys: {} as AccountKeys,
    rc: {} as Manabar,
  },
  {type, payload}: ActionPayload<any>,
): ActiveAccount => {
  switch (type) {
    case ACTIVE_ACCOUNT:
      return {...state, ...payload};
    case ACTIVE_ACCOUNT_RC:
      return {...state, rc: payload};
    case FORGET_ACCOUNT:
    case FORGET_ACCOUNTS:
      return {account: {} as ExtendedAccount, keys: {}, rc: {} as Manabar};
    default:
      return state;
  }
};

export default activeAccountReducer;
