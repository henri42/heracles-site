import { AnyAction, Reducer } from 'redux'

const initialState = {
  app: {
    isWalletModalOpen: false,
  },
}

export const appReducer: Reducer<
  {
    app: {
      isWalletModalOpen: boolean
    }
  },
  AnyAction
> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'SET_IS_WALLET_MODAL_OPEN': {
      const { value } = action
      return {
        ...state,
        app: {
          ...state.app,
          isWalletModalOpen: value,
        },
      }
    }
    default:
      return state
  }
}
