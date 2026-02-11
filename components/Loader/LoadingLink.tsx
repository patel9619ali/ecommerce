'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
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
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e)
    }

    // Don't show loader for:
    // - External links
    // - Same page anchors
    // - modifier keys (open in new tab)
    const isExternal = typeof href === 'string' && href.startsWith('http')
    const isSamePageAnchor = typeof href === 'string' && href.startsWith('#')
    const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    
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