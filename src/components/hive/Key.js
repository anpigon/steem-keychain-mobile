import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Separator from 'components/ui/Separator';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import {translate} from 'utils/localize';
import RoundButton from 'components/operations/OperationsButtons';
import Remove from 'assets/settings/remove.svg';
import ViewIcon from 'assets/settings/view.svg';
import Copy from 'assets/settings/copy.svg';
import EllipticButton from 'components/form/EllipticButton';
import AddKey from 'components/modals/AddKey';

export default ({
  type,
  account,
  forgetKey,
  addKey,
  containerStyle,
  navigation,
}) => {
  if (!account) {
    return null;
  }
  const privateKey = account.keys[type];
  const publicKey = account.keys[`${type}Pubkey`];
  const [isPKShown, showPK] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      showPK(false);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={containerStyle}>
      <View style={styles.row}>
        <Text style={styles.keyAuthority}>{type.toUpperCase()} KEY</Text>
        {privateKey && (
          <RemoveKey
            forgetKey={() => {
              forgetKey(account.name, type);
            }}
            show={!!privateKey}
          />
        )}
      </View>
      <Separator height={20} />
      {privateKey ? (
        <>
          <View style={styles.row}>
            <Text style={styles.keyType}>
              {translate('common.public').toUpperCase()}
            </Text>
            <CopyKey wif={publicKey} />
          </View>
          <Separator height={5} />

          <Text style={styles.key}>{publicKey}</Text>
          <Separator height={20} />
          <View style={styles.row}>
            <Text style={styles.keyType}>
              {translate('common.private').toUpperCase()}
            </Text>
            <View style={[styles.row, styles.privateActions]}>
              <ViewKey
                isPKShown={isPKShown}
                toggle={() => {
                  showPK(!isPKShown);
                }}
              />
              <CopyKey wif={privateKey} />
            </View>
          </View>
          <Separator height={5} />
          <Text style={isPKShown ? styles.key : styles.keyHidden}>
            {isPKShown ? privateKey : hidePrivateKey(privateKey)}
          </Text>
        </>
      ) : (
        <View>
          <EllipticButton
            title={translate('settings.keys.add')}
            style={styles.addKey}
            onPress={() => {
              //addKey(account.name, type, key);
              navigation.navigate('ModalScreen', {
                modalContent: <AddKey type={type} name={account.name} />,
              });
            }}
          />
        </View>
      )}
    </View>
  );
};

const RemoveKey = ({forgetKey}) => {
  return (
    <RoundButton
      onPress={forgetKey}
      size={30}
      backgroundColor="#000000"
      content={<Remove />}
    />
  );
};

const CopyKey = ({wif}) => {
  return (
    <RoundButton
      onPress={() => {
        Clipboard.setString(wif);
        Toast.show(translate('toast.keys.copied'));
      }}
      size={30}
      backgroundColor="#7E8C9A"
      content={<Copy />}
    />
  );
};

const ViewKey = ({toggle, isPKShown}) => {
  return (
    <RoundButton
      onPress={toggle}
      size={30}
      backgroundColor={isPKShown ? '#B9122F' : '#7E8C9A'}
      content={<ViewIcon />}
    />
  );
};

const hidePrivateKey = (privateKey) => {
  let hiddenKey = '';
  for (let i = 0; i < privateKey.length; i++) {
    hiddenKey += '\u25cf ';
  }
  return hiddenKey;
};

const styles = StyleSheet.create({
  keyAuthority: {color: '#7E8C9A', fontSize: 20},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyType: {color: '#404950', fontSize: 14},
  key: {color: '#404950', fontSize: 10, lineHeight: 12},
  keyHidden: {color: '#404950', fontSize: 5, lineHeight: 12},
  privateActions: {width: '20%'},
  addKey: {
    backgroundColor: '#7E8C9A',
    marginTop: 20,
    marginBottom: 30,
  },
});