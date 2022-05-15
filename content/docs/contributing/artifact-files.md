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
repository. An artifact file holds metadata about the artifact, including the
files and links associated with it. All you have to do to add content to the
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
people: ["Lisa Orlando", "Barbara Getz"]
identities: ["asexual"]
fromYear: 1972
decades: [1970]
---
{{< /highlight >}}

## URL slugs

{{% artifact-docs "slugs" %}}

## Artifact fields

Next, we'll talk about the fields in an artifact file. Also take a look at the
[best practices]({{< ref "docs/contributing/best-practices.md" >}}) section for
more information on how to fill out these fields.

{{% artifact-schema %}}
