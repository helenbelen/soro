import { configureStore } from '@reduxjs/toolkit'
import socketReducer from './slices/socketSlice'

const store = configureStore({
    reducer: {
        socketSlice: socketReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
})

export default store