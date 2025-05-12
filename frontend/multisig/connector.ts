import { babylon } from "~/config/chains/babylon";
import { type Connector, ProviderNotFoundError, createConnector } from 'wagmi'
import { createMultisigClient } from "./client/client";
import { MultisigProvider } from './provider';
import {
    type Address,
    type Prettify,
    ResourceUnavailableRpcError,
    type RpcError,
    UserRejectedRequestError,
  } from 'viem'
import { Chain } from "cosmi/types";


  type Target = {
    icon?: string | undefined
    id: string
    name: string
    provider: () => MultisigProvider | undefined
  }

  export type InjectedParameters = {
    /**
     * Some injected providers do not support programmatic disconnect.
     * This flag simulates the disconnect behavior by keeping track of connection status in storage.
     * @default false
     */
    shimDisconnect?: boolean | undefined
  
    target?: Target | (() => Target)
  }


export function multisig(parameters: InjectedParameters = {}) {
    const { shimDisconnect = true } = parameters
  
    const providerInstance = new MultisigProvider();
  
    function getTarget(): Prettify<Target & { id: string }> {
      const target = parameters.target
      if (typeof target === 'function') {
        const result = target()
        if (result) return result
      }
  
      if (typeof target === 'object') return target
  
      return {
        id: 'multisig',
        name: 'Multisig',
        icon: '/favicon.png',
        provider() {
          return providerInstance;
        },
      }
    }
  
    type Provider = MultisigProvider | undefined
  
    type Properties = {}
  
    type StorageItem = {
      [_ in 'injected.connected' | `${string}.disconnected`]: true
    } & { 'injected.chainId': string }
  
    let accountsChanged: Connector['onAccountsChanged'] | undefined
  
    return createConnector<Provider | undefined, Properties, StorageItem>(
      (config: any) => ({
        get icon() {
          const iconPath = getTarget().icon;
          return iconPath;
        },
        get id() {
          return getTarget().id
        },
        get name() {
          return getTarget().name
        },
        type: getTarget().name,
        async connect({ chainId: chain, isReconnecting } = {}) {
          const provider = await this.getProvider()
          if (!provider) throw new ProviderNotFoundError()
  
          const chainId = chain ?? (await this.getChainId())
          let accounts: readonly Address[] = []
          if (isReconnecting) accounts = await this.getAccounts().catch(() => [])
          if (!isReconnecting)
            config.storage?.setItem('injected.chainId', chainId.toString())
  
          try {
            if (!accounts?.length && !isReconnecting) {
              await provider
                .enable(chainId.toString())
                .catch(async (err: Error) => {
                  const chainInfo = config.chains.find(
                    (chain: { id: number; }) => chain.id === chainId,
                  ) as Chain
                  if (err.message === 'Invalid chain id') {
                    const registry = chainInfo.custom?.registry
                    if (!registry)
                      throw new Error(
                        'Chain registry is required to suggest chain',
                      )
                    const { assets, chain } = registry
  
                    const [chainRes, assetsRes] = await Promise.all([
                      fetch(chain),
                      fetch(assets),
                    ])
                  } else throw err
                })
            }
  
            // Remove disconnected shim if it exists
            if (shimDisconnect)
              await config.storage?.removeItem(`${this.id}.disconnected`)
  
            // Add connected shim if no target exists
            if (!parameters.target)
              await config.storage?.setItem('injected.connected', true)
  
            this.onConnect?.({ chainId: chainId.toString() })
            return { accounts, chainId }
          } catch (err) {
            const error = err as RpcError
            if (error.code === UserRejectedRequestError.code)
              throw new UserRejectedRequestError(error)
            if (error.code === ResourceUnavailableRpcError.code)
              throw new ResourceUnavailableRpcError(error)
            throw error
          }
        },
        async disconnect() {
          // Add shim signalling connector is disconnected
          if (shimDisconnect) {
            await config.storage?.setItem(`${this.id}.disconnected`, true)
          }
  
          if (!parameters.target)
            await config.storage?.removeItem('injected.connected')
          
          // Clean up provider state
          const provider = await this.getProvider()
          if (provider) {
            provider.cleanup()
          }
  
          this.onDisconnect()
        },
        async getAccounts() {
          const provider = (await this.getProvider()) as Provider
          if (!provider) throw new ProviderNotFoundError()
          const chainId = await config.storage?.getItem('injected.chainId')
          if (!chainId) throw new Error('Chain ID is required to get accounts')
          const signer = provider.getOfflineSignerOnlyAmino(chainId)
          const accounts = await signer.getAccounts()
          return accounts.map((account) => account.address) as readonly Address[]
        },
  
        async getProvider() {
          let provider: Provider
          const target = getTarget()
          if (typeof target.provider === 'function')
            provider = target.provider() 
          else provider = target.provider
  
          return provider
        },
        async getClient(params: any) {
          const chainId = params?.chainId ?? (await this.getChainId())
          return createMultisigClient({
            account: {
              address: '0x000',
              type: 'json-rpc',
              getSigner: async (chainId: string) => {
                const provider = await this.getProvider()
                if (!provider) throw new ProviderNotFoundError()
                return await provider.getOfflineSignerOnlyAmino(chainId)
              },
            },
            transport: config.transports![chainId],
            chain: config.chains.find((chain: any) => chain.id === chainId),
          })
        },
        async isAuthorized() {
          try {
            const isDisconnected =
              shimDisconnect &&
              // If shim exists in storage, connector is disconnected
              (await config.storage?.getItem(`${this.id}.disconnected`))
            if (isDisconnected) return false
  
            // Don't allow injected connector to connect if no target is set and it hasn't already connected
            // (e.g. flag in storage is not set). This prevents a targetless injected connector from connecting
            // automatically whenever there is a targeted connector configured.
            if (!parameters.target) {
              const connected =
                await config.storage?.getItem('injected.connected')
              if (!connected) return false
            }
  
            const accounts = await this.getAccounts()
            return !!accounts.length
          } catch {
            await config.storage?.setItem(`${this.id}.disconnected`, true)
            return false
          }
        },
        async onAccountsChanged(_accounts: any) {
          // Disconnect if there are no accounts
          const accounts = await this.getAccounts()
          if (accounts.length === 0) this.onDisconnect()
          // Connect if emitter is listening for connect event (e.g. is disconnected and connects through wallet interface)
          else if (config.emitter.listenerCount('connect')) {
            const chainId = await this.getChainId()
            this.onConnect?.({ chainId: chainId.toString() })
            // Remove disconnected shim if it exists
            if (shimDisconnect)
              await config.storage?.removeItem(`${this.id}.disconnected`)
          }
          // Regular change event
          else config.emitter.emit('change', { accounts })
        },
        onChainChanged(chain: any) {
          const chainId = Number(chain)
          config.emitter.emit('change', { chainId })
        },
        async onConnect({ chainId }: { chainId: any }) {
          const accounts = await this.getAccounts()
          if (accounts.length === 0) return
  
          config.emitter.emit('connect', {
            accounts,
            chainId: chainId as unknown as number,
          })
        },
        async getChainId() {
          return (await config.storage?.getItem(
            'injected.chainId',
          )) as unknown as number
        },
        async onDisconnect() {
          // No need to remove `${this.id}.disconnected` from storage because `onDisconnect` is typically
          // only called when the wallet is disconnected through the wallet's interface, meaning the wallet
          // actually disconnected and we don't need to simulate it.
          config.emitter.emit('disconnect')
        },
      }),
    )
}