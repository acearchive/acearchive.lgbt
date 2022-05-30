# Ace Archive

This is the repository for the [Ace Archive](https://acearchive.lgbt) website.

This website is a [Hugo](https://gohugo.io/) static site based on the [Doks
theme](https://getdoks.org/). The website was designed using a static site
generator for a few reasons:

- With a static site, rather than using a complex CMS or wiki software, we can
  just use GitHub as our platform for discussion and collaboration. Every
  artifact in the archive is just a YAML file in the repo.
- With no backend infrastructure, the site is performant, easy to deploy, and
  incredibly cheap to host.

## Tooling

The content of the archive is hosted on the IPFS network using
[Web3.Storage](https://web3.storage). We use GitHub Actions workflows to
automatically validate the syntax of [artifact
files](https://acearchive.lgbt/docs/contributing/artifact-files/) when a pull
request is opened and upload the content to Web3.Storage when a pull request is
merged. The code which does this can be found at
[acearchive/artifact-action](https://github.com/acearchive/artifact-action).

Ace Archive doesn't provide a REST API, but because this is a static site and
all the content is hosted publicly on the IPFS network, you don't need a REST
API to interface with the archive. Our tooling at
[acearchive/artifact-action](https://github.com/acearchive/artifact-action) can
be used to get metadata for artifacts in the archive, download the content, or
re-host the content elsewhere.

## Infrastructure

The infrastructure config for the site can be found at
[acearchive/infra](https://github.com/acearchive/infra).

## Usage

To build the site, make sure npm is installed and run:

```shell
npm install
npm run build
```

The site will be built at `./public`.
