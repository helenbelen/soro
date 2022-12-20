import { createSlice } from '@reduxjs/toolkit'

export const socketSlice = createSlice({
    name: 'socketSlice',
    initialState: {
        username: null,
        sessionId: null,
        rooms: [],
        errors: [],
    },
    reducers: {
        addUsername: (state, action) => {
            return {
                ...state,
                username: action.payload
            }
        },
        addSessionId : (state, action) => {
            return {
                ...state,
                sessionId: action.payload
            }
        },
        addRooms: (state, action) => {
            return {
                ...state,
                rooms: action.payload
            }
        },
        addError: (state, action) => {
            state.Errors = [...state.Errors, action.payload]
        },
        clearRooms: (state, action) => {
            return {
                ...state,
                rooms: [],
            }
        },
        clearErrors: (state, action) => {
            return {
                ...state,
                errors: [],
            }
        },
        clearUserDetails: (state, action) => {
            return {
                ...state,
                username: null,
                sessionId: null
            }
        }
    },
})

export const {
    addUsername,
    addSessionId,
    addRooms,
    addError,
    clearRooms,
    clearErrors,
    clearUserDetails
} = socketSlice.actions

export default socketSlice.reducer