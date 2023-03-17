import { useState } from "react";

export default function Main({ data }) {
  const [artData, setArtData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  let getNewArt = async () => {
    setIsLoading(true);
    try {
      // get a random page
      let randomPageLink = `https://api.artic.edu/api/v1/artworks?page=${
        Math.floor(Math.random() * 9964) + 1
      }&fields=id`;
      const pageRes = await fetch(randomPageLink);
      const pageData = await pageRes.json();

      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks/${
          pageData["data"][Math.floor(Math.random() * 13)].id
        }?fields=id,title,date_display,artist_display,image_id,thumbnail`
      );
      const result = await response.json();
      console.log(result);
      setArtData(result);
    } catch {
      console.log("api error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="text-white">
      {isLoading && <h2>Loading...</h2>}
      <h1 className="m-4 text-4xl font-serif">{artData.data.title}</h1>
      <h2 className="m-4">{artData.data.date_display}</h2>
      <h2 className="m-4">{artData.data.artist_display}</h2>
      <button onClick={getNewArt} className="fixed top-4 right-4">
        New
      </button>
      <figure className="top-0 h-screen w-screen z-[-1] grid place-items-center fixed">
        <img
          src={
            artData.config.iiif_url +
            "/" +
            artData.data.image_id +
            "/full/843,/0/default.jpg"
          }
          alt={artData.data.thumbnail.alt_text}
          className="h-screen"
        ></img>
      </figure>
    </main>
  );
}
