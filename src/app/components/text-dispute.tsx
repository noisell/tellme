import { useState } from 'react'

export const TextDispute = ({ text }: { text: string }) => {
  const [showFullText, setShowFullText] = useState(false)

  const shortText = text.substring(0, 235)
  return (
    <div className='text-tg-subtitle-color'>
      <p>
        {showFullText ? text : shortText}
        {text.length > 235 && !showFullText && (
          <>
            <span>... </span>
            <span
              className='text-tg-accent-color'
              onClick={() => setShowFullText(true)}>
              еще
            </span>
          </>
        )}
      </p>
    </div>
  )
}
