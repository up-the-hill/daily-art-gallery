import { useEffect, useState } from "react";
import seedrandom from 'seedrandom';
import Response from "./gallery.types";

export default function Gallery() {
  const [artData, setArtData] = useState<Response | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getDailyArt() {
    setIsLoading(true);
    setError(null);
    try {
      let date: string = new Date().toDateString();
      const myrng = seedrandom(date);
      const page = Math.floor(myrng() * 9964) + 1;

      const pageRes = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&fields=id`);
      const pageData = await pageRes.json();

      const artID = pageData['data'][Math.floor(myrng() * 13)].id;
      const daily_link = `https://api.artic.edu/api/v1/artworks/${artID}/?fields=id,title,date_display,artist_display,image_id,thumbnail`;

      const res = await fetch(daily_link);
      const data = await res.json();

      setArtData(data);
    } catch (err) {
      setError('Failed to fetch art data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getDailyArt();
  }, []);

  const getNewArt = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const randomPageLink = `https://api.artic.edu/api/v1/artworks?page=${Math.floor(Math.random() * 9964) + 1}&fields=id`;
      const pageRes = await fetch(randomPageLink);
      const pageData = await pageRes.json();

      const artID = pageData["data"][Math.floor(Math.random() * 13)].id;
      const response = await fetch(`https://api.artic.edu/api/v1/artworks/${artID}?fields=id,title,date_display,artist_display,image_id,thumbnail`);
      const result = await response.json();
      setArtData(result);
    } catch {
      setError('Failed to fetch new art data.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xl font-serif">Discovering art...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-serif text-white mb-4">Error</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={getDailyArt}
            className="px-6 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Background artwork */}
      {/* <figure className="absolute inset-0 z-0"> */}
      {/*   <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10"></div> */}
      {/*   <img */}
      {/*     src={`${artData?.config.iiif_url}/${artData?.data.image_id}/full/1200,/0/default.jpg`} */}
      {/*     alt={artData?.data.thumbnail.alt_text || artData?.data.title} */}
      {/*     className="w-full h-full object-cover" */}
      {/*   /> */}
      {/* </figure> */}

      {/* Main content */}
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Artwork display */}
        <div className="max-w-4xl mx-auto mb-8">
          <img
            src={`https://www.artic.edu/iiif/2/${artData?.data.image_id}/full/843,/0/default.jpg`}
            alt={artData?.data.thumbnail.alt_text || artData?.data.title}
            className="max-h-[70vh] w-auto object-contain shadow-2xl rounded-sm"
          />
        </div>

        {/* Artwork info */}
        <div className="bg-black/70 backdrop-blur-md p-6 rounded-lg max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-3 leading-tight">{artData?.data.title}</h1>
          <h2 className="text-xl text-gray-300 mb-2 font-light">{artData?.data.artist_display}</h2>
          <p className="text-gray-400 italic">{artData?.data.date_display}</p>
        </div>
      </main>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={getNewArt}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-md border border-white/20 transition-all duration-300 flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              <span>Loading...</span>
            </>
          ) : (
            <span>Discover New Art</span>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500">
        <p>Data from Art Institute of Chicago API</p>
      </footer>
    </div>
  )
}
