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
weight: 203
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

{{< highlight yaml >}}
---
version: 1
title: "<em>The Asexual Manifesto</em>"
description: >
    A paper by the Asexual Caucus of the New York Radical Feminists
files:
  - name: "Digital Scan"
    mediaType: "application/pdf"
    filename: "the-asexual-manifesto.pdf"
    cid: "bafybeihsf4562gmmyoya7eh5buxv65lqcdoil3wsi5jf5fceskap7yzooi"
  - name: "Transcript"
    mediaType: "text/html"
    cid: "bafybeiakup4b3mjmzw7mjq3ptnv3dqusdebskra2jic73u74nhbizgu3wi"
links:
  - name: "Internet Archive"
    url: "https://archive.org/details/asexualmanifestolisaorlando"
  - name: "Background and Context"
    url: "https://asexualagenda.wordpress.com/2019/08/01/lisa-orlando-author-of-the-asexual-manifesto-1972/"
people: ["Lisa Orlando", "Barbara Getz"]
identities: ["asexual"]
fromYear: 1972
decades: [1970]
---
{{< /highlight >}}

## URL slugs

First, a note about URL slugs. Every artifact in the repository has a URL like
`/artifact/orlando-the-asexual-manifesto`. When you add a new artifact, you
will need to choose a URL slug for it.

A URL slug should always be kebab-case, and will generally follow the format
`author-title`. If the author has a first and last name (i.e. isn't a handle or
username), you can just use the last name. If the title of the work is long,
you can use a shortened version of it. If there is no obvious author associated
with the work, you can just use the title.

If the combination of the author and the title of the work is ambiguous, (such
as a forum thread where the title of the thread might just be "asexuality"),
then you can provide additional context like `context-author-title`. For an
AVEN forum thread by "coolasexualperson" called "romance", the URL slug might
be `aven-forums-coolasexualperson-romance`.

## Artifact fields

Next, we'll talk about the fields in an artifact file. Also take a look at the
[best practices]({{< ref "docs/contributing/best-practices.md" >}}) section for
more information on how to fill out these fields.

{{% schema %}}

{{% schema-field field="version" type="integer" optional="false" %}}
Sometimes the format of artifact files changes. This is the version number for
the artifact file format. This will be set to the current version when you
[open a pull request]({{< ref "docs/contributing/pull-request.md"
>}}), so you can leave it alone.
{{% /schema-field %}}

{{% schema-field field="title" type="string" optional="false" %}}
This is the title of the artifact. If the artifact represents a work (a book,
essay, forum thread, etc.), this will be the title of that work. If the
artifact encompasses multiple works or doesn't have an obvious title, it can be
a short description instead. You should always quote or italicize the titles of
works, and you can add italics in an artifact title using HTML `<em>Title of
Work</em>` syntax.
{{% /schema-field %}}

{{% schema-field field="description" type="string" optional="false" %}}
This is a short, one sentence description of the artifact that should provide
context and explain its significance to the asexual community (i.e. why it's in
the archive). This is the description that will appear below each artifact
title in the list of artifacts. This description should complete the sentence
"This artifact is..."
{{% /schema-field %}}

{{% schema-field field="longDescription" type="string" optional="true" %}}
If you want to provide more context that you can fit in `description`, you can
optionally provide a longer description that will appear in the page for the
artifact. This field can be omitted, in which case it will just be the same as
`description`.
{{% /schema-field %}}

{{% schema-field field="files" type="list of dictionaries" optional="true" %}}
This section contains a list of references to the files associated with the
artifact. We'll cover adding files to artifacts [in more detail later]({{< ref
"docs/contributing/uploading-files.md" >}}).
{{% /schema-field %}}

{{% schema-field field="files.name" level="1" type="string" optional="false" %}}
The name of the file. This will appear in the list of files on the website and
it doesn't need to be a valid Windows/macOS/Linux file name. If the artifact
consists of multiple works, this should generally include the title of the work
so people can disambiguate them. If the artifact consists of a single work, it
can be something short like "Paper," "Transcript," "Citation," etc.
{{% /schema-field %}}

{{% schema-field field="files.mediaType" level="1" type="string" optional="true" %}}
This is an optional IANA media type (also called a MIME type) for the file.  If
the file is a format that doesn't have a well-known media type, you can omit
this. If you need help figuring out the media type of a file, you can use a
tool like [mimetype.io](https://mimetype.io/) to look it up.
{{% /schema-field %}}

{{% schema-field field="files.filename" level="1" type="string" optional="true" %}}
This is a file name to be used when downloading the file, meaning it must
always be a valid Windows/macOS/Linux file name. Generally kebab-case is
preferred, and you should always add an appropriate file extension. If the
content isn't a single file (e.g. it's a web page consisting of multiple HTML
and CSS files), you should omit this.
{{% /schema-field %}}

{{% schema-field field="files.cid" level="1" type="string" optional="false" %}}
This is the IPFS CID of the file, which we'll talk about [in a later
section]({{< ref "docs/contributing/uploading-files.md#what-is-a-cid" >}}).
{{% /schema-field %}}

{{% schema-field field="links" type="list of dictionaries" optional="true" %}}
This section contains a list of links to content on the legacy web. Sites
linked here aren't part of the IPFS network, but it's still useful to be able
to provide links so people can locate the original source of an artifact or for
cases where we can't re-host content for copyright reasons.
{{% /schema-field %}}

{{% schema-field field="links.name" level="1" type="string" optional="false" %}}
The name of the link. This should indicate what the link points to.
{{% /schema-field %}}

{{% schema-field field="links.url" level="1" type="string" optional="false" %}}
The `https://` URL that the link points to.
{{% /schema-field %}}

{{% schema-field field="people" type="list of strings" optional="false" %}}
This is a list of (usually 1-3) people closely associated with the artifact,
such as the author of a book, the subject of a photo, etc. This is helpful for
linking together different artifacts which are associated with the same people.
This list can be empty if the people associated with the artifact aren't clear.
{{% /schema-field %}}

{{% schema-field field="identities" type="list of strings" optional="false" %}}
A list of queer identities associated with the artifact. For example, if this
is a blog post about aromanticism, then "aromantic" should be included in the
list of identities. The identity should be in adjective form, meaning it can
complete the sentence, "Artifacts about _ people". This list can be empty if
the identities associated with the work aren't clear (e.g. it's about queer
identities as a whole).
{{% /schema-field %}}

{{% schema-field field="fromYear" type="integer" optional="false" %}}
The year the work associated with the artifact was published (or written,
posted, etc.). If the artifact encompasses multiple works that were published
in different years, you should specify a range of years using this field and
`toYear`.
{{% /schema-field %}}

{{% schema-field field="toYear" type="integer" optional="true" %}}
This value can be used with `fromYear` to specify a range of years. If the
works associated with the artifact were only published in one year, this should
be omitted.
{{% /schema-field %}}

{{% schema-field field="decades" type="list of integers" optional="false" %}}
The list of decades between `fromYear` and `toYear`. For example, if `fromYear`
is 1980 and `toYear` is 1999, this should be `[1980, 1990]`.
{{% /schema-field %}}

{{% /schema %}}
