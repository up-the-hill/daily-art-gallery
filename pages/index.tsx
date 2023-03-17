import Head from "next/head";
import Main from "../src/components/Main.jsx";
var seedrandom = require("seedrandom");

interface Response {
  data: {
    id: number;
    title: string;
    thumbnail: {
			lqip: string;
			width: number;
			height: number;
			alt_text: string;
		}
    date_display: string;
    artist_display: string;
		image_id: string;
  };
	info: {
		license_text: string;
		license_links: any;
		version: string;
	}
	config: {
		iiif_url: string;
		website_url: string;
	}
}

export default function Home({ data }: Response) {
  console.log(data);
  return (
    <>
      <Head>
        <title>Daily Art Gallery</title>
        <meta name="description" content="Find a piece of art every day." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main data={data}></Main>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  // generate random art id based on today's date
  let dateString = new Date().toDateString();
  var myrng = seedrandom(dateString);
  let artID = Math.floor((myrng() * 1000000) % 119560);

  // make api call
  let daily_link = `https://api.artic.edu/api/v1/artworks/${artID}/?fields=id,title,date_display,artist_display,image_id,thumbnail`;

  // Fetch data from external API
  const res = await fetch(daily_link);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}
