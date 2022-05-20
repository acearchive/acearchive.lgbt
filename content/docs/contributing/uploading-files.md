---
title: "Uploading files"
description: "How to upload content to the archive"
lead: ""
date: 2022-01-07T12:40:14-05:00
lastmod: 2022-01-07T12:40:14-05:00
draft: false
menu:
  docs:
    parent: "contributing"
weight: 202
---

This page describes how to include files in an artifact when
[adding a new artifact to the archive]({{< ref "new-artifact/index.md" >}}).

As we mention in {{< article "docs/about/about-the-technology.md" >}}, we host
all the files on Ace Archive on the IPFS network. To upload a file to Ace
Archive, you'll need to upload it to an IPFS hosting provider.

There are a number of IPFS hosting providers, but we
recommend [Web3.Storage](https://web3.storage) because it's free and easy to
use. It requires an account, but you can log in with a GitHub account.

Once you upload the file to Web3.Storage, you can find it in the files list on
your account page. Each file uploaded to Web3.Storage has a long string of
characters called a CID (content identifier) associated with it. You will need
to paste this into the form you fill out when you create a new artifact.

Alternatively, you can open the file in your web browser, copy the `dweb.link`
URL in your address bar, and paste that into the form.
