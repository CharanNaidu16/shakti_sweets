'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({ text, label = 'Copy address' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Older browsers: fall back to a hidden textarea.
      const area = document.createElement('textarea')
      area.value = text
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.append(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="link-draw inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-saffron-deep"
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      <span>{copied ? 'Copied' : label}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Address copied to clipboard' : ''}
      </span>
    </button>
  )
}
