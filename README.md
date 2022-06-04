# Ace Archive

This is the repository for the [Ace Archive](https://acearchive.lgbt) website.
You can find more information about the project
[here](https://acearchive.lgbt/about).

This website is a [Hugo](https://gohugo.io/) static site based on the [Doks
theme](https://getdoks.org/). The website was designed using a static site
generator for a few reasons:

- With a static site, rather than using a complex CMS or wiki software, we can
  just use GitHub as our platform for discussion and collaboration. Every
  artifact in the archive is just a YAML file in [this
  repo](https://github.com/acearchive/artifacts).
- Using git to store artifact metadata gives us a lot of functionality for
  free, like version control, history, modification timestamps, etc.
- With no backend infrastructure, the site is performant, easy to deploy, and
  incredibly cheap to host.

## Artifacts

The artifacts in the archive can be found at
[acearchive/artifacts](https://github.com/acearchive/artifacts). See that repo
for information about our API and how we host the contents of the archive on
the IPFS network.

## Infrastructure

The infrastructure config for this site can be found at
[acearchive/infra](https://github.com/acearchive/infra).

## Usage

To build the site, make sure npm is installed and run:

```shell
npm install
npm run build
```

The site will be built at `./public`.
