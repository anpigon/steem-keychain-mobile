import AsyncStorage from '@react-native-async-storage/async-storage';
import reducers from 'reducers/index';
import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'remote-redux-devtools';
import transforms from './transforms';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'lastAccount',
    'settings',
    'browser',
    'preferences',
    'hive_authentication_service',
  ],
  transforms,
};
const persistConfig2 = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['lastAccount', 'settings', 'browser', 'preferences'],
};

const persistedReducers = persistReducer(persistConfig, reducers);
const store = createStore(
  persistedReducers,
  composeWithDevTools(applyMiddleware(thunk)),
);
const persistor = persistStore(store);

export {store, persistor};

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
