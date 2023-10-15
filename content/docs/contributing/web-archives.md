---
title: "Archiving web pages"
description: "How to archive web pages in Ace Archive"
date: 2022-01-07T21:19:13-05:00
menu:
  docs:
    parent: "contributing"
weight: 203
---

Occasionally, you'll find a website that the [Wayback
Machine](https://web.archive.org/) isn't able to crawl, usually because it's
behind a confirmation prompt ("Confirm you're 18 years old to enter") or if the
page requires you to log in.

For these cases, there's an alternate approach to including archives of web
pages in an artifact.

## The solution

Most software that deals with web archiving uses a standardized file format
called a [WARC](https://en.wikipedia.org/wiki/Web_ARChive) file to store
archived web pages. To host a web archive on Ace Archive, you'll need to:

1. Use special software to generate a WARC archive for a website.
2. Host that WARC file on Ace Archive.
3. In the artifact, include a link to [ReplayWeb.page](https://replayweb.page/)
   to allows users to browse the site archived by the WARC file.

## Generating a web archive

To generate the WARC file, you can use a tool called
[Conifer](https://conifer.rhizome.org/).

With this tool, you "record" a browsing session, and any pages you visit in the
tool will be included in the archive. This allows you to do things like bypass
confirmation prompts or log into sites.

To host the generated WARC file on Ace Archive, include it in the artifact
submission as a file.

{{< alert icon="❗" >}}
Be very cautious about archiving content behind a login page and think carefully
about whether it contains any personal information.
{{< /alert >}}

## Browsing the web archive

To allow visitors to browse the contents of the WARC archive, you can use a
website called [ReplayWeb.page](https://replayweb.page/). You link to that site,
it pulls the WARC archive from Ace Archive, and it lets you browse the archived
site just like you would on the Wayback Machine.

Whenever you add a WARC file to an artifact, you should also include a link to
this tool.

In the form below, enter the URL slug of the artifact, the file name you used in
the artifact submission (which must end in `.warc` for the tool to work), and
the URL of the archived web page you want users to land on, and it will generate
the URL you should include in the artifact file.

{{< replayweb-url >}}
