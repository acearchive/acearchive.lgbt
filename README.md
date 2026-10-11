# Ace Archive

This is the repo for the [Ace Archive](https://acearchive.lgbt) website, a
static site built with [Hugo](https://gohugo.io).

This website is a custom frontend for a self-hosted [Omeka
S](https://omeka.org/s/) instance that houses the collection. You can find more
information about how Omeka S is deployed in the
[acearchive/omeka-deployment](https://github.com/acearchive/omeka-deployment)
repo.

This project is supported by various backend services, some of which act as the
"glue" between Omeka S and the frontend. Those services can be found in the
[acearchive/services](https://github.com/acearchive/services) repo.

Before switching to Omeka S in October 2026, this project used a custom backend.
Many of the repositories under this GitHub organization are related to that
backend, which is now abandoned. Those repos have been archived.

## Development

You can use [just](https://github.com/casey/just) to build and deploy the app.
Run `just` to see a list of recipes. Some recipes accept a stage, either `prod`
or `dev`.

## Deployment

There are two deployments of Ace Archive:

1. The prod environment (<https://acearchive.lgbt>) is automatically deployed
   when changes are pushed to the `prod` branch.
1. The dev environment (<https://dev.acearchive.lgbt>) is automatically deployed
   when changes are pushed to the `main` branch.

Currently, both environments share the same backend stack. This is not ideal,
but unfortunately hosting is expensive.
