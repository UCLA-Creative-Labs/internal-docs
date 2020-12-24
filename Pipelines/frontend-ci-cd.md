# Frontend CI/CD

This document will detail our CI/CD model for frontend software. 

- [What is CI/CD](#What-is-CICD?)
- [Frontend Continuous Integration](#Frontend-Continuous-Integration)
  - [Mergify](#Mergify)
  - [ESLint](#ESLint)
  - [Stylelint](#Stylelint)
  - [Important Notes on Linters](#Important-Notes-on-Linters)
- [Frontend Continuous Deployment](#Frontend-Continuous-Deployment)
  - [Netlify](#Netlify)

## What is CI/CD?

CI/CD stands for Continuous Integration and Continuous Deployment. When you deploy
software, you want to always make sure you test your code to make sure all your new
changes are integrated with the existing code base.

* Continuous Integration (CI) the integration between pushed changes and the main repository.

* Continuous Deployment (CD) handles publishing your changes so that bug fixes 
and feature requests can be fulfilled. 

By nature, the continuous aspects of any CI/CD model requires the pipeline to be
automated. The core philosophy behind automating your integration and deployment
stems from the reality that the everyone is fallable to errors. By automating our
integration and deployment pipeline, we remove any human error from occuring and 
its also nice to do less work 😊

## Frontend Continous Integration

We handle the Continuous Integration aspects of our frontend software similar to
that of the backend integration. 

### Mergify

Mergify is a great tool for managing production code. The idea is to rely on 
maintainers to validate and approve pull requests and let Mergify handle 
integrationg the changes into production. This way, no one directly touches 
`main`. 

Key Aspects:
- Mergify checks to see if the title follows conventional commits
- Mergify, by default, will squash merge changes onto master
- Mergify automatically merges Dependatbots PRs
- Mergify automatically dismisses stale reviews

See the [`.mergify.yml`](examples/.mergify.yml) file for more info.

### ESLint

We use ESLint for our TypeScript files (`**/*.ts` and `**/*.tsx`). ESLint has 
really fantastic functionality for linting JavaScript code so naturally we picked 
it as our linter for our code.

We use a linter because at the end of the day, we spend most of our time reading
code as opposed to writing code. Clean, consistent code reigns supreme.

Notable Linter Rules:
- no-console: dont litter 🗑
- single quotes: uniformity is key 
- 2 space indentation: we like skinny, readable code
- max line length 120: ^ 👍

See our documented [`.eslintrc.js`](examples/.eslintrc.js) and [`.eslintignore`](examples/.eslintignore) files for more info.

### StyleLint

We use StyleLint for our styled components (`**/*.css` and `**/*.scss`). Our linter rules for our style files are generic at the moment. We use the [standard configuration](https://github.com/stylelint/stylelint-config-standard), however if there are any edits that you think should be made, feel free to make a PR for it!

See our [`.stylelintrc.json`](examples/.stylelintrc.json) file for more info.

### Important Notes on Linters

Remember to add a package script as follows:

```
// package.json
{
  ...
  "scripts": {
    ...
    "lint": "npx eslint '**/*.tsx' '**/*.ts' && npx stylelint '**/*.css' '**/*.scss'"
    ...
  }
  ...
}
```

**Note:** We dont run `yarn lint` on `build` or `start`. This means you can avoid our linting rules during development (console logging 👀), and clean up your code when you make a pull request.

## Frontend Continous Deployment

Due to the amazing Netlify, continuous deployment of our frontend software is super
easy!

### Netlify

We use [Netlify](https://www.netlify.com/) to host our website. Netlify has a 
really cool feature that let's you see a preview of the your changes. Make sure to 
reference the feature or bug fixes in your commit description so that reviewers 
can verify and test your changes.

Follow this [blog post](https://www.netlify.com/blog/2016/07/20/\
introducing-deploy-previews-in-netlify/) for more information. 

To learn more about our Netlify settings, checkout the documentation in the
[Netlify folder](../Netlify/README.md).