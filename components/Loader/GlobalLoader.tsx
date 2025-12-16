'use client'

import { SpinnerCustom } from "./SpinningLoader"

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <SpinnerCustom />
    </div>
  )
}
