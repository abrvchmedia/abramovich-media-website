import { getPayload as getPayloadInstance } from 'payload'
import config from '../../payload.config'

let cached = (global as any).__payload

if (!cached) cached = (global as any).__payload = { client: null as any, promise: null as Promise<any> | null }

export async function getPayload() {
  if (cached.client) return cached.client
  if (!cached.promise) cached.promise = getPayloadInstance({ config })
  cached.client = await cached.promise
  return cached.client
}

import { getPayload as getPayloadInstance } from 'payload'
import config from '../../payload.config'

let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
}

export const getPayload = async () => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayloadInstance({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}

