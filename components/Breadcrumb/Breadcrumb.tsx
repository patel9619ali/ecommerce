import Link from "next/link"
import { BreadcrumbType } from "@/types/breadcrumbType"
import LoadingLink from "../Loader/LoadingLink"

type BreadcrumbProps = {
  items: BreadcrumbType[]
  className?: string
}

export function BreadcrumbWithCustomSeparator({
  items,
  className = "",
}: BreadcrumbProps) {
  if (!items?.length) return null

  return (
    <nav aria-label="Breadcrumb" className={`${className} mb-6`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <LoadingLink
                  href={item.href}
                  className="font-[600] text-[16px] leading-[24px] uppercase text-[#053E54] flex items-center gap-2"
                >
                  {index === 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="9"
                      height="15"
                      viewBox="0 0 9 15"
                      fill="none"
                    >
                      <path
                        d="M8 14L1 7.5L8 1"
                        stroke="#053E54"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {item.label}
                </LoadingLink>
              ) : (
                <span
                  className="font-[600] text-[16px] leading-[24px] uppercase text-[#053E54]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="6"
                    height="14"
                    viewBox="0 0 6 14"
                    fill="none"
                  >
                    <path
                      d="M0.75 12.75L4.75 0.75"
                      stroke="#C9C9C9"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
