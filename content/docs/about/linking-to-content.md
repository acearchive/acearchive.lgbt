---
title: "Linking to content"
description: "How to link to content on Ace Archive"
lead: ""
date: 2022-02-19T10:43:48-05:00
lastmod: 2022-02-19T10:43:48-05:00
draft: false
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

These permalinks are more properly called IPFS gateway URLs, which you can
learn all the juicy technical details about
[here](https://docs.ipfs.io/concepts/ipfs-gateway/). An IPFS gateway URL
usually looks something like this:

```
https://bafybeihsf4562gmmyoya7eh5buxv65lqcdoil3wsi5jf5fceskap7yzooi.ipfs.dweb.link/?filename=the-asexual-manifesto.pdf
```

## Linking to Ace Archive

When you click on the name of a file hosted on Ace Archive, it will have an
IPFS gateway URL like the one above. If you want to link directly to a file
hosted on Ace Archive, you should use the IPFS gateway URL in your address bar.
Another advantage of IPFS gateway URLs is that the content they point to can
never change, so you can be sure that the URL will always point to the file you
see in your browser.

{{< alert icon="❗" >}}
Usually on the web, it's good practice to check the domain name of a URL to see
if you can trust it. For example, all `acearchive.lgbt` URLs are guaranteed to
belong to Ace Archive. However, anyone can create an IPFS gateway URL, so just
because a URL has the domain name `dweb.link` doesn't mean you can trust it.
{{< /alert >}}
