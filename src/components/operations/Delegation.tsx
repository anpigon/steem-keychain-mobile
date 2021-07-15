import {loadAccount} from 'actions/index';
import Delegate from 'assets/wallet/icon_delegate.svg';
import AccountLogo from 'assets/addAccount/icon_username.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {fromSP} from 'utils/format';
import dsteem, {delegate} from 'utils/steem';
import {getCurrencyProperties} from 'utils/steemReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/steemUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import Balance from './Balance';
import Operation from './Operation';

type Props = PropsFromRedux & {currency?: string; delegatee?: string};

const Delegation = ({
  currency = 'SP',
  user,
  loadAccount,
  properties,
  delegatee,
}: Props) => {
  const [to, setTo] = useState(delegatee || '');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onDelegate = async () => {
    setLoading(true);

    Keyboard.dismiss();
    try {
      const delegation = await delegate(user.keys.active, {
        vesting_shares: sanitizeAmount(
          fromSP(sanitizeAmount(amount), properties.globals).toString(),
          'VESTS',
          6,
        ),
        delegatee: sanitizeUsername(to),
        delegator: user.account.name,
      });
      loadAccount(user.account.name, true);
      goBack();
      if (parseFloat(amount.replace(',', '.')) !== 0) {
        Toast.show(translate('toast.delegation_success'), Toast.LONG);
      } else {
        Toast.show(translate('toast.stop_delegation_success'), Toast.LONG);
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.startsWith('unknown key:')) {
          Toast.show(
            translate('request.error.transfer.get_account', { to }),
            Toast.LONG,
          );
        } else {
          Toast.show(`Error : ${e.message}`, Toast.LONG);
        }
      } else {
        Toast.show(`Error : ${e.toString()}`, Toast.LONG);
      }
    } finally {
      setLoading(false);
    }
  };
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color);
  return (
    <Operation
      logo={<Delegate fill="#B084C4" />}
      title={translate('wallet.operations.delegation.title')}>
      <>
        <Separator />
        <Balance
          currency={currency}
          account={user.account}
          pd
          globalProperties={properties.globals}
        />

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
          onPress={onDelegate}
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
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Delegation);
