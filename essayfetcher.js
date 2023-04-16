const axios = require('axios');
const cheerio = require('cheerio');

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

module.exports = fetchEssay;