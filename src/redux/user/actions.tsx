import { Wallet } from '../../interfaces'

export const actions = {
  login: (value: Wallet) => ({
    type: 'USER_LOGIN',
    value: value,
  }),
  logout: () => ({
    type: 'USER_LOGOUT',
  }),
  setCapsBalance: (value: number) => ({
    type: 'USER_SET_CAPS_BALANCE',
    value: value,
  }),
}
