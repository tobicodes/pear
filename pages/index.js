import { useState, useEffect } from 'react';
import Head from 'next/head';
// import {storeTweets, getTweetsForUrl, storeHeading} from "../storage.js"
import { TwitterShareButton} from 'react-twitter-embed';

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export default function Home() {
  const [url, setUrl] = useState('');
	const [error, setError] = useState(null);
  const [tweets, setTweets] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
  const [heading, setHeading] = useState('');
	
	
// 	useEffect(() => {
// 		setTweets(['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat.'
// ,'b', 'c'])
// 	}, [])

	// 	const posts = window && window?.localStorage.getItem('ESSENCE_DATA_STORE')
	// // console.log("ZYS", posts)
	// debugger
	// console.log("POSTS", posts["https://www.tobiwrites.com/p/so-youre-a-writer-now"])
	
  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

		 if (!isValidURL(url)) {
      setError("Please enter a valid Substack URL");
    } else if(url.includes("publish")){
			 setError("Please enter a published post. We don't work with drafts now")
		} else {
      setError(null);
			setIsLoading(true)
		
    // Call your API to generate tweets
    const response = await fetch('/api/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
	      const data = await response.json();
				const {tweets, heading} = data
				console.log("RECEIVED DATA", data)
				setHeading(heading)
				setTweets(tweets);
				setIsLoading(false)
    	}
    }
  };

  return (
    <div>
      <Head>
        <title>Generate Tweets</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
	<header>
				<nav className="nav-bar">
	      <div className="logo">Essence</div>
	      <a href="#about-us" className="about-us">About Us</a>
	    </nav>
	</header>
      <main className="container">
        <div className="hero">
           <h1>Share your insights with the world.</h1>
					<p>In your style and voice, I will transform your essays into powerful tweets.</p>
{/*       <p>Essence transforms your essays and blog posts into powerful tweets with AI.</p> */}
					<p style={{marginTop: "8px"}}>So you can focus on writing bangers, not tweets.</p>
          <form onSubmit={handleSubmit} className="input-container">
            <input
							name="url"
							autoComplete="on"
							type="search"
              value={url}
              onChange={handleInputChange}
              placeholder="Paste your essay link here"
              className="url-input"
            />
            <button type="submit" className="generate-tweets">
              Generate Tweets
            </button>
          </form>
					{error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
        </div>
				{isLoading && <Spinner />}
				<Results key={0} tweets={tweets} url={url} heading={heading} />
      </main>
    <footer>
    <p> Essence 2023.</p>
  </footer>
    </div>
  );
}

function cleanText(text) {
	if(!text) return text
  const regex = /^[^A-Z]+/;
  return text.replace(regex, '');
}

function DisplayCard({ text, url }) {
  const cleanedText = cleanText(text);
  return (
    <div className="tweet">
      <div style={{ maxWidth: "85%", display: "flex", flexDirection: "row" }}>
				<p>{cleanedText}</p>
			</div>
		<TwitterShareButton
    url={url}
    options={{ text}}
  />
    </div>
  );
}

function Spinner () {
	return (
	<section className="sec-loading">
  <div className="one">
  </div>
</section>
	)
}

function Results({ tweets, url, heading, isLoading }) {
	if(isLoading) {
		console.log(isLoading, "LOADING")
		return <Spinner />
	}

  return (
    <div className="results">
      <div className="tweet-container">
        {tweets && tweets.length > 0 && tweets.map((tweet, index) => (
          <DisplayCard key={index} url={url} text={tweet} />
        ))}
      </div>
    </div>
  );
}





