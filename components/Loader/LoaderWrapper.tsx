'use client'

import GlobalLoader from "@/components/Loader/GlobalLoader"
import { useLoading } from "@/context/LoadingContext"

export default function LoaderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useLoading()

  return (
    <>
      {isLoading && <GlobalLoader />}
      {children}
    </>
  )
}
