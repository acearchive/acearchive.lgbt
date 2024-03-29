---
title: "Best practices for contributing"
description: "Best practices for contributing to the archive"
date: 2022-01-09T12:51:25-05:00
menu:
  docs:
    parent: "contributing"
weight: 202
---

This page outlines some best practices to follow when contributing content to
Ace Archive.

## Respect creators

Please be respectful of creators, particularly independent creators, when
deciding whether to rehost content.

The purpose of rehosting content on Ace Archive is to preserve files which are
in danger of becoming lost media. We may remove files from submissions that we
feel are included in bad faith.

If you want your content removed from this site, feel free to [contact us]({{<
ref "contact"
>}}).

## Respect the privacy of individuals

When listing the people associated with an artifact, make sure to respect the
privacy of individuals. This means using handles or usernames when a person
typically goes by a pseudonym online. Additionally, you must **never** use a
person's deadname.

If you have any privacy concerns about content on this site, feel free to
[contact us]({{< ref "contact" >}}).


## Make content accessible

If the content is in a format that's not accessible (such as a photo, a video,
or a digital scan of a physical document), include transcripts/subtitles where
possible. When adding transcripts as separate files, make sure it's clear which
files are transcripts and what they're transcripts of.

Plain HTML documents using semantic elements where appropriate are a great
choice for creating accessible transcripts of documents and photos. We provide
CSS you can use for styling plain HTML which is simple, readable, and will
respect the user's light/dark theme preference.

We provide a template HTML file that links to our CSS to get you started.

{{< transcript-link >}}
Download the transcript template here.
{{< /transcript-link >}}

If a transcript was generated by a robot, like OCR transcripts or auto-generated
subtitles, make this clear in the name of the file.

Finally, if you find this website difficult to use for any reason, we consider
that a high-priority bug. Please [contact us]({{< ref "contact" >}}) however is
easiest for you.

## Add content warnings where necessary

Archives often include content which doesn't represent the values of the
project. However, we can empower visitors to decide what kind of content they
are willing to engage with by attaching content warnings.

If you're submitting content which is queerphobic, pathologizing, hateful, or
could otherwise be distressing to view, add content warnings.

Content warnings are added at the end of the artifact description (not the
summary), and are formatted like this:

> (CW: *warning 1*, *warning 2*, *etc.*)

Here's an example:

> David Jay, founder of AVEN, is interviewed on ABC's *The View* (CW: acephobia,
> invasive questions toward asexual people)

## Include citations where applicable

If you're referencing a published work, include a citation for it as a separate
file using a standardized file format like BibTeX. These files can be imported
into reference managers like [Zotero](https://www.zotero.org/) and help people
cite the work or find it on the web.

## Include both files and links in your submission

The two ways to include content in your submission are *files* and *links*.

If the content is a file like a PDF, image, or video, include it in your
submission as a file and also add a link to where it can be found on the web.
This ensures that people can always trace where content came from.

When possible, make sure you link to reputable, permanent sites like libraries,
journal databases, or archives like the Internet Archive.

{{< alert icon="👉" >}}
Some libraries and journal databases will provide a permalink somewhere on the
page which is different than the URL in your address bar. Always use a permalink
when one is provided.
{{< /alert >}}

## Use Wayback Machine links when necessary

When linking to a website like a blog post or a forum thread, use a [Wayback
Machine](https://web.archive.org/) link if the website is no longer available on
the web or has changed substantially since the version you're trying to
reference.

If you need to archive a page that the Wayback Machine isn't able to crawl, such
as a page behind a confirmation prompt or login page, check out {{< article
"docs/contributing/web-archives.md" >}} for an alternative approach.

## Download videos from sites like YouTube

If you want to contribute a video that's hosted on a video sharing platform like
YouTube, in addition to linking to the source, consider downloading the video
directly using a tool like [youtube-dl](https://ytdl-org.github.io/youtube-dl/)
and including it in your submission as a file. Contrary to the name, youtube-dl
supports many sites besides YouTube; you can find a full list of supported sites
[here](https://github.com/ytdl-org/youtube-dl/blob/master/docs/supportedsites.md).

## Use existing tags when possible

When listing the people and identities associated with an artifact, prefer using
identities and names as they currently appear in the archive. So if
"gray-asexual" already exists in the archive, don't add "grey-asexual" or
"gray-ace" unless there's a good reason (e.g. the author of a work makes a case
that they're distinct identities).

## Look to existing artifacts as examples

If you're not sure about something, look at existing artifacts in the archive as
an example!
