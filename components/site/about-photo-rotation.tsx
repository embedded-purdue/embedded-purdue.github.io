"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import photos from "./about-community-photos.json"

const controlClass = "grid size-11 place-items-center text-[#f3efe6] transition-colors hover:text-[#f4c64d] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#f4c64d]"

function wrap(index: number) {
  return (index + photos.length) % photos.length
}

export function AboutPhotoRotation() {
  const gallery = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [inView, setInView] = useState(false)
  const nearby = [wrap(index - 1), index, wrap(index + 1)]

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    function applyPreference() {
      setPlaying(!preference.matches)
    }
    applyPreference()
    preference.addEventListener("change", applyPreference)
    return () => preference.removeEventListener("change", applyPreference)
  }, [])

  useEffect(() => {
    const element = gallery.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!playing || hovered || !inView) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => wrap(current + 1))
    }, 6000)
    return () => window.clearInterval(timer)
  }, [playing, hovered, inView])

  function move(direction: -1 | 1) {
    setPlaying(false)
    setIndex((current) => wrap(current + direction))
  }

  return (
    <figure
      ref={gallery}
      aria-label="Life at Embedded Systems at Purdue"
      className="overflow-hidden bg-[#17130f]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible") && !event.currentTarget.contains(event.relatedTarget)) setPlaying(false)
      }}
    >
      <div className="relative aspect-[3/2] max-h-[760px]">
        {nearby.map((photoIndex) => {
          const photo = photos[photoIndex]
          const current = photoIndex === index
          return (
            <Image
              key={photo.file}
              src={`/site-media/about-community/${photo.file}`}
              alt={photo.alt ?? photo.caption}
              aria-hidden={!current}
              fill
              sizes="(max-width: 1023px) 100vw, calc(100vw - 48px)"
              className={`object-contain transition-opacity duration-700 motion-reduce:transition-none ${current ? "opacity-100" : "opacity-0"}`}
            />
          )
        })}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-[#e1b575]/25 bg-[#211910] py-2 pl-5 pr-2 sm:pl-7">
        <figcaption aria-live={playing ? "off" : "polite"} className="text-sm leading-5 text-[#f3e4ce]">
          {photos[index].caption}
          <span className="ml-2 whitespace-nowrap text-xs tabular-nums text-[#c5af94]">
            {index + 1} / {photos.length}
          </span>
        </figcaption>
        <div className="flex shrink-0 items-center">
          <button type="button" className={controlClass} aria-label="Previous photo" onClick={() => move(-1)}>
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={controlClass} aria-label={playing ? "Pause photo rotation" : "Play photo rotation"} onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          </button>
          <button type="button" className={controlClass} aria-label="Next photo" onClick={() => move(1)}>
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </figure>
  )
}
