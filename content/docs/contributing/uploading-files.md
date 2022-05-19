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

This page describes how to include files in an artifact
when [adding an artifact to the archive]({{< ref "new-artifact/index.md" >}}).

As we mention in {{< article "docs/about/about-the-technology.md" >}}, we host
all the files on Ace Archive on the IPFS network. To upload a file to Ace
Archive, you'll need to upload it to an IPFS hosting provider. There are a
number of IPFS hosting providers, but we
recommend [Web3.Storage](https://web3.storage) because it's free and easy to
use.

To include a file in an artifact:

1. Create an account on Web3.Storage. You can use a GitHub account.
2. Go to your account page and upload the file.
3. Find the file you uploaded in the files list.
4. Copy the CID or URL of that file and paste it into the CID field in the
   artifact form.
