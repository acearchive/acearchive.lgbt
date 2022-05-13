---
title: "Archiving web pages"
description: "How to archive web pages in Ace Archive"
lead: ""
date: 2022-01-07T21:19:13-05:00
lastmod: 2022-01-07T21:19:13-05:00
draft: false
menu:
  docs:
    parent: "contributing"
weight: 206
---

We mention in {{< article "docs/contributing/best-practices.md"
"include-wayback-links-when-linking-to-websites" >}} that whenever an artifact
includes a link to a website, you should also include a Wayback Machine link.

However, there are some cases where the Wayback Machine isn't able to crawl
pages, such as if the page is gated behind a confirmation prompt ("confirm
you're 18 years old to enter") or if the page requires you to log in.

For these cases, there's an alternative approach to including archives of web
pages in an artifact.

## The solution

Most software that deals with web archiving uses a standardized file format
called a [WARC](https://en.wikipedia.org/wiki/Web_ARChive) file to store
archived web pages. To host a web archive on Ace Archive, you'll need to:

1. Use specialized software to generate a WARC archive for a website.
2. Host that WARC file on Ace Archive.
3. In the artifact, include a link to a different site that allows users to
   browse the site archived by the WARC file.

## Generating a web archive

There are many tools you can use to generate a web archive. Any tool that can
output a `.warc` file will work! If the goal is to archive web pages that
require user interaction (a situation that the Wayback Machine isn't
well-suited for), a good tool for the job is
[Conifer](https://conifer.rhizome.org/).

With this tool, you "record" a browsing session, and any pages you visit in the
tool will be included in the archive. This allows you to do things like bypass
confirmation prompts or log into sites.

To host the generated web archive on Ace Archive, include it in the artifact
file as a file.

## Replaying the web archive

Browsing the contents of a WARC file requires special software. Luckily, there
is a tool called [ReplayWeb.page](https://replayweb.page/) which can pull the
WARC from Ace Archive and allow users to browse its contents without
downloading any software. Whenever you add a WARC file to an artifact, you
should also include a link to this tool.

In the form below, enter the [CID]({{< ref
"docs/contributing/uploading-files.md#what-is-a-cid" >}}) of the WARC file, a
file name for the file (which must end in `.warc`), and the URL of the archived
web page you want users to land on, and it will generate the URL you should
include in the artifact file.

{{< replayweb-url >}}
