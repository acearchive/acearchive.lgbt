---
title: "Best practices for contributing"
description: "Best practices for contributing to the archive"
lead: ""
date: 2022-01-09T12:51:25-05:00
lastmod: 2022-01-09T12:51:25-05:00
draft: false
menu:
  docs:
    parent: "contributing"
weight: 206
---

This page outlines some best practices to follow when contributing content to
Ace Archive.

## Include transcriptions where possible

If the content is in a format that's not accessible (such as a photo or a
digital scan of a physical document), include a transcription where possible.
Transcriptions can be included as a separate file in the artifact as long as
it's clear which one is the transcription and which one is the original.

## Include translations where available

If the content is written in a language other than English, include both the
original text and the English translation if both are available.

## Include bibliographies where applicable

If the artifact contains a published work, include a bibliography for it as a
separate file using a standardized reference file format like BibTeX/BibLaTeX.
These files can be imported into reference managers like Zotero and help people
cite the work or find it on the legacy web.

If the work doesn't have a stable home on the legacy web, you may want to
update the `url` field of the BibTeX file to point to an [IPFS
gateway](https://docs.ipfs.io/concepts/ipfs-gateway/) URL. You can use the form
below to generate a gateway URL from the [CID]({{< ref
"docs/contributing/uploading-files.md#what-is-a-cid" >}}) of the file and a file
name.

{{< gateway-url >}}

## Use web archive (WARC) files

If you're contributing a web page to the archive, use a file format designed
for archiving web pages such as WARC or
[WACZ](https://github.com/webrecorder/wacz-spec). Also include the web archive
in a browsable format so users don't need to install specialized software to
browse the archived web page. The section ["Archiving web pages"]({{< ref
"docs/contributing/web-archives.md" >}}) has instructions on how to do this.

## Download videos from sites like YouTube

If you want to contribute a video that's hosted on a video sharing platform
like YouTube, rather than submitting a web archive of the page, download the
video directly using a tool like
[youtube-dl](https://ytdl-org.github.io/youtube-dl/). Contrary to the name,
youtube-dl supports many sites besides YouTube, and you can find a full list of
supported sites
[here](https://github.com/ytdl-org/youtube-dl/blob/master/docs/supportedsites.md).

## Respect the privacy of individuals

When filling out the `people` field in an [artifact file]({{< ref
"docs/contributing/artifact-files.md" >}}), make sure to respect the privacy of
individuals. This means using handles or usernames when a person typically goes
by a pseudonym online. Also, you must **always** use a person's preferred name
over their legal name or deadname.

## Use existing tags when possible

When filling out the `identities` and `people` fields in an artifact file,
prefer using identities and names as they currently appear in other artifacts
in the archive. So if "gray-asexual" already exists in the archive, don't add
"grey-asexual" or "gray-ace" unless there's a good reason (e.g. the author of a
work makes a case that they're distinct identities).
