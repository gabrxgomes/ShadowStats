import { Helius } from 'helius-sdk'

let heliusInstance: Helius | null = null

export function getHelius(): Helius {
  if (heliusInstance) {
    return heliusInstance
  }

  const apiKey = process.env.HELIUS_API_KEY

  if (!apiKey) {
    throw new Error('HELIUS_API_KEY environment variable is required')
  }

  heliusInstance = new Helius(apiKey)

  return heliusInstance
}

export const helius = {
  get client() {
    return getHelius()
  },
}
