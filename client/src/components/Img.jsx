import { useState } from 'react'
import { imageSize } from '../data/images'

// 이미지를 불러오지 못하면 fallback(보통 #EFEFEF 배경 + 제목)을 대신 보여줍니다.
export default function Img({ src, alt, className = '', style, fallback = null }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return fallback
  const { width, height } = imageSize(src)
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      style={style}
    />
  )
}
