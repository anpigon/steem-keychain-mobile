import {
  Account,
  ActionPayload,
  BrowserPayload,
  History,
  KeyTypes,
  Tab,
  TabFields,
} from 'actions/interfaces';
import {BrowserNavigation} from 'navigators/MainDrawer.types';
import React, {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {BackHandler, Platform, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {useFocusEffect} from '@react-navigation/native';
import {
  WebViewMessageEvent,
  WebViewNativeEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {UserPreference} from 'reducers/preferences.types';
import {urlTransformer} from 'utils/browser';
import {BrowserConfig} from 'utils/config';
import {
  getRequiredWifType,
  sendError,
  sendResponse,
  validateAuthority,
  validateRequest,
} from 'utils/keychain';
import {RequestError, RequestSuccess} from 'utils/keychain.types';
import {goBack as navigationGoBack, navigate} from 'utils/navigation';
import {hasPreference} from 'utils/preferences';
import {requestWithoutConfirmation} from 'utils/requestWithoutConfirmation';
import {steem_keychain} from './bridges/SteemKeychainBridge';
import {BRIDGE_WV_INFO} from './bridges/WebviewInfo';
import Footer from './Footer';
import NotFound from './NotFound';
import ProgressBar from './ProgressBar';
import RequestModalContent from './RequestModalContent';
import UrlModal from './urlModal';

type Props = {
  data: Tab;
  active: boolean;
  manageTabs: (tab: Tab, webview: MutableRefObject<WebView>) => void;
  isManagingTab: boolean;
  accounts: Account[];
  updateTab: (id: number, data: TabFields) => ActionPayload<BrowserPayload>;
  addToHistory: (history: History) => ActionPayload<BrowserPayload>;
  history: History[];
  clearHistory: () => ActionPayload<BrowserPayload>;
  navigation: BrowserNavigation;
  preferences: UserPreference[];
};
export default ({
  data: {url, id, icon},
  active,
  updateTab,
  accounts,
  navigation,
  addToHistory,
  clearHistory,
  history,
  manageTabs,
  isManagingTab,
  preferences,
}: Props) => {
  const tabRef = useRef<WebView>(null);
  const [searchUrl, setSearchUrl] = useState(url);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, toggleVisibility] = useState(false);
  const insets = useSafeAreaInsets();
  const FOOTER_HEIGHT = BrowserConfig.FOOTER_HEIGHT + insets.bottom;

  const onAndroidBackPress = () => {
    if (tabRef.current && canGoBack) {
      goBack();
      return true;
    }
    return false;
  };

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      }
      return () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener(
            'hardwareBackPress',
            onAndroidBackPress,
          );
        }
      };
    }, [canGoBack]),
  );

  useEffect(() => {
    setSearchUrl(url);
  }, [url]);

  const goBack = () => {
    if (!canGoBack) {
      return;
    }
    const {current} = tabRef;
    current && current.goBack();
  };

  const goForward = () => {
    if (!canGoForward) {
      return;
    }
    const {current} = tabRef;
    current && current.goForward();
  };

  const reload = () => {
    const {current} = tabRef;
    current && current.reload();
  };

  const goHome = () => {
    updateTab(id, {url: BrowserConfig.HOMEPAGE_URL});
  };

  const onLoadStart = ({
    nativeEvent: {url},
  }: {
    nativeEvent: WebViewNativeEvent;
  }) => {
    updateTab(id, {url});
  };

  const onLoadProgress = ({nativeEvent: {progress}}: WebViewProgressEvent) => {
    setProgress(progress === 1 ? 0 : progress);
  };

  const onLoadEnd = ({
    nativeEvent: {canGoBack, canGoForward, loading},
  }: WebViewNavigationEvent) => {
    const {current} = tabRef;
    setProgress(0);
    if (loading) {
      return;
    }
    if (current) {
      current.injectJavaScript(BRIDGE_WV_INFO);
    }
  };

  const onNavigationStateChange = (event: WebViewNavigation) => {
    setCanGoBack(event.canGoBack);
    setCanGoForward(event.canGoForward);
  };

  const onNewSearch = (url: string) => {
    const {current} = tabRef;
    if (current) {
      current.stopLoading();
      current.injectJavaScript(
        `(function(){window.location.href = '${url}' })()`,
      );
    }
  };

  const onMessage = ({nativeEvent}: WebViewMessageEvent) => {
    const {name, request_id, data} = JSON.parse(nativeEvent.data);
    const {current} = tabRef;
    switch (name) {
      case 'swHandshake_steem':
        current.injectJavaScript(
          'window.steem_keychain.onAnswerReceived("steem_keychain_handshake")',
        );
        break;
      case 'swRequest_steem':
        if (validateRequest(data)) {
          if (validateAuthority(accounts, data)) {
            showOperationRequestModal(request_id, data);
          } else {
            sendError(tabRef, {
              error: 'user_cancel',
              message: 'Request was canceled by the user.',
              data,
              request_id,
            });
          }
        } else {
          sendError(tabRef, {
            error: 'incomplete',
            message: 'Incomplete data or wrong format',
            data,
            request_id,
          });
        }
        break;
      case 'WV_INFO':
        const {icon, name, url} = data as TabFields;
        if ('about:blank' === url || url.startsWith('chrome-error://')) return;
        navigation.setParams({icon});
        if (name && url && url !== 'chromewebdata') {
          addToHistory({icon, name, url});
        }
        updateTab(id, {url, name, icon});
        break;
    }
  };

  function skipConfirmation(data: any) {
    if (
      data.type === 'signBuffer' &&
      data.message?.includes('"type":"Buffer"')
    ) {
      // image type
      return true;
    }
    return false;
  }

  const showOperationRequestModal = (request_id: number, data: any) => {
    const {username, domain, type} = data;
    if (data.hasOwnProperty('operations')) {
      for (let op of data.operations) {
        // fix bug: I don't know why this happens.
        delete op[1]['__config'];
      }
    }
    if (
      getRequiredWifType(data) !== KeyTypes.active &&
      (hasPreference(
        preferences,
        username,
        urlTransformer(domain).hostname,
        type,
      ) ||
        skipConfirmation(data)) && // image type
      username
    ) {
      requestWithoutConfirmation(
        accounts,
        {...data, request_id},
        (obj: RequestSuccess) => {
          sendResponse(tabRef, obj);
        },
        (obj: RequestError) => {
          sendError(tabRef, obj);
        },
      );
    } else {
      const onForceCloseModal = () => {
        navigationGoBack();
        sendError(tabRef, {
          error: 'user_cancel',
          message: 'Request was canceled by the user.',
          data,
          request_id,
        });
      };
      navigate('ModalScreen', {
        name: `Operation_${data.type}`,
        modalContent: (
          <RequestModalContent
            request={{...data, request_id}}
            accounts={accounts}
            onForceCloseModal={onForceCloseModal}
            sendError={(obj: RequestError) => {
              sendError(tabRef, obj);
            }}
            sendResponse={(obj: RequestSuccess) => {
              sendResponse(tabRef, obj);
            }}
          />
        ),
        onForceCloseModal,
      });
    }
  };
  return (
    <View
      style={[styles.container, !active || isManagingTab ? styles.hide : null]}>
      <View style={styles.container}>
        <ProgressBar progress={progress} />

        <WebView
          ref={tabRef}
          source={{uri: url}}
          sharedCookiesEnabled
          injectedJavaScriptForMainFrameOnly
          injectedJavaScript={steem_keychain}
          onMessage={onMessage}
          bounces={false}
          javaScriptEnabled
          cacheEnabled
          allowsInlineMediaPlayback
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          onLoadProgress={onLoadProgress}
          onNavigationStateChange={onNavigationStateChange}
          renderError={(errorDomain, errorCode, errorDesc) => (
            <NotFound
              errorDomain={errorDomain || url}
              errorCode={errorCode}
              errorDesc={errorDesc}
            />
          )}
        />
      </View>
      {active && (
        <Footer
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          goBack={goBack}
          goForward={goForward}
          reload={reload}
          manageTabs={() => {
            manageTabs({url, id, icon}, tabRef);
          }}
          height={FOOTER_HEIGHT}
          toggleSearchBar={() => {
            setSearchUrl(url);
            toggleVisibility(true);
          }}
          goHome={goHome}
        />
      )}
      {active && (
        <UrlModal
          isVisible={isVisible}
          toggle={toggleVisibility}
          onNewSearch={onNewSearch}
          history={history}
          url={searchUrl}
          setUrl={setSearchUrl}
          clearHistory={clearHistory}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  hide: {flex: 0, opacity: 0, display: 'none', width: 0, height: 0},
});
