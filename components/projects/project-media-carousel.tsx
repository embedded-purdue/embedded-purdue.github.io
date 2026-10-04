"use client"

import Image from "next/image"
import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

type ProjectMediaCarouselProps = {
  title: string
  slug: string
  status?: string
  images: string[]
}

export function ProjectMediaCarousel({ title, slug, status, images }: ProjectMediaCarouselProps) {
  const cleanImages = images.filter(Boolean)
  const [index, setIndex] = useState(0)
  const total = cleanImages.length
  const active = cleanImages[index] || cleanImages[0]

  function move(direction: -1 | 1) {
    if (!total) return
    setIndex((current) => (current + direction + total) % total)
  }

  if (!active) {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(rgba(218,160,0,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(218,160,0,.045)_1px,transparent_1px)] bg-[size:36px_36px]">
        <div className="absolute left-[12%] top-[22%] h-px w-[58%] bg-[#8b6a13]/55" />
        <div className="absolute left-[31%] top-[22%] h-[46%] w-px bg-[#8b6a13]/40" />
        <div className="absolute bottom-[31%] left-[31%] h-px w-[51%] bg-[#8b6a13]/45" />
        <span className="absolute bottom-[30%] left-[80%] h-2 w-2 -translate-y-[3px] rounded-full border border-[#c79821]/65" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      {active.startsWith("/") ? (
        <Image
          src={active}
          alt={`${title} project image ${index + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover opacity-[0.84]"
          priority={index === 0}
        />
      ) : (
        <img src={active} alt={`${title} project image ${index + 1}`} className="h-full w-full object-cover opacity-[0.84]" decoding="async" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-transparent to-black/22" />
      <div className="absolute left-0 top-0 border-b border-r border-white/[0.09] bg-black/84 px-4 py-3">
        <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-[#afaca5]">System / {status ?? "documented"}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.1] bg-black/86 px-5 py-4 sm:px-7">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[0.49rem] uppercase tracking-[0.15em] text-[#9e9a95]">Project surface</p>
            <p className="mt-1 max-w-sm text-lg font-medium tracking-[-0.035em] text-[#dfd9cf]">
              {total > 1 ? `${index + 1} / ${total} field image sequence` : "Build notes, artifacts, and the system behind the result."}
            </p>
          </div>
          <span className="font-mono text-[0.49rem] uppercase tracking-[0.14em] text-[#8d7328]">SYS / {slug.slice(0, 3)}</span>
        </div>
        {total > 1 && (
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-3">
            <div className="flex gap-1.5">
              {cleanImages.map((image, imageIndex) => (
                <button
                  key={`${image}-${imageIndex}`}
                  type="button"
                  aria-label={`Show image ${imageIndex + 1}`}
                  aria-current={imageIndex === index}
                  onClick={() => setIndex(imageIndex)}
                  className={`h-1.5 w-7 transition-colors ${imageIndex === index ? "bg-[#daa000]" : "bg-white/20 hover:bg-white/40"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous project image"
                onClick={() => move(-1)}
                className="grid h-9 w-9 place-items-center border border-white/15 text-[#d8d2c7] transition hover:border-[#daa000]/60 hover:text-[#f2c34f]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next project image"
                onClick={() => move(1)}
                className="grid h-9 w-9 place-items-center border border-white/15 text-[#d8d2c7] transition hover:border-[#daa000]/60 hover:text-[#f2c34f]"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
