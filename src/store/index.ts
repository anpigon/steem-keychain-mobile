import AsyncStorage from '@react-native-community/async-storage';
import reducers from 'reducers/index';
import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['lastAccount', 'settings', 'browser', 'preferences'],
};

const persistedReducers = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducers, composeWithDevTools(applyMiddleware(thunk)));

const persistor = persistStore(store);

export {store, persistor};

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
