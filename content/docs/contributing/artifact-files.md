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
weight: 206
---

{{< alert icon="👉" >}}
This page describes a more technical approach for contributing content to Ace
Archive. If you're not familiar with YAML or git, using [this form]({{<
ref "new-artifact/index.md" >}}) is the easiest way to contribute an artifact to
the repository. All the documentation on this page is also available on that
form.
{{< /alert >}}

Every artifact in the archive has an *artifact file* associated with it in the
git repo. An artifact file holds metadata about the artifact, including the
files and links associated with it.

An artifact file is a markdown document containing a YAML front matter block,
however no content goes in the body of the markdown file, so you can just think
of it as a YAML file with a leading and trailing `---` line.

Artifact files are stored in
the [`acearchive/artifacts`](https://github.com/acearchive/artifacts)
repo. The file name of the artifact file is the URL slug of the artifact.

Generally an artifact file will look something like this:

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

{{% schema-description "slug" %}}

## Schema

Next, we'll look at the schema of artifact files. Also take a look at the
[best practices]({{< ref "docs/contributing/best-practices.md" >}}) section for
more information on how to fill out these fields.

{{% artifact-schema %}}
