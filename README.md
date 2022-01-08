# Ace Archive

This is the repository for the [Ace Archive](https://acearchive.lgbt) website.
If you want to learn about the project, check out the [about
page](https://acearchive.lgbt/docs/about/what-is-ace-archive). If you're
looking for some ways to contribute to the project other than writing code,
check out the [contributing
documentation](https://acearchive.lgbt/docs/contributing/getting-started). If
you want to dive into the source code, you're in the right place!

This website is a [Hugo](https://gohugo.io/) static site using the [Doks
theme](https://getdoks.org/). The website was designed using a static site
generator to fulfill a couple of key goals:

- Make the archive as easy to contribute to as possible
- Make the website easy to host on the IPFS network without any backend
  infrastructure
- Keep infrastructure costs as low as possible
- Simplify development and deployment

The content of the archive is hosted on the IPFS network using
[Web3.Storage](https://web3.storage). We use GitHub Actions workflows to
automatically validate the syntax of [artifact
files](https://acearchive.lgbt/docs/contributing/artifact-files/) when a pull
request is opened and upload the content to Web3.Storage when a pull request is
merged. The code which does this can be found at
[acearchive/w3s-upload](https://github.com/acearchive/w3s-upload).
