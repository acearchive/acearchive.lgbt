# Ace Archive

This is the repository for the [Ace Archive](https://acearchive.lgbt) website.
You can find more information about the project
[here](https://acearchive.lgbt/about).

This website is a [Hugo](https://gohugo.io/) static site based on the [Doks
theme](https://getdoks.org/). The website was designed using a static site
generator for a few reasons:

- With a static site, rather than using complex CMS or wiki software, we can
  just use GitHub as our platform for discussion and collaboration. Every
  artifact in the archive is just a YAML file in [this
  repo](https://github.com/acearchive/artifacts).
- Using git to store artifact metadata gives us a lot of functionality for
  free, like version control, history, modification timestamps, etc.
- Storing the archive as plain text in git makes the archive more open,
  extensible, and hackable (the good kind of hackable).
- With no backend infrastructure, the site is performant, easy to deploy, and
  incredibly cheap to host. This last point is important for the longevity of
  the project because it means we don't need to worry much about funding.

## Artifacts

Each artifact in the archive is just a YAML file in
[acearchive/artifacts](https://github.com/acearchive/artifacts). That repo is
mounted as a [Hugo module](https://gohugo.io/hugo-modules/) when this site is
built, and the metadata from those files is used to build the site.

For more information about the architecture of the site, how to use our API for
querying artifacts, and how content in the archive is hosted, check out that
repo.

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
