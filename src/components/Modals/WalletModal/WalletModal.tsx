import { useEffect, useState } from 'react'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'

import { connect, getAccounts } from '../../../helpers/substrate'
import { actions } from '../../../redux/app/actions'
import { useAppDispatch } from '../../../redux/hooks'
import { middleEllipsis } from '../../../utils/string'

import Modal from '../Modal'

import styles from './WalletModal.module.scss'

interface Props {
  isOpen: boolean
}

const WalletModal = ({ isOpen }: Props) => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [error, setError] = useState<string>('')
  const dispatch = useAppDispatch()

  const handleModalClose = () => {
    dispatch(actions.setIsWalletModalOpen(false))
  }

  useEffect(() => {
    let shouldUpdate = true
    const loadAccounts = async () => {
      try {
        const accounts = await getAccounts()
        if (shouldUpdate) setAccounts(accounts)
        dispatch(actions.setIsWalletModalOpen(true))
      } catch (error) {
        console.error(error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(error as string)
        }
      }
    }

    loadAccounts()

    return () => {
      shouldUpdate = false
    }
  }, [dispatch])

  return (
    <Modal handleClose={handleModalClose} isOpen={isOpen}>
      <div className={styles.root}>
        <h4 className={styles.title}>{error !== '' ? 'Something went wrong !' : 'Select your account'}</h4>
        {error !== '' ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <div className={styles.accounts}>
            {accounts.map(({ address, meta }, idx) => (
              <button
                className={styles.account}
                key={address}
                onClick={() => {
                  try {
                    connect(accounts[idx], dispatch)
                    dispatch(actions.setIsWalletModalOpen(false))
                  } catch (error) {
                    console.log(error)
                  }
                }}
              >
                <div className={styles.accountData}>
                  {meta.name && <span className={styles.accountName}>{meta.name}</span>}
                  <span className={styles.accountAddress}>{middleEllipsis(address, 15)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default WalletModal
