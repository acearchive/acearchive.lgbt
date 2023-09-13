# Ace Archive

This is the repository for the [Ace Archive](https://acearchive.lgbt) website.
You can find more information about the project
[here](https://acearchive.lgbt/about).

This website is a [Hugo](https://gohugo.io/) static site based on the [Doks
theme](https://getdoks.org/).

This repo contains the static site itself. The project's backend services,
tools, and infrastructure can be found in the following repos:

- [artifact-submit-action](https://github.com/acearchive/artifact-submit-action):
  This is a GitHub Action which uploads submitted artifacts to the site once
  they're manually approved.
- [artifact-submissions](https://github.com/acearchive/artifact-submissions):
  This is where new artifacts are submitted for approval. Users create
  submissions via the [artifact submission
  form](https://acearchive.lgbt/submit/), which generates a JSON file that is
  checked into this repo.
- [files-worker](https://github.com/acearchive/files-worker): This is a
  serverless function which serves artifact files from object storage.
- [api-worker](https://github.com/acearchive/api-worker): This is a serverless
  function which serves the REST API.
- [hugo-artifact-action](https://github.com/acearchive/hugo-artifact-action):
  This is a GitHub Action which converts dynamic content into static pages for
  the static site generator.
- [yahoo-groups-reader](https://github.com/acearchive/yahoo-groups-reader): This
  is a CLI tool for building a static site from a Yahoo Groups archive. This was
  purpose-built for [Haven for the Human
  Amoeba](https://acearchive.lgbt/artifact/haven-for-the-human-amoeba/).
- [infra](https://github.com/acearchive/infra): This repo contains the Terraform
  config for the site's infrastructure.

## Building

To build the site, make sure npm is installed and run:

```shell
npm install
npm run build
```

The site will be built at `./public`.

## Local Development

To start a server for local development, run:

```shell
npm run server
```

The site will be served on port `1313`.
