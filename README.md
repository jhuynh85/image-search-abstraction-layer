# FreeCodeCamp Basejump - URL Shortener Microservice

JavaScript app that fulfills the following user stories:
 
1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
2. If I pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain an error instead.
3. When I visit that shortened URL, it will redirect me to my original link.

**Example creation usage:**  
`https://fcc-basejump-urlshortener.herokuapp.com/new/http://foo.com:80`  
`https://fcc-basejump-urlshortener.herokuapp.com/new/https://www`  

**Example creation output:**  
`{ "original_url":"http://foo.com:80", "short_url":"https://fcc-basejump-urlshortener.herokuapp.com//LhNGY" }`  
`{ "error":"URL invalid" }`

**Usage:**  
`https://fcc-basejump-urlshortener.herokuapp.com/Z1USYUD`

**Output:**  
`https://www.google.com/`