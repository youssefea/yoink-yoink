import { createWalletClient, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { degen, polygonMumbai, optimismSepolia } from 'viem/chains'

export const walletClient = createWalletClient({
  chain: degen,
  transport:  http(process.env.RPC_URL)
})

export const publicClient = createPublicClient({
  chain: degen,
  transport: http(process.env.RPC_URL)
})

export const account = privateKeyToAccount(`0x${process.env.WK}`)