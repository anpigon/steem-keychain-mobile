import {Tab} from 'actions/interfaces';
import React, {MutableRefObject} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Image from 'react-native-fast-image';
import TabsManagementBottomBar from './BottomBar';

//TODO: put in config
const margin = Dimensions.get('window').width * 0.02;
const THUMB_WIDTH = Dimensions.get('window').width * 0.46;
const THUMB_HEIGHT = THUMB_WIDTH * 1.3;

type Props = {
  tabs: Tab[];
  onSelectTab: (id: number) => void;
  onCloseTab: (id: number) => void;
  onCloseAllTabs: () => void;
  onQuitManagement: () => void;
  onAddTab: (
    isManagingTab: boolean,
    tab: Tab,
    webview: MutableRefObject<View>,
  ) => void;
  activeTab: number;
  show: boolean;
};
export default ({
  tabs,
  onSelectTab,
  onCloseTab,
  onCloseAllTabs,
  onAddTab,
  onQuitManagement,
  activeTab,
  show,
}: Props) => {
  return (
    <View style={[styles.container, show ? null : styles.hide]}>
      <ScrollView>
        <Text style={styles.tip}>
          Switch between tabs by swiping left or right on the url bar.
        </Text>
        <View style={styles.subcontainer}>
          {tabs.map(({icon, image, name, id}) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.tabWrapper,
                id === activeTab ? styles.activeTab : null,
              ]}
              onPress={() => {
                onSelectTab(id);
              }}>
              <View style={styles.titleContainer}>
                <View style={styles.nameContainer}>
                  <Image style={styles.icon} source={{uri: icon}} />
                  <Text style={styles.name} numberOfLines={1}>
                    {name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeView}
                  onPress={() => {
                    onCloseTab(id);
                  }}>
                  <Text style={styles.close}>X</Text>
                </TouchableOpacity>
              </View>
              <Image style={styles.screenshot} source={{uri: image}} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TabsManagementBottomBar
        onCloseAllTabs={onCloseAllTabs}
        onAddTab={() => {
          onAddTab(true, null, null);
        }}
        onQuitManagement={onQuitManagement}
        showSideButtons={!!activeTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tip: {
    color: '#000',
    fontSize: 14,
    fontStyle: 'italic',
    margin: 10,
    textAlign: 'justify',
  },
  container: {flex: 1, backgroundColor: 'white'},
  subcontainer: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},
  hide: {display: 'none'},
  tabWrapper: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    margin,
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: 'darkgrey',
    borderWidth: 3,
  },
  titleContainer: {
    height: 40,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  activeTab: {
    borderColor: '#4CA2F0',
  },
  nameContainer: {flexDirection: 'row', maxWidth: '80%', alignItems: 'center'},
  screenshot: {
    flex: 1,
    resizeMode: 'cover',
  },
  icon: {width: 16, height: 16},
  name: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  close: {color: 'white', fontWeight: 'bold', fontSize: 18},
  closeView: {
    minWidth: 30,
    height: '100%',
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
