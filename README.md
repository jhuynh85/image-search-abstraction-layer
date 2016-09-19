# Image Search Abstraction Layer

JavaScript app that fulfills the following user stories:
 
1. I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
2. I can paginate through the responses by adding a ?offset=2 parameter to the URL.
3. I can get a list of the most recently submitted search strings.

**Example usage:**  
Search for 'lolcats funny' and skip the first 10 results:  
`https://fcc-basejump-imagesearch.herokuapp.com/lolcats%20funny?offset=10`

Display the most recent searches:  
`https://fcc-basejump-imagesearch.herokuapp.com/latest`
