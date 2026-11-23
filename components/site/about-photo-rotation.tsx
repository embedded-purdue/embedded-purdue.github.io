"use client"

import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import photos from "./about-community-photos.json"

const controlClass = "grid size-11 place-items-center text-[#f3efe6] transition-colors hover:text-[#f4c64d] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#f4c64d]"
const photoControlClass = "w-1/2 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#f4c64d]"

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
      className="mx-auto w-full max-w-[720px] overflow-hidden bg-[#17130f]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible") && !event.currentTarget.contains(event.relatedTarget)) setPlaying(false)
      }}
    >
      <div className="relative aspect-[3/2]">
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
              sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 783px) calc(100vw - 64px), 720px"
              className={`object-cover object-center transition-opacity duration-700 motion-reduce:transition-none ${current ? "opacity-100" : "opacity-0"}`}
            />
          )
        })}
        <div className="absolute inset-0 flex">
          <button type="button" className={photoControlClass} aria-label="Previous photo" onClick={() => move(-1)} />
          <button type="button" className={photoControlClass} aria-label="Next photo" onClick={() => move(1)} />
        </div>
      </div>
      <div className="flex justify-end border-t border-[#e1b575]/25 bg-[#211910] py-2 pr-2">
        <button type="button" className={`${controlClass} shrink-0`} aria-label={playing ? "Pause photo rotation" : "Play photo rotation"} onClick={() => setPlaying(!playing)}>
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
        </button>
      </div>
      <figcaption aria-live={playing ? "off" : "polite"} className="sr-only">
        Photo {index + 1} of {photos.length}
      </figcaption>
    </figure>
  )
}
