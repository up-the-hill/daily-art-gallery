import { randomInt } from "crypto";
import Head from "next/head";
import { useEffect } from "react";
import { useState } from "react";

export default function Home() {
	
	// make api call
  let api_endpoint = "https://api.artic.edu/api/v1/artworks";
  const [response, setResponse] = useState(null);
  useEffect(() => {
    fetch(api_endpoint)
      .then((res) => res.json())
      .then((data) => setResponse(data));
  }, []);

	var myrng = new Math.seedrandom('pasta')
	console.log(myrng())

  let dailyImage = randomInt(119560);

  console.log(response);
  return (
    <>
      <Head>
        <title>Daily Art Gallery</title>
        <meta name="description" content="Find a piece of art every day." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
