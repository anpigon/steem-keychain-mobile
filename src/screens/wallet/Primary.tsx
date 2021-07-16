import Steem from 'assets/wallet/icon_steem.svg';
import Sp from 'assets/wallet/icon_power.svg';
import AccountValue from 'components/steem/AccountValue';
import TokenDisplay from 'components/steem/TokenDisplay';
import Transactions from 'components/steem/Transactions';
import {
  Send,
  SendConversion,
  SendDelegation,
  SendPowerDown,
  SendPowerUp,
} from 'components/operations/OperationsButtons';
import Separator from 'components/ui/Separator';
import React, {useEffect} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import { RootState } from 'store';
import { logScreenView } from 'utils/analytics';
import {toSP} from 'utils/format';

const Primary = ({user, bittrex, properties}: PropsFromRedux) => {
  const { width } = useWindowDimensions();
  
  useEffect(() => {
    logScreenView('WalletScreen');
  }, []);

  return (
    <View style={styles.container}>
      <Separator height={20} />
      <AccountValue
        account={user.account}
        bittrex={bittrex}
        properties={properties}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#4ca2f0"
        name="STEEM"
        currency="STEEM"
        value={parseFloat(user.account.balance as string)}
        logo={<Steem width={width / 15} fill="#4ca2f0" />}
        price={bittrex.steem}
        buttons={[
          <Send key="send_steem" currency="STEEM" />,
          <SendPowerUp key="pu" />,
          // <SendConversion key="conversion" currency="STEEM" />,
        ]}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#005C09"
        name="STEEM DOLLARS"
        currency="SBD"
        value={parseFloat(user.account.sbd_balance as string)}
        logo={<Steem width={width / 15} fill="#005C09" />}
        price={bittrex.sbd}
        buttons={[
          <Send key="send_sbd" currency="SBD" />,
          <SendConversion key="conversion" currency="SBD" />,
        ]}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#AC4F00"
        name="STEEM POWER"
        currency="SP"
        value={toSP(user.account.vesting_shares as string, properties.globals)}
        incoming={toSP(
          user.account.received_vesting_shares as string,
          properties.globals,
        )}
        outgoing={toSP(
          user.account.delegated_vesting_shares as string,
          properties.globals,
        )}
        logo={<Sp width={width / 15} fill="#e59d15" />}
        price={bittrex.sbd}
        buttons={[<SendDelegation key="del" />, <SendPowerDown key="pd" />]}
      />
      <Separator height={20} />
      <Transactions user={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1},
});

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    bittrex: state.bittrex,
    properties: state.properties,
  };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Primary);
