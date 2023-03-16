import Head from "next/head";
import Main from "../src/components/Main.jsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Daily Art Gallery</title>
        <meta name="description" content="Find a piece of art every day." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main></Main>
    </>
  );
}
