import {combineReducers} from 'redux';
import accounts from './accounts';
import activeAccount from './activeAccount';
import auth from './auth';
import browser from './browser';
import conversions from './conversions';
import currencyPrices from './currencyPrices';
import delegations from './delegations';
import properties from './globalProperties';
import hiveUri from './hive-uri';
import hive_authentication_service from './hiveAuthenticationService';
import lastAccount from './lastAccount';
import phishingAccounts from './phishing';
import preferences from './preferences';
import settings from './settings';
import tokenHistory from './tokenHistory';
import tokens from './tokens';
import tokensMarket from './tokensMarket';
import transactions from './transactions';
import userTokens from './userTokens';
export default combineReducers({
  auth,
  accounts,
  lastAccount,
  activeAccount,
  properties,
  currencyPrices,
  transactions,
  delegations,
  tokens,
  userTokens,
  tokensMarket,
  tokenHistory,
  phishingAccounts,
  conversions,
  settings,
  browser,
  preferences,
  hive_authentication_service,
  hiveUri,
});
