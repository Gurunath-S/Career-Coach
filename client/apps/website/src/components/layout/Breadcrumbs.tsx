'use client'

import React from 'react'
import Link from 'next/link'
import { House, CaretRight } from '@phosphor-icons/react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="bg-white border-b border-slate-200/80 text-xs text-slate-600 select-none py-2 px-4 sm:px-6 lg:px-8 font-['Inter']"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 flex-wrap">
        <Link
          href="/"
          className="flex items-center gap-1 text-slate-500 hover:text-[#0056D2] transition-colors"
          title="Home"
        >
          <House size={14} weight="bold" />
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <React.Fragment key={index}>
              <CaretRight size={11} className="text-slate-400 shrink-0" />
              {isLast || !item.href ? (
                <span className="font-semibold text-slate-900 truncate max-w-[240px] sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#0056D2] hover:underline transition-colors truncate max-w-[160px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
