import {createStackNavigator} from '@react-navigation/stack';
import MoreInformation, {Info} from 'components/info_buttons/MoreInfo';
import DrawerButton from 'components/ui/DrawerButton';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import AddAccountByKey from 'screens/addAccounts/AddAccountByKey';
import ScanQR from 'screens/addAccounts/ScanQR';
import {translate} from 'utils/localize';
import {headerTransparent} from 'utils/navigation';
import {AddAccountFromWalletParamList} from './AddAccount.types';

const AccountStack = createStackNavigator<AddAccountFromWalletParamList>();

export default () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="AddAccountFromWalletScreen"
        //@ts-ignore : both headerRight and headerTransparent are needed here
        options={({navigation}) => ({
          headerRight: () => {
            return (
              <View style={styles.buttonsContainer}>
                <MoreInformation type={Info.KEYS} />
                <DrawerButton navigation={navigation} />
              </View>
            );
          },
          headerTintColor: 'white',
          title: translate('navigation.add_account'),
          headerTitleAlign: 'left',
          headerTransparent,
        })}
        initialParams={{wallet: true}}
        component={AddAccountByKey}
      />
      <AccountStack.Screen
        name="ScanQRScreen"
        options={{
          headerStyle: {backgroundColor: 'black'},
          headerTintColor: 'white',
          title: '',
          headerRight: () => {
            return <MoreInformation type={Info.QR_ACCOUNT} />;
          },
        }}
        component={ScanQR}
      />
    </AccountStack.Navigator>
  );
};

const styles = StyleSheet.create({buttonsContainer: {flexDirection: 'row'}});
