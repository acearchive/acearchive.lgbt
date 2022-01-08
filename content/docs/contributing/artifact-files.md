---
title: "Artifact files"
description: "How to create artifact files"
lead: ""
date: 2022-01-07T09:43:25-05:00
lastmod: 2022-01-07T09:43:25-05:00
draft: false
menu:
  docs:
    parent: "contributing"
weight: 30
---

Every artifact in the archive has an *artifact file* associated with it in the
repository. An artifact file holds metadata about the artifact, including links
to the files associated with it. All you have to do to add content to the
repository is write an artifact file! This section will document the format of
artifact files and conventions for writing them.

## Creating an artifact file

Artifact files are written in YAML, which is is a format for representing
structured data in plain text. Writing artifact files is somewhat like using
the markup languages that are common when contributing to a wiki. You can learn
more about how to write YAML files
[here](https://www.cloudbees.com/blog/yaml-tutorial-everything-you-need-get-started).

{{< alert icon="👉" >}}
Technically, an artifact file is a markdown document with a YAML frontmatter
block. However, no content goes in the body of the markdown document, so you
can think of it as a YAML file with a leading and trailing `---`.
{{< /alert >}}

You can [look through the
repository](https://github.com/acearchive/acearchive.lgbt/tree/main/content/archive)
to see examples of artifact files, but generally an artifact file will look
something like this:

```
---
{{< highlight yaml >}}
title: "<em>The Asexual Manifesto</em>"
description: "A paper by the Asexual Caucus of the New York Radical Feminists"
date: 2022-01-02T10:54:43-05:00
lastmod: 2022-01-02T10:54:43-05:00
draft: false
menu:
  archive:
    parent: "browse"
files:
  - name: "The Asexual Manifesto"
    mediaType: "application/pdf"
    filename: "the-asexual-manifesto.pdf"
    cid: "bafybeihsf4562gmmyoya7eh5buxv65lqcdoil3wsi5jf5fceskap7yzooi"
  - name: "The Asexual Manifesto (Transcript)"
    mediaType: "text/markdown"
    filename: "the-asexual-manifesto-transcript.md"
    cid: "bafkreiabjlsvc7m6vdnidwziqy5nbf42lwmbyu3zbgjhj7ocekcriejuka"
people: ["Lisa Orlando", "Barbara Getz"]
identities: ["asexual"]
years: "1972"
decades: ["1970"]
{{< /highlight >}}
---
```

## URL slugs

First, a note about URL slugs. Every artifact in the repository has a URL like
`/archive/orlando-the-asexual-manifesto`. When you add a new artifact, you will
need to choose a URL slug for it.

A URL slug should always be snake-case, and will generally follow the format
`author-title`. If the author has a first and last name (i.e. isn't a handle or
username), you can just use the last name. If the title of the work is long,
you can use a shortened version of it.

If the combination of the author and the title of the work is ambiguous, (such
as a forum thread where the title of the thread might just be "asexuality"),
then you can provide additional context like `context-author-title`. For an
AVEN forum thread by "coolasexualperson" called "romance", the URL slug might
be `aven-forums-coolasexualperson-romance`.

## Artifact fields

Next, we'll talk about the fields in an artifact file.

`title`
: This is the title of the artifact. If the artifact represents a work (a book,
essay, forum thread, etc.), this will be the title of that work. If the
artifact encompasses multiple works or doesn't have an obvious title, it can be
a short description instead. You should always quote or italicize the titles of
works, and you can add italics in an artifact title using HTML `<em>Title of
Work</em>` syntax.

`description`
: This is a short one-or-two sentence description of the artifact that should
provide context and explain its significance to the asexual community (i.e. why
it's in the archive). This is the description that will appear below each
artifact title in the list of artifacts.

`longDescription`
: If you want to provide more context that you can fit in `description`, you
can optionally provide a longer description that will appear in the page for
the artifact. This field can be ommitted, in which case it will just be the
same as `description`.

`date`
: This is the timestamp in `YYYY-MM-DDTHH:MM:SS` format for when the artifact
file was first created.

`lastmod`
: This is the date and time the artifact file was last modified. If you're
adding a new artifact, this should be the same as `date`. If you're updating an
existing artifact file, you should update this.

`draft`
: You can leave this alone.

`menu`
: You can leave this alone.

`files`
: This section contains a list of references to the files associated with the
artifact. We'll cover adding files to artifacts [in more detail later]({{< ref
"docs/contributing/uploading-files.md" >}}).

`files.name`
: The name of the file. This will appear in the list of files on the website; it
doesn't need to be a valid Windows/macOS/Linux file name and it doesn't need to
be unique. If the artifact consists of multiple works, this should generally be
the title of the work so people can disambiguate them. If the artifact consists
of a single work, it can just be something short like "Book", "Paper", etc. You
should also generally provide some information about the format of the work,
like specifying whether the file is a PDF or a plain text transcription.

`files.mediaType`
: This is an optional IANA media type (also called a MIME type) for the file.
If the file is a format that doesn't have a well-known media type, you can omit
this. If you need help figuring out the media type of a file, you can use a
tool like [mimetype.io](https://mimetype.io/) to look it up.

`files.filename`
: This is a file name for the file to be used when downloading it, meaning it
must always be a valid Windows/macOS/Linux file name. Generally snake-case is
preferred.

`files.cid`
: This is the IPFS CID of the file, which we'll talk about [in a later
section]({{< ref "docs/contributing/uploading-files.md#what-is-a-cid" >}}).

`people`
: This is a list of (usually 1-3) people closely associated with the artifact,
such as the author of a book, the subject of a photo, etc. This is helpful for
linking together different artifacts which are associated with the same people.
If a person already exists in the archive, you should use the name as it
currently appears in other artifact files and on the website. Please respect
the privacy of individuals and use handles or usernames when that person
typically goes by a pseudonym online. Also, if a person has a preferred name,
**always** use their preferred name over their legal name or deadname. This
list can be empty if the people associated with the artifact aren't clear.

`identities`
: A list of queer identities associated with the artifact. For example, if this
is a blog post about aromanticism, then "aromantic" should be included in the
list of identities. Note that Ace Archive is for hosting content of importance
to aspec communities as a whole, and artifacts do not strictly have to involve
asexuality. The identity should be in adjective form, meaning it can complete
the sentence, "Artifacts about _ people". If an identity already exists in the
archive, prefer using it as it currently appears. This list can be empty if the
identities associated with the work aren't clear (e.g. it's about queer
identities as a whole).

`years`
: The year the work associated with the artifact was published (or written,
posted, etc.). If the artifact encompasses multiple works, this can be a range
of years using a hyphen (e.g. 1987-1999).

`decades`
: This should be the same as `years`, but in the form of a list of decades. For
example, if `years` is "1980-1999", this should be `["1980", "1990"]`.
