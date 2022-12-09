import {loadAccount} from 'actions/index';
import Sp from 'assets/wallet/icon_power.svg';
import AccountLogo from 'assets/addAccount/icon_username.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {powerUp} from 'utils/hive';
import {getCurrencyProperties} from 'utils/steemReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/steemUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Balance from './Balance';
import Operation from './Operation';

type Props = PropsFromRedux & {currency?: string};

const PowerUp = ({currency = 'STEEM', user, loadAccount}: Props) => {
  const [to, setTo] = useState(user.account.name);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onPowerUp = async () => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      await powerUp(user.keys.active!, {
        amount: sanitizeAmount(amount, currency),
        to: sanitizeUsername(to),
        from: user.account.name,
      });
      loadAccount(user.account.name, true);
      goBack();
      Toast.show(translate('toast.powerup_success'), Toast.LONG);
    } catch (e) {
      Toast.show(`Error: ${e.message}`, Toast.LONG);
    } finally {
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      logo={<Sp fill="#e59d15" />}
      title={translate('wallet.operations.powerup.title')}>
      <>
        <Separator />
        <Balance currency={currency} account={user.account} />

        <Separator />
        <OperationInput
          placeholder={translate('common.username').toUpperCase()}
          leftIcon={<AccountLogo fill="#7e8c9a" />}
          autoCapitalize="none"
          value={to}
          onChangeText={setTo}
        />
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
          onPress={onPowerUp}
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
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(PowerUp);
