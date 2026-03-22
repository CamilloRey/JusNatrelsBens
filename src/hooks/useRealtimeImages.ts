/**
 * Realtime Images Hook
 * Subscribe to live image and photo updates via Supabase Realtime
 */

import { useEffect, useCallback, useRef } from 'react'
import { subscribeToImageUpdates, subscribeToOwnerPhotoUpdates } from '@/lib/images'
import type { ImageRealtimeEvent, OwnerPhotoRealtimeEvent } from '@/shared/types/images'

interface UseRealtimeImagesOptions {
  productId?: string
  enabled?: boolean
}

/**
 * Subscribe to product image updates in realtime
 */
export const useRealtimeProductImages = (
  productId: string,
  onUpdate?: (event: ImageRealtimeEvent) => void,
  options: UseRealtimeImagesOptions = {}
) => {
  const { enabled = true } = options
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!enabled) return

    const subscription = subscribeToImageUpdates(productId, (event) => {
      console.log('Product image update:', event)
      onUpdate?.(event)
    })

    subscriptionRef.current = subscription

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [productId, enabled, onUpdate])

  const unsubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }
  }, [])

  return { unsubscribe }
}

/**
 * Subscribe to owner photo gallery updates in realtime
 */
export const useRealtimeOwnerPhotos = (
  onUpdate?: (event: OwnerPhotoRealtimeEvent) => void,
  enabled = true
) => {
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!enabled) return

    const subscription = subscribeToOwnerPhotoUpdates((event) => {
      console.log('Owner photo update:', event)
      onUpdate?.(event)
    })

    subscriptionRef.current = subscription

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [enabled, onUpdate])

  const unsubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }
  }, [])

  return { unsubscribe }
}
