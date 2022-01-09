---
title: "Hosting artifacts on Web3"
description: "How you can help host the archive"
lead: ""
date: 2022-01-08T09:34:52-05:00
lastmod: 2022-01-08T09:34:52-05:00
draft: false
menu:
  docs:
    parent: "contributing"
weight: 207
---

We mention in ["About Web3"]({{< ref "docs/about/about-web3.md" >}}) that
anyone can help host the content on Ace Archive. But how do you actually do
that? This page will explain how you can help preserve ace history.

There are two main ways to host content on the IPFS network. The first is to
host it yourself from your own local machine, and the second is to use a
hosting service.

## Hosting yourself

The idea behind IPFS is that instead of the web being hosted in a few massive
data centers, everyone holds a little piece of the web on their own computers.
You can join the IPFS network and help host the content on Ace Archive that's
important to you!

It's important to note that content you host yourself is only available to
other people while your device is online, but the more more devices there are
hosting the content, the more likely it is that at least some of them are
online at a given time.

{{< alert icon="❗" >}}
If you're going to run your own IPFS node, there are some important [privacy
implications](https://docs.ipfs.io/concepts/privacy-and-encryption/) you may
want to be aware of.
{{< /alert >}}

To get started hosting content on the IPFS network, you'll want to install
[IPFS Desktop](https://docs.ipfs.io/install/ipfs-desktop/).

Every file stored in Ace Archive has a long string of letters called a CID
associated with it, which you can see when you click on an artifact on the
website. To host a file on your local machine, just go to the "Files" page in
the IPFS Desktop app, select "Import" > "From IPFS", and then paste the CID
into the field.

After that, you're done!

## Using a hosting service

Instead of or in addition to hosting content on your local machine, you can use
a hosting service that supports IPFS, which are commonly called "pinning
services." There are a number of free and paid pinning services available,
including:

- [Web3.Storage](https://web3.storage)
- [Pinata](https://www.pinata.cloud/)
- [Eternum](https://www.eternum.io)
- [Fleek](https://fleek.co/storage/)
- [Temporal](https://temporal.cloud/)
- [Infura](https://infura.io/)
- [Crust](https://crust.network/)

Ace Archive uses Web3.Storage to host all content uploaded to the archive, but
the more places the content is hosted, the healthier the archive will be!

Much like with hosting content yourself, you'll need the CID of a file in order
to host it elsewhere, which you can find on the archive next to each file.

## Bulk hosting

Currently, helping to host content on Ace Archive is a somewhat labor-intensive
process, requiring copying CIDs one-by-one from the website. We're looking into
finding ways to make it easier to host large amounts of content from the
archive. Stay tuned!
