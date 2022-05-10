---
title: "Archiving web pages"
description: "How to archive web pages in Ace Archive"
lead: ""
date: 2022-01-07T21:19:13-05:00
lastmod: 2022-01-07T21:19:13-05:00
draft: false
---

A lot of modern queer history is found on the web—in blogs, forums, and social
media. Archiving web pages is a different process from archiving a document or
a photo, and this page will explain how to record and archive pages from web
sites to Ace Archive.

## The problem

The modern way to record a web page for archival purposes is through
specialized file formats like WARC and
[WACZ](https://github.com/webrecorder/wacz-spec). With these formats, however,
you need a program that can read or "replay" them. The [Wayback
Machine](https://web.archive.org) is one example of such a program, but it's a
centralized service that's not build on the distributed web. For Ace Archive,
we need to use other tools to archive web pages.

## Tools

To archive a web page, you need two programs: one to record the archive, and
one to replay it. The [Webrecorder](https://webrecorder.net/) project provides
solutions for both, and it works well with the distributed model of Ace
Archive.

To record a web archive, you can use a tool like
[ArchiveWeb.page](https://archiveweb.page/) or
[Conifer](https://conifer.rhizome.org/). Both of these tools allow you to
browse a web page, record your browsing session, and save the output to a
WARC/WACZ file. Note that these tools are *not* web crawlers, and aren't
well-suited to automatically archiving entire websites.

Uploading a web archive to Ace Archive isn't enough, however, because you also
need to provide a way to browse the archive. That's where
[ReplayWeb.page](https://replayweb.page/) comes in. This tool allows you to
upload the necessary code to replay a web archive *alongside* the archive, so
users don't have to rely on a third-party service.

To use ReplayWeb.page to upload a web archive to Ace Archive, [install the
browser extension](https://archiveweb.page/en/install/) and follow the
documentation on [sharing archives with
IPFS](https://archiveweb.page/en/features/sharing/). Then follow our guide on
[uploading files to Ace Archive]({{< ref "docs/contributing/uploading-files.md"
>}}).

## Pulling content from Wayback

If you need to archive content that's only available on the Wayback Machine,
make sure you use [Conifer](https://conifer.rhizome.org/). It has builtin
support for archiving content from the Wayback Machine, and will do things like
remove the banner Wayback shows the top of the screen and translate URLs from
Wayback URLs to the original URLs.
