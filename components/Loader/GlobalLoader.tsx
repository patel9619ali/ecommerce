'use client'

import { SpinnerCustom } from "./SpinningLoader"

export default function GlobalLoader() {
  return (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="relative">
      <SpinnerCustom />
    </div>
  </div>
  )
}
