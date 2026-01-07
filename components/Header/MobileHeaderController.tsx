"use client"

import { useEffect, useState } from "react"
import MobileBottomHeader from "./MobileBottomHeader"
// import MobileTopHeader from "./MobileTopHeader"

export default function MobileHeaderController() {
  const [showTop, setShowTop] = useState(true)
  const [showBottom, setShowBottom] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY

      if (currentY > lastScrollY && currentY > 80) {
        // scrolling DOWN
        setShowTop(false)
        setShowBottom(true)
      } else {
        // scrolling UP
        setShowTop(true)
        setShowBottom(false)
      }

      setLastScrollY(currentY)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [lastScrollY])

  return (
    <>
      {/* <MobileTopHeader visible={showTop} /> */}
      <MobileBottomHeader visible={showBottom} />
    </>
  )
}
