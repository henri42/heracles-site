import type { InjectedExtension } from '@polkadot/extension-inject/types'

export interface Wallet {
  address: string
  injector: InjectedExtension
  capsBalance: number
}

export interface User {
  isConnected: boolean
  wallet?: Wallet
}