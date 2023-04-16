import '../public/styles/globals.css'
import Head from 'next/head'
import Script from "next/script"

function MyApp({ Component, pageProps }) {
  return (
		<>
			<Head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</Head>
			<Head> <link rel="stylesheet" href="../public/styles/globals.css" /></Head>
			<Script src="https://platform.twitter.com/widgets.js" />
			<Component {...pageProps} />
		</>	
	)		
}

export default MyApp
