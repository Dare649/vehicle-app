import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/redux/slice/auth/authSlice';
import loadingReducer from '@/redux/slice/loadingSlice';
import vehMainLogReducer from '@/redux/slice/vehicle-main-log/vehMainLogSlice';
import vehMainReqReducer from '@/redux/slice/vehicle-main-req-form/vehMainReqSlice';
import vehMoveRegReducer from '@/redux/slice/veh-movement-reg/vehMoveRegSlice';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedVehMainLogReducer = persistReducer(persistConfig, vehMainLogReducer);
const persistedVehMainReqReducer = persistReducer(persistConfig, vehMainReqReducer);
const persistedVehMoveRegReducer = persistReducer(persistConfig, vehMoveRegReducer);

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        auth: persistedAuthReducer,
        vehMainLog: persistedVehMainLogReducer,
        vehMainReq: persistedVehMainReqReducer,
        vehMove: persistedVehMoveRegReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
