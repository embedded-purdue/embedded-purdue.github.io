"use client"

import Image, { type StaticImageData } from "next/image"
import { useState } from "react"

/**
 * Portrait image for a team member. Falls back to an ES@P placeholder when a
 * member has no photo yet, or when a `photo` path fails to load (404).
 */
export function TeamPortrait({
  image,
  photo,
  name,
}: {
  image?: StaticImageData
  photo?: string
  name: string
}) {
  const [failed, setFailed] = useState(false)
  const showPlaceholder = !image && (!photo || failed)

  return (
    <div className="relative flex aspect-[2/3] items-center justify-center overflow-hidden bg-[#151513]">
      {showPlaceholder ? (
        <div className="grid h-full w-full place-items-center bg-[linear-gradient(rgba(218,160,0,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(218,160,0,.06)_1px,transparent_1px)] bg-[size:24px_24px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" className="w-20 max-w-[45%] opacity-35" loading="lazy" decoding="async" />
        </div>
      ) : image ? (
        <Image
          src={image}
          alt={name}
          width={image.width}
          height={image.height}
          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw"
          className={`block h-auto max-h-full w-full object-contain ${image.width < 200 ? "max-w-[190px]" : ""}`}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="block h-full w-full object-cover"
        />
      )}
    </div>
  )
}
