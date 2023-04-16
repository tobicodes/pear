const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai")
const cheerio = require('cheerio');
// const fetchEssay = require('../../essayfetcher.js');

const configuration = new Configuration({
  organization: process.env['org_id'],
  apiKey: process.env['api_key'],
});
const openai = new OpenAIApi(configuration);


export default async function handler(req, res) {

	console.log("BODY", req.body)
	
  // res.status(200).json({ name: 'John Doe' })
	 const url = req.body.url;
  	if (!url) {
    res.status(400).send('Invalid URL parameter');
    return;
  }

  const { heading, content } = await fetchEssay(url)
  const posts = await generateTweetsFromNewAPI(content)
	const tweets = posts.filter(p => p) // remove empty posts

	// console.log(posts.length === tweets.length)
	console.log(tweets)
	
  return res.send({ tweets, heading, url })
}


async function generateTweetsFromNewAPI(essayText) {
  const model = 'gpt-4';
  const request = `You are a helpful marketing AI assistant. Using the following essay text, generate 5 promotional Tweets that are likely to go viral. Make sure they capture the essence of the essay. Use a maximum of one hashtag per tweet. Write the tweets in a first-person voice with the tone and style of the essay:\n\n${essayText}\n`;

  try {
    const response = await openai.createChatCompletion({
      model: model,
      messages: [{ role: 'user', content: request }],
      max_tokens: 400,
      temperature: 0.7, // Lower temperature to make the output more focused and deterministic
      top_p: 1, // Set top_p to 1 to use the full token distribution for more diverse output (optional)
    });

    const tweets = response.data.choices[0].message.content
      .trim()
      .split('\n');

    return tweets;
  } catch (error) {
    console.error('An error occurred while generating Tweets:', error);
    return [];
  }
}




async function fetchEssay(url) {
  try {
		if(!url) {
			return {heading: "", content: ""}
		}
		
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let content = '';
    let heading = '';

		const publishedPost = $('.single-post')
    const draftPost = $('.post-editor');
		

    if (publishedPost.length) {
      content = publishedPost
        .first()
        .prop('innerText')
        .trim();
      heading = $('.post-title').first().prop('innerText').trim();
    } else if (draftPost.length) {
      content = draftPost
        .first()
        .prop('innerText')
        .trim();
      heading = $('.page-title').first().prop('innerText').trim();
    } else {
      console.log('No matching content found.');
      return {heading: "", content: ""}
    }

    const result = {
      heading: heading,
      content: content
    };
    return result;
  } catch (error) {
    console.error('Error fetching essay:', error);
  }
}