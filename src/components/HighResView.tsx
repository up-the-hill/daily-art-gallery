import { useEffect, useState } from "react"

interface HighResViewProps {
  imageUrl: string
  altText: string
  // title: string
  // artist: string
  // date: string
  onClose: () => void
}

export default function HighResView({
  imageUrl,
  altText,
  // title,
  // artist,
  // date,
  onClose,
}: HighResViewProps) {
  let [isLoading, setIsLoading] = useState(true);

  function onImageLoad() {
    setIsLoading(false);
  }
  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Close button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300"
          aria-label="Close high resolution view"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Zoomable image */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={altText}
        onLoad={onImageLoad}
        className="flex-1 h-full"
      />
    </div>
  )
}

