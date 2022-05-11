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
choice for creating accessible transcripts. We provide CSS you can use for
styling plain HTML which is simple, readable, and will respect the user's
light/dark theme preference.

We provide a template HTML file that links to our CSS to get you started.

{{< transcript-link >}}
Download the transcript template here.
{{< /transcript-link >}}

## Include translations where available

If the content is written in a language other than English, include both the
original text and the English translation if both are available.

## Include citations where applicable

If the artifact contains a published work, include a citation for it as a
separate file using a standardized file format like BibTeX/BibLaTeX. These
files can be imported into reference managers like
[Zotero](https://www.zotero.org/) and help people cite the work or find it on
the legacy web.

## Include both files and links in artifacts when possible

The two ways to include content in an [artifact file][artifact-file] are
*files* and *links*.

If the content is a file like a PDF, image, or video, include it in the
artifact as a file and also add a link to where it can be found on the web.
This ensures that people can always trace where content came from.

When possible, make sure you link to reputable, permanent sites like libraries,
journal databases, or archives like the Internet Archive.

{{< alert icon="👉" >}}
Some libraries and journal databases will provide a permalink somewhere on the
page which is different than the URL in your address bar. Always use a
permalink when one is provided.
{{< /alert >}}

## Include Wayback links when linking to websites

When a primary source is a website like a blog or forum thread, the easiest way
to include it in an artifact is to add a link. If the website is no longer
available on the web, include a [Wayback Machine](https://web.archive.org/)
link. If the website *is* still available on the web, you should include both a
regular link and a Wayback link. This ensures that even if the content moves,
changes, or is taken down, users can still find it.

You can give both the regular link and the Wayback link the same name in the
[artifact file][artifact-file]; the artifact page on Ace Archive will show
which is which automatically.

## Download videos from sites like YouTube

If you want to contribute a video that's hosted on a video sharing platform
like YouTube, in addition to linking to the source, you should download the
video directly using a tool like
[youtube-dl](https://ytdl-org.github.io/youtube-dl/) and add it to the artifact
as a file. Contrary to the name, youtube-dl supports many sites besides
YouTube; you can find a full list of supported sites
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

## Use links to provide context

Because Ace Archive is intended to be an archive of primary sources rather than
a wiki or encyclopedia, the descriptions in [artifact files][artifact-file]
should generally be kept brief.  However, if context is required to understand
an artifact, you can include a link to an outside website that provides the
necessary context for the artifact.

[artifact-file]: {{< ref "docs/contributing/artifact-files.md" >}}
