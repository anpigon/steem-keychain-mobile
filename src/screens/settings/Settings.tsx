import {loadAccount} from 'actions/steem';
import {setRpc} from 'actions/index';
import {removePreference} from 'actions/preferences';
import CustomPicker from 'components/form/CustomPicker';
import UserPicker from 'components/form/UserPicker';
import CollaspibleSettings from 'components/settings/CollapsibleSettings';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {rpcList} from 'utils/steemUtils';
import {translate} from 'utils/localize';

const AccountManagement = ({
  setRpc,
  settings,
  accounts,
  active,
  loadAccount,
  preferences,
  removePreference,
}: PropsFromRedux) => {
  const showPreferencesHandler = () => {
    const userPreference = preferences.find((e) => e.username === active.name);
    if (!userPreference || !userPreference.domains.length)
      return <Text>{translate('settings.settings.nothing_to_show')}</Text>;
    return userPreference.domains.map((e, i) => (
      <CollaspibleSettings
        username={active.name}
        key={e.domain}
        index={i}
        domainPref={e}
        removePreference={removePreference}
      />
    ));
  };
  return (
    <SafeArea>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.view}>
        <Text style={styles.title}>
          {translate('settings.settings.global')}
        </Text>
        <Text style={styles.subtitle}>
          {translate('settings.settings.rpc')}
        </Text>
        {//@ts-ignore
        translate('settings.settings.disclaimer').map((disclaimer, i) => (
          <Text key={i} style={styles.disclaimer}>
            {disclaimer}
          </Text>
        ))}
        <Separator height={20} />
        <CustomPicker
          onSelected={setRpc}
          selectedValue={settings.rpc}
          list={rpcList}
          prompt={translate('components.picker.prompt_rpc')}
        />
        <View style={styles.separator}></View>
        <Text style={[styles.title, styles.userSettings]}>
          {translate('settings.settings.user')}
        </Text>
        <UserPicker
          accounts={accounts.map((e) => e.name)}
          username={active.name}
          onAccountSelected={(account) => {
            loadAccount(account, true);
          }}
        />
        <Separator />
        <Text style={styles.subtitle}>
          {' '}
          {translate('settings.settings.whitelisted')}
        </Text>
        <Separator />
        {showPreferencesHandler()}
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  separator: {borderBottomWidth: 1, paddingTop: 15},
  view: {paddingHorizontal: 20, backgroundColor: 'white', height: '100%'},
  title: {
    color: '#404950',
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 15,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#404950',
    fontSize: 16,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  disclaimer: {color: '#404950', marginVertical: 2},
  button: {backgroundColor: '#4ca2f0'},
  userSettings: {marginBottom: 0},
});

const mapStateToProps = (state: RootState) => ({
  settings: state.settings,
  accounts: state.accounts,
  active: state.activeAccount,
  preferences: state.preferences,
});
const connector = connect(mapStateToProps, {
  setRpc,
  loadAccount,
  removePreference,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AccountManagement);
