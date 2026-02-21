'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLoading } from "@/context/LoadingContext"
import { ComponentProps, MouseEvent } from "react"

type LoadingLinkProps = ComponentProps<typeof Link> & {
  showLoader?: boolean
}

export default function LoadingLink({ 
  href, 
  onClick, 
  showLoader = true,
  children, 
  ...props 
}: LoadingLinkProps) {
  const { setLoading } = useLoading()
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const isExternal = typeof href === 'string' && href.startsWith('http')
    const isSamePageAnchor = typeof href === 'string' && href.startsWith('#')
    const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    const hrefString = typeof href === 'string' ? href : href?.pathname ?? ''
    const isSamePage = hrefString === pathname

    if (isSamePage) {
      // ✅ Prevent navigation entirely when already on this page
      // This stops the sheet close/reopen flicker
      e.preventDefault()
      // Still call onClick (so sheet closes if needed)
      if (onClick) onClick(e)
      return
    }

    // Call custom onClick for actual navigation
    if (onClick) {
      onClick(e)
    }

    if (showLoader && !isExternal && !isSamePageAnchor && !isModifiedClick) {
      setLoading(true)
    }
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}