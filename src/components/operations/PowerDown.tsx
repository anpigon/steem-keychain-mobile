import {loadAccount} from 'actions/index';
import Sp from 'assets/wallet/icon_power.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {fromSP, toSP, withCommas} from 'utils/format';
import {powerDown} from 'utils/hive';
import {getCurrencyProperties} from 'utils/steemReact';
import {sanitizeAmount} from 'utils/steemUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Balance from './Balance';
import Operation from './Operation';

type Props = PropsFromRedux & {currency?: string};
const PowerDown = ({currency = 'SP', user, loadAccount, properties}: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const renderPDIndicator = () => {
    if (parseFloat(user.account.to_withdraw as string) !== 0) {
      return (
        <Text>
          <Text style={styles.bold}>
            {translate('wallet.operations.powerdown.current_power_down')} :{' '}
          </Text>
          {`${withCommas(
            toSP(user.account.withdrawn as string, properties.globals) /
              1000000 +
              '',
            1,
          )} / ${withCommas(
            toSP(user.account.to_withdraw as string, properties.globals) /
              1000000 +
              '',
            1,
          )} SP`}
        </Text>
      );
    } else {
      return null;
    }
  };
  const onPowerDown = async () => {
    setLoading(true);
    Keyboard.dismiss();

    try {
      await powerDown(user.keys.active!, {
        vesting_shares: sanitizeAmount(
          fromSP(sanitizeAmount(amount), properties.globals!).toString(),
          'VESTS',
          6,
        ),
        account: user.account.name,
      });
      loadAccount(user.account.name, true);
      goBack();
      if (parseFloat(amount.replace(',', '.')) !== 0) {
        Toast.show(translate('toast.powerdown_success'), Toast.LONG);
      } else {
        Toast.show(translate('toast.stop_powerdown_success'), Toast.LONG);
      }
    } catch (e) {
      Toast.show(`Error : ${e.message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      logo={<Sp fill="#000" />}
      title={translate('wallet.operations.powerdown.title')}>
      <>
        <Separator />
        <Balance
          currency={currency}
          account={user.account}
          pd
          globalProperties={properties.globals}
        />

        <Separator />
        {renderPDIndicator()}
        <Separator />

        <OperationInput
          placeholder={'0.000'}
          keyboardType="decimal-pad"
          rightIcon={<Text style={styles.currency}>{currency}</Text>}
          textAlign="right"
          value={amount}
          onChangeText={setAmount}
        />

        <Separator height={40} />
        <ActiveOperationButton
          title={translate('common.send')}
          onPress={onPowerDown}
          style={styles.button}
          isLoading={loading}
        />
      </>
    </Operation>
  );
};

const getDimensionedStyles = (color: string) =>
  StyleSheet.create({
    button: {backgroundColor: '#68A0B4'},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    bold: {fontWeight: 'bold'},
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      properties: state.properties,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PowerDown);
