# Notion

We do a lot of our internal docs through Notion. Sometimes it makes sense for us to 
just make a Notion page and use it as a temporary page. 

In these cases, just posting a link to the Notion page is not sufficient. Luckily,
Cloudflare has a unique feature called `Workers` that allow us to create pages from
Notion that have clean urls.

1. Add your desired domain as an `A Record`

    `A   <subdomain>   1.1.1.1`

2. Create a `Worker`

    Go to the workers tab and click `Manage Workers`

    Then click `Create a Worker`

3. Under the `Script` section, copy and paste the code from `examples/worker.js`

    Fill out the steps laid out in the comments.

4. Hit Save and Deploy

5. Go back to the `Worker` tab and create a new route

    Route your domain to your newly created worker

    `<subdomain>.creativelabsucla.com/*`  `<worker>`