import { AnyAction, Reducer } from 'redux'

import { User } from '../../interfaces'
import { store, USER_POLKADOT_ADDRESS } from '../../helpers/storage'

const initialState = {
  user: {
    isConnected: false,
  },
}

export const userReducer: Reducer<{ user: User }, AnyAction> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'USER_LOGIN': {
      const { value } = action
      store(USER_POLKADOT_ADDRESS, value.address)
      return {
        ...state,
        user: {
          ...state.user,
          isConnectedPolkadot: true,
          polkadotWallet: value,
        },
      }
    }
    case 'USER_LOGOUT': {
      // safeDisconnect()
      // clear(USER_POLKADOT_ADDRESS)
      // return {
      //   ...state,
      //   user: {
      //     ...state.user,
      //     isConnectedPolkadot: false,
      //     polkadotWallet: undefined,
      //   },
      // }
    }
    case 'USER_SET_CAPS_BALANCE': {
      const { value } = action

      if (state.user.wallet === undefined) return state

      return {
        ...state,
        user: {
          ...state.user,
          polkadotWallet: {
            ...state.user.wallet,
            capsBalance: value,
          },
        },
      }
    }
    default:
      return state
  }
}
