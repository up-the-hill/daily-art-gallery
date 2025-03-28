"use client"

import { useEffect, useState } from "react"
import seedrandom from "seedrandom"
import type Response from "./gallery.types"
import ArtDisplay from "./ArtDisplay"
import HighResView from "./HighResView"

export default function Gallery() {
  const [artData, setArtData] = useState<Response | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHighResMode, setIsHighResMode] = useState(false)
  const [isHighResLoading, setIsHighResLoading] = useState(false)

  async function getDailyArt() {
    setIsLoading(true)
    setIsImageLoaded(false) // Reset image loaded state
    setError(null)
    try {
      const date: string = new Date().toDateString()
      const myrng = seedrandom(date)
      const page = Math.floor(myrng() * 9964) + 1

      const pageRes = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&fields=id`)
      const pageData = await pageRes.json()

      const artID = pageData["data"][Math.floor(myrng() * 13)].id
      const daily_link = `https://api.artic.edu/api/v1/artworks/${artID}/?fields=id,title,date_display,artist_display,image_id,thumbnail`

      const res = await fetch(daily_link)
      const data = await res.json()

      setArtData(data)
    } catch (err) {
      setError("Failed to fetch art data.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getDailyArt()
  }, [])

  const getNewArt = async () => {
    setIsLoading(true)
    setIsImageLoaded(false) // Reset image loaded state
    setError(null)
    try {
      const randomPageLink = `https://api.artic.edu/api/v1/artworks?page=${Math.floor(Math.random() * 9964) + 1}&fields=id`
      const pageRes = await fetch(randomPageLink)
      const pageData = await pageRes.json()

      const artID = pageData["data"][Math.floor(Math.random() * 13)].id
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks/${artID}?fields=id,title,date_display,artist_display,image_id,thumbnail`,
      )
      const result = await response.json()
      setArtData(result)
    } catch {
      setError("Failed to fetch new art data.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-serif text-white mb-4">Error</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={getNewArt}
            className="px-6 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!artData) {
    return <div>No data available</div>
  }

  const openHighResView = () => {
    setIsHighResLoading(true)
    setIsHighResMode(true)
  }

  const closeHighResView = () => {
    setIsHighResMode(false)
  }

  function handleHighResImageLoad() {
    setIsHighResLoading(false)
  }

  const { data } = artData
  const highResImageUrl = `https://www.artic.edu/iiif/2/${data.image_id}/full/1686,/0/default.jpg`
  const standardImageUrl = `https://www.artic.edu/iiif/2/${artData.data.image_id}/full/843,/0/default.jpg`
  const altText = data.thumbnail.alt_text || data.title


  // If the image is still loading, show a loading indicator but still render the hidden image
  if (!isImageLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xl font-serif">Discovering art...</p>
        </div>
        {/* Hidden image that will trigger onLoad when ready */}
        {!isLoading && (
          <div className="hidden">
            <ArtDisplay
              imageUrl={standardImageUrl}
              altText={altText}
              onOpenHighRes={openHighResView}
              onImageLoad={handleImageLoad}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Main content */}
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Artwork display */}
        <ArtDisplay
          imageUrl={standardImageUrl}
          altText={altText}
          onOpenHighRes={openHighResView}
          onImageLoad={handleImageLoad}
        />

        {/* Artwork info */}
        <div className="bg-black/70 backdrop-blur-md p-6 rounded-lg max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-3 leading-tight">{artData.data.title}</h1>
          <h2 className="text-xl text-gray-300 mb-2 font-light">{artData.data.artist_display}</h2>
          <p className="text-gray-400 italic">{artData.data.date_display}</p>
        </div>
      </main>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={getNewArt}
          className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all duration-300"
          disabled={isLoading || !isImageLoaded}
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-refresh-ccw"
            >
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
          )}
        </button>
      </div>

      {/* High Resolution View */}
      {isHighResMode && (
        <HighResView
          imageUrl={highResImageUrl}
          altText={altText}
          isLoading={isHighResLoading}
          onClose={closeHighResView}
          onImageLoad={handleHighResImageLoad}
        />
      )}

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500">
        <p>Data from Art Institute of Chicago API</p>
      </footer>
    </div>
  )
}

