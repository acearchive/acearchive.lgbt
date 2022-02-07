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

## Include transcripts where possible

If the content is in a format that's not accessible (such as a photo or a
digital scan of a physical document), include a transcript where possible. When
adding a transcript as a separate file, make sure it's clear which files are
transcripts and what they're transcripts of.

Plain HTML documents using semantic elements where appropriate are a great
choice for creating accessible transcripts. Below are buttons to download CSS
and a template HTML file you can use for creating transcripts without having to
worry about styling.

{{< transcript-template >}}

## Include translations where available

If the content is written in a language other than English, include both the
original text and the English translation if both are available.

## Include citations where applicable

If the artifact contains a published work, include a citation for it as a
separate file using a standardized file format like BibTeX/BibLaTeX. These
files can be imported into reference managers like Zotero and help people cite
the work or find it on the legacy web.

If the work doesn't have a stable home on the legacy web, you may want to
update the `url` field of the BibTeX file to point to an [IPFS
gateway](https://docs.ipfs.io/concepts/ipfs-gateway/) URL. You can use the form
below to generate a gateway URL from the [CID]({{< ref
"docs/contributing/uploading-files.md#what-is-a-cid" >}}) of the file and a
file name.

{{< collapse label="Gateway URL Generator" >}}
{{< gateway-url >}}
{{< /collapse >}}

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

When filling out the `people` field in an [artifact file][artifact-file], make
sure to respect the privacy of individuals. This means using handles or
usernames when a person typically goes by a pseudonym online. Also, you must
**always** use a person's preferred name over their legal name or deadname.

## Use existing tags when possible

When filling out the `identities` and `people` fields in an [artifact
file][artifact-file], prefer using identities and names as they currently
appear in other artifacts in the archive. So if "gray-asexual" already exists
in the archive, don't add "grey-asexual" or "gray-ace" unless there's a good
reason (e.g. the author of a work makes a case that they're distinct
identities).

## Host content on the IPFS network when possible

The two ways to link to content from an [artifact file][artifact-file] are the
`files` field and the `links` field. The difference is that the `files` field
is for linking to files hosted on the IPFS network, while the `links` field is
for linking to websites on the legacy web.

When permitted by copyright, always host content on the IPFS network. This
helps us ensure that the content sticks around, even if the original site goes
down.

## Link to the original source of content

When hosting a file on the IPFS network using the `files` field in an [artifact
file][artifact-file], you should also include a link to the original source of
the content using the `links` field.  This ensures that people can always trace
where content came from and still have a way to access it if it's not
accessible on the IPFS network for whatever reason.

When possible, make sure you link to reputable, permanent sites like libraries,
journal databases, or archives like the Internet Archive.

{{< alert icon="👉" >}}
Some libraries and journal databases will provide a permalink somewhere on the
page which is different than the URL in your address bar. Always use a
permalink when one is provided.
{{< /alert >}}

## Use links to provide context

Because Ace Archive is intended to be an archive of primary sources rather than
a wiki or encyclopedia, the descriptions in [artifact files][artifact-file]
should generally be kept brief.  However, if context is required to understand
an artifact, you can use the `links` field to include a link to an outside
website that provides the necessary context for the artifact.

[artifact-file]: {{< ref "docs/contributing/artifact-files.md" >}}
