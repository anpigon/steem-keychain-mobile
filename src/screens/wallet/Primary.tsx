import Steem from 'assets/wallet/icon_steem.svg';
import Sp from 'assets/wallet/icon_power.svg';
import Savings from 'assets/wallet/icon_savings.svg';
import AccountValue from 'components/hive/AccountValue';
import TokenDisplay from 'components/hive/TokenDisplay';
import {
  Send,
  SendConversion,
  SendDelegation,
  SendDeposit,
  SendPowerDown,
  SendPowerUp,
  SendWithdraw,
} from 'components/operations/OperationsButtons';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {toSP} from 'utils/format';
import {translate} from 'utils/localize';

enum Token {
  NONE,
  HIVE,
  HBD,
  HP,
  SAVINGS,
}

const Primary = ({user, prices, properties}: PropsFromRedux) => {
  const {width} = useWindowDimensions();
  useEffect(() => {
    logScreenView('WalletScreen');
  }, []);
  const [toggled, setToggled] = useState(Token.NONE);
  return (
    <View style={styles.container}>
      <Separator height={30} />
      <AccountValue
        account={user.account}
        prices={prices}
        properties={properties}
      />
      <Separator height={30} />

      <TokenDisplay
        color="#4CA2F0"
        name="STEEM"
        currency="STEEM"
        value={parseFloat(user.account.balance as string)}
        logo={<Steem width={width / 15} fill="#4CA2F0" />}
        price={prices.steem}
        toggled={toggled === Token.HIVE}
        setToggle={() => {
          setToggled(toggled === Token.HIVE ? Token.NONE : Token.HIVE);
        }}
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
        price={prices.steem_dollar}
        toggled={toggled === Token.HBD}
        setToggle={() => {
          setToggled(toggled === Token.HBD ? Token.NONE : Token.HBD);
        }}
        buttons={[
          <Send key="send_sbd" currency="SBD" />,
          <SendConversion key="conversion" currency="SBD" />,
          <View style={{width: 20}}></View>,
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
        toggled={toggled === Token.HP}
        setToggle={() => {
          setToggled(toggled === Token.HP ? Token.NONE : Token.HP);
        }}
        price={prices.steem_dollar}
        buttons={[
          <SendDelegation key="del" />,
          <SendPowerDown key="pd" />,
          <View style={{width: 20}}></View>,
        ]}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#7E8C9A"
        name={translate('common.savings').toUpperCase()}
        currency="HIVE"
        value={parseFloat(user.account.savings_balance as string)}
        secondaryCurrency="HBD"
        secondaryValue={parseFloat(user.account.savings_hbd_balance as string)}
        logo={<Savings width={width / 15} />}
        toggled={toggled === Token.SAVINGS}
        setToggle={() => {
          setToggled(toggled === Token.SAVINGS ? Token.NONE : Token.SAVINGS);
        }}
        bottomLeft={
          <Text>
            <Text style={styles.apr}>HBD APR:</Text>
            <Text style={styles.aprValue}>
              {'   '}
              {properties.globals && properties.globals.hbd_interest_rate
                ? `${properties.globals.hbd_interest_rate / 100}%`
                : ''}
            </Text>
          </Text>
        }
        buttons={[
          <SendWithdraw key="savings_withdraw" currency="HBD" />,
          <SendDeposit key="savings_deposit" currency="HBD" />,
          <View style={{width: 20}}></View>,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1},
  apr: {color: '#7E8C9A', fontSize: 14},
  aprValue: {color: '#3BB26E', fontSize: 14},
});

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    prices: state.currencyPrices,
    properties: state.properties,
  };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Primary);
