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
weight: 30
---

## What is a CID?

When you create an artifact file, you need to specify something called a CID
for each file in the artifact. A CID is a sort of permalink to content stored
on the IPFS network. What makes a CID different from a URL is that a URL tells
you *where* you can find something, which may change if the content moves. A
CID allows you to find something no matter where on the IPFS network it's
stored.  You can read more about CIDs in the [IPFS
documentation](ipns://docs.ipfs.io/concepts/content-addressing/).

When contributing to the archive, instead of providing a URL to the content,
you provide a CID. When your pull request is merged, the files will be
downloaded from the IPFS network and uploaded to Ace Archive storage.

However, since most content is not on IPFS yet, you will most likely have to
host the content on the IPFS network yourself. You only need to host the files
until your PR is merged and the files can be uploaded to the Ace Archive
storage.

## Hosting files

So how do you host files on the IPFS network? You *could* run a local IPFS node
and host them on your local machine, but this has two problems:

1. There are some important [privacy
   implications](https://docs.ipfs.io/concepts/privacy-and-encryption/) when
   running your own IPFS node.
2. The content needs to be available on the network when the PR is merged so it
   can be uploaded to the Ace Archive storage. If your local node is offline
   when the PR is merged, the content won't be uploaded.

It's better to use an IPFS pinning service like
[Pinata](https://www.pinata.cloud/) or [Web3.Storage](https://web3.storage).
Both of these services are free or offer a free tier. All you have to do is
create an account, upload the files using the web interface, and copy the
provided CIDs into the artifact file. Once your PR is merged and the files have
been uploaded to Ace Archive storage, you can stop hosting them if you want.

An important node with Web3.Storage is that, by default, it wraps uploaded
files in a directory. After you upload, you'll want to navigate into that
directory and get the CID of the file instead of the CID of the directory.
