# Netlify

Netlify is a great service we use for our frontend deployment. It has really nice
integration with GitHub, which allows us to stage deploy previews to easily review
frontend code changes before merging to `main`. Netlify also has great deploy functionality, with environement variables, build settings, build hooks, etc. 

## Getting Started

1. Create a site by hitting the "Create a new site" button

2. Configure the Netlify app on GitHub to allow Netlify to access your project

    **Note: It's always better to restrict access to third-party apps, never expose the entire Creative Labs GitHub**

3. Finalize your build settings and deploy!

    **Note: Build settings can be different across different projects. But most will have the build command be `yarn build` and publish directory as `dist/`**

## Environment Variables

Environment variables are great for hiding sensitive information that we don't want 
to be immediately found in the source code. We use environment variables with Netlify
to hide API tokens that can be run during the build phases of a deployment.

## Webhooks

Webhooks are a great way to trigger builds when an action occurs. We use webhooks
to trigger a new build of our website `Sunshine` whenever we edit the Google Sheets
for Notifications. Webhooks allow us to programmatically trigger a new build, and 
combined with some prebuild scripts, allows us to completely obfuscate access tokens
and other sensitive material. 

1. Create a build hook for your website

    You should get a url like: `https://api.netlify.com/build_hooks/<...>`

2. Write a post request to trigger the build

    ```gs
    function post(url) {
      try {
        var response = UrlFetchApp.fetch(url, {"method": "post"});
        Logger.log(response);
      } catch (error) {
        Logger.log(error);
      }
    }
    ```
    This is a snippet from our Netlify Hook for our Google Sheets file `Admin Utility`. You can view the file [here](examples/sheets-hook.gs).

## Scripts

You can add prebuild and postbuild scripts to your sites with great flexibility with
Netlify. It's a neat trick to use in order to "cache" information. Simply call the 
script during your `yarn build` command and store the information in a `.json` format
and you can now cache that information for static usage!

Checkout the example [`prebuild.js`](examples/prebuild.js) and 
[`postbuild.js`](examples/postbuild.js) script for more details.

## Redirects

Netlify redirects are super useful! We use it for our [`tinycl.com`](https://tinycl.com)
to act similar to how `tinyurl.com` functions. A basic redirects would like something
like this in a `netlify.toml` file.

```toml
[[redirects]]
  from = '/*'
  to = '/'
  status = 200
```

Checkout the `netlify.toml` file [here](examples/netlify.toml).

