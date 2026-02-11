'use client'

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useLoading } from "@/context/LoadingContext"
import GlobalLoader from "./GlobalLoader"

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, setLoading } = useLoading()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Navigation finished - hide loader
    setLoading(false)
  }, [pathname, searchParams, setLoading])

  return (
    <>
      {isLoading && <GlobalLoader />}
      {children}
    </>
  )
}