import { useState } from 'react'

export const TextDispute = ({ text }: { text: string }) => {
  const [showFullText, setShowFullText] = useState(false)

  const shortText = text.substring(0, 100)
  return (
    <div className='text-tg-subtitle-color'>
      <p>
        {showFullText ? text : shortText}
        {text.length > 100 && !showFullText && (
          <>
            <span>... </span>
            <span
              className='text-tg-accent-color'
              onClick={() => setShowFullText(true)}>
              ещё
            </span>
          </>
        )}
      </p>
    </div>
  )
}
