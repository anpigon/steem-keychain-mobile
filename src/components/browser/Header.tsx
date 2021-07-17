import DrawerButton from 'components/ui/DrawerButton';
import {BrowserNavigationProps} from 'navigators/MainDrawer.types';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {urlTransformer} from 'utils/browser';
import {BrowserConfig} from 'utils/config';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & BrowserNavigationProps;
const BrowserHeader = ({
  browser: {activeTab, tabs},
  navigation,
  route,
}: Props) => {
  const {HEADER_HEIGHT} = BrowserConfig;
  const insets = useSafeAreaInsets();
  const styles = getStyles(HEADER_HEIGHT, insets);

  const renderText = () => {
    if (activeTab && tabs.find((e) => e.id === activeTab)) {
      const currentActiveTab = tabs.find((e) => e.id === activeTab);
      const activeUrl = currentActiveTab.url;
      if (activeUrl === BrowserConfig.HOMEPAGE_URL) {
        return <Text style={styles.url}>{currentActiveTab.name}</Text>;
      }
      return (
        <Text style={styles.url}>{urlTransformer(activeUrl).hostname}</Text>
      );
    } else {
      return (
        <Text style={styles.browser}>{translate('navigation.browser')}</Text>
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {route.params && route.params.icon && (
          <View style={styles.iconContainer}>
            <Image
              resizeMode="contain"
              style={styles.icon}
              source={{uri: route.params.icon}}
            />
          </View>
        )}
        {renderText()}
      </View>
      <DrawerButton navigation={navigation} />
    </View>
  );
};

const getStyles = (height: number, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      height: height + insets.top,
      backgroundColor: 'black',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: insets.top,
      paddingLeft: 20,
    },
    textContainer: {width: '60%', flexDirection: 'row'},
    url: {color: 'white', fontSize: 18},
    browser: {color: 'white', fontSize: 18, fontWeight: 'bold'},
    iconContainer: {
      justifyContent: 'center',
    },
    icon: {
      width: 20,
      height: 20,
      marginRight: 20,
    },
  });

const mapStateToProps = (state: RootState) => ({browser: state.browser});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(BrowserHeader);
