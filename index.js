import 'react-native-gesture-handler';
import './global';
import React, {useState, useEffect} from 'react';
import {AppRegistry, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from 'src/App';
import Loading from 'screens/Loading';
import {name as appName} from './app.json';
import {store, persistor} from 'store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import codePush from 'react-native-code-push';

const Root = () => {
  const [gateLifted, setGateLifted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setGateLifted(true);
    }, 1000);
  });

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar backgroundColor="black" />
        <PersistGate loading={<Loading />} persistor={persistor}>
          {gateLifted ? <App /> : <Loading />}
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
};

AppRegistry.registerComponent(appName, () => codePush(codePushOptions)(Root));
