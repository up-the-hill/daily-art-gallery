import { useEffect } from "react";
import { useState } from "react";
var seedrandom = require("seedrandom");

export default function Main() {
	let getNewArt = () => {
		pass
	}
  // generate random art id based on today's date
  let dateString = new Date().toDateString;
  var myrng = seedrandom(dateString);
  let artID = Math.floor((myrng() * 1000000) % 119560);

  // make api call
  let api_endpoint = `https://api.artic.edu/api/v1/artworks/${artID}`;
  const [artData, setArtData] = useState(null);
  useEffect(() => {
    fetch(api_endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setArtData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  if (artData) {
    let imageLink =
      artData.config.iiif_url +
      "/" +
      artData.data.image_id +
      "/full/843,/0/default.jpg";
    return (
      <main className="text-white">
        <h1 className="m-4 text-4xl font-serif">{artData.data.title}</h1>
        <h2 className="m-4">{artData.data.date_display}</h2>
        <h2 className="m-4">{artData.data.artist_display}</h2>
				<button onClick={getNewArt}>New</button>
        <figure className="top-0 h-screen w-screen z-[-1] grid place-items-center fixed">
          <img
            src={imageLink}
            alt={artData.data.thumbnail.alt_text}
            className="h-screen"
          ></img>
        </figure>
      </main>
    );
  } else {
    return <h1 className="text-4xl">Loading...</h1>;
  }
}
