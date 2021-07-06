import {
  fetchPhishingAccounts,
  loadAccount,
  loadBittrex,
  loadProperties,
} from 'actions/index';
import UserPicker from 'components/form/UserPicker';
import PercentageDisplay from 'components/hive/PercentageDisplay';
import ScreenToggle from 'components/ui/ScreenToggle';
import WalletPage from 'components/ui/WalletPage';
import React, {useEffect} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import Primary from 'screens/wallet/Primary';
import Tokens from 'screens/wallet/Tokens';
import {RootState} from 'store';
import {Width} from 'utils/common.types';
import {getVotingDollarsPerAccount, getVP} from 'utils/steemUtils';
import {translate} from 'utils/localize';

const Main = ({
  loadAccount,
  loadProperties,
  loadBittrex,
  fetchPhishingAccounts,
  user,
  properties,
  accounts,
  lastAccount,
}: PropsFromRedux) => {
  const styles = getDimensionedStyles(useWindowDimensions());

  useEffect(() => {
    loadAccount(lastAccount || accounts[0].name);
    loadProperties();
    loadBittrex();
    fetchPhishingAccounts();
  }, [
    loadAccount,
    accounts,
    loadProperties,
    loadBittrex,
    fetchPhishingAccounts,
    lastAccount,
  ]);

  if (!user) {
    return null;
  }
  return (
    <WalletPage>
      <>
        <UserPicker
          accounts={accounts.map((account) => account.name)}
          username={user.name!}
          // {addAccount={() => {
          //   navigation.navigate('AddAccountFromWalletScreen', {wallet: true});
          // }}}
          onAccountSelected={loadAccount}
        />
        <View style={styles.resourcesWrapper}>
          <PercentageDisplay
            name={translate('wallet.rc')}
            percent={user.rc.percentage / 100 || 100}
            color="#E59D15"
          />
          <PercentageDisplay
            name={translate('wallet.vp')}
            percent={getVP(user.account) || 100}
            color="#3BB26E"
            secondary={`$${
              getVotingDollarsPerAccount(
                100,
                properties,
                user.account,
                false,
              ) || '0'
            }`}
          />
        </View>
        <ScreenToggle
          style={styles.toggle}
          menu={['Primary', 'Tokens']}
          toUpperCase
          components={[<Primary />, <Tokens />]}
        />
      </>
    </WalletPage>
  );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    textCentered: {textAlign: 'center'},
    white: {color: 'white'},
    resourcesWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: width * 0.05,
      paddingRight: width * 0.05,
    },
    toggle: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: width * 0.05,
      paddingRight: width * 0.05,
    },
  });
const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      properties: state.properties,
      accounts: state.accounts,
      lastAccount: state.lastAccount.name,
    };
  },
  {
    loadAccount,
    loadProperties,
    loadBittrex,
    fetchPhishingAccounts,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Main);
