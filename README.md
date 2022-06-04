# Ace Archive

This is the repository for the [Ace Archive](https://acearchive.lgbt) website.
You can find more information about the project
[here](https://acearchive.lgbt/about).

This website is a [Hugo](https://gohugo.io/) static site based on the [Doks
theme](https://getdoks.org/). The website was designed using a static site
generator for a few reasons:

- With a static site, rather than using a complex CMS or wiki software, we can
  just use GitHub as our platform for discussion and collaboration. Every
  artifact in the archive is just a YAML file in the repo.
- With no backend infrastructure, the site is performant, easy to deploy, and
  incredibly cheap to host.

## API

Ace Archive doesn't provide a traditional REST API because artifact metadata is
just checked into the repository and artifact content is hosted publicly on the
IPFS network. However, we do provide both a CLI tool and a GitHub Action at
[acearchive/artifact-action](https://github.com/acearchive/artifact-action)
that can export this data as JSON.

## Hosting

The content of the archive is hosted on the IPFS network using
[Web3.Storage](https://web3.storage). We use GitHub Actions workflows to
automatically validate the syntax of [artifact
files](https://acearchive.lgbt/docs/contributing/artifact-files/) when a pull
request is opened and upload the content to Web3.Storage when a pull request is
merged. The code which does this can be found at
[acearchive/artifact-action](https://github.com/acearchive/artifact-action).

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
