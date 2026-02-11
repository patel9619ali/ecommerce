'use client'

import { useRouter } from "next/navigation"
import { useLoading } from "@/context/LoadingContext"
import { useCallback } from "react"

export function useLoadingRouter() {
  const router = useRouter()
  const { setLoading } = useLoading()

  const push = useCallback((href: string, options?: any) => {
    setLoading(true)
    router.push(href, options)
  }, [router, setLoading])

  const replace = useCallback((href: string, options?: any) => {
    setLoading(true)
    router.replace(href, options)
  }, [router, setLoading])

  const back = useCallback(() => {
    setLoading(true)
    router.back()
  }, [router, setLoading])

  const forward = useCallback(() => {
    setLoading(true)
    router.forward()
  }, [router, setLoading])

  return {
    push,
    replace,
    back,
    forward,
    refresh: router.refresh,
    prefetch: router.prefetch,
  }
}