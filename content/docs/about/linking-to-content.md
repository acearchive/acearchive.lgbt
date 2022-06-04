---
title: "Linking to content"
description: "How to link to content on Ace Archive"
date: 2022-02-19T10:43:48-05:00
menu:
  docs:
    parent: "about"
weight: 103
---

## IPFS permalinks

We mention in {{< article "docs/about/about-the-technology.md" >}} that Ace
Archive uses special permalinks that allow you to link to content whether it's
hosted on Ace Archive or somewhere else. This means that anyone can help host
the content on Ace Archive, and as long as *someone* is hosting it, those links
won't die, even if this site goes down or becomes defunct.

These permalinks (technically called [IPFS gateway
URLs](https://docs.ipfs.io/concepts/ipfs-gateway/)) usually look something like
this:

<https://bafybeihsf4562gmmyoya7eh5buxv65lqcdoil3wsi5jf5fceskap7yzooi.ipfs.dweb.link/?filename=the-asexual-manifesto.pdf>

{{< alert icon="❗" >}}
Usually on the web, it's good practice to check the domain name of a URL to see
if you can trust it. For example, all `acearchive.lgbt` URLs are guaranteed to
belong to Ace Archive. However, anyone can create an IPFS gateway URL, so just
because a URL has the domain name `dweb.link` doesn't mean you can trust it.
{{< /alert >}}

## Linking to Ace Archive

When you click on the name of a file hosted on Ace Archive, it will have an
IPFS permalink like the one above. That URL will always point to the same
version of the file, even if on the Ace Archive website it's removed or
replaced with a newer version.

You can also link to an artifact page like this:

<https://acearchive.lgbt/artifact/orlando-the-asexual-manifesto/>

However, these links are not IPFS permalinks. But they do allow you to see
related files and links, along with other context for the artifact.
