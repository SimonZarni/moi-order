import image_426b03fb98fd8dabb8d525acc08879bc8e4c4e9e from 'figma:asset/426b03fb98fd8dabb8d525acc08879bc8e4c4e9e.png';
import React, { useState } from 'react'

const ERROR_IMG_SRC =
  image_426b03fb98fd8dabb8d525acc08879bc8e4c4e9e

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
