import * as IPFS from "ipfs-core";
import { CID, isIPFS } from "ipfs-core";

const ipfsPathPrefix = "/ipfs/";
const ipnsPathPrefix = "/ipns/";
const timeoutMillis = 60_000;
const maxTimeoutTries = 3;

const parseInputToIpfsPath = (maybeUrlOrCidOrPath) => {
  if (isIPFS.path(maybeUrlOrCidOrPath)) {
    return maybeUrlOrCidOrPath;
  }

  if (isIPFS.cid(maybeUrlOrCidOrPath) || isIPFS.cidPath(maybeUrlOrCidOrPath)) {
    return ipfsPathPrefix + maybeUrlOrCidOrPath;
  }

  if (isIPFS.ipfsSubdomain(maybeUrlOrCidOrPath)) {
    const url = new URL(maybeUrlOrCidOrPath);
    const cid = url.hostname.split(".", 2)[0];
    return ipfsPathPrefix + cid;
  }

  if (isIPFS.ipnsSubdomain(maybeUrlOrCidOrPath)) {
    const url = new URL(maybeUrlOrCidOrPath);
    const cid = url.hostname.split(".", 2)[0];
    return ipnsPathPrefix + cid;
  }

  if (isIPFS.ipfsUrl(maybeUrlOrCidOrPath) || isIPFS.ipnsUrl(maybeUrlOrCidOrPath)) {
    const url = new URL(maybeUrlOrCidOrPath);
    return url.pathname;
  }

  return undefined;
};

const resolveIpfsPath = async (ipfs, ipfsPath) => {
  const resolvedIpfsPath = await ipfs.resolve(ipfsPath, {
    recursive: true,
    timeout: timeoutMillis,
  });

  return CID.parse(resolvedIpfsPath.slice(ipfsPathPrefix.length));
};

const loadIpfs = (() => {
  const ipfsPromise = IPFS.create();
  return () => ipfsPromise;
})();

const retryOnTimeout = async (func) => {
  let timesAttempted = 0;

  for (;;) {
    try {
      timesAttempted++;
      return await func();
    } catch (e) {
      console.log(e);
      if (e.code === "ERR_TIMEOUT" && timesAttempted < maxTimeoutTries) continue;
      throw e;
    }
  }
};

const normalizeCid = async (maybeUrlOrCidOrPath) => {
  const ipfsPath = parseInputToIpfsPath(maybeUrlOrCidOrPath);
  if (ipfsPath === undefined) {
    return {
      message: "Must be a valid CID or URL.",
    };
  }

  const ipfs = await loadIpfs();

  try {
    const resolvedCid = await retryOnTimeout(() => resolveIpfsPath(ipfs, ipfsPath));

    // If the CID is a directory containing only a single file, return the CID of
    // that file. By default, Web3.Storage wraps uploaded files in a directory,
    // but in artifact files, we want to link to the file itself rather than the
    // directory. Web3.Storage doesn't make it easy to find the CID of the file
    // without explaining the syntax of gateway URLs to users, so instead, we opt
    // to allow users to enter the directory CID that Web3.Storage gives them and
    // fix it ourselves.
    const fileStats = await retryOnTimeout(() =>
      ipfs.files.stat(resolvedCid, { timeout: timeoutMillis })
    );
    if (fileStats.type === "directory" && fileStats.blocks === 1) {
      const links = await retryOnTimeout(() =>
        ipfs.object.links(resolvedCid, { timeout: timeoutMillis })
      );
      return { result: links[0].Hash };
    }

    return { result: resolvedCid };
  } catch (e) {
    return {
      message:
        "Timed out trying to find the file. Check that you entered the correct CID or URL and try again.",
    };
  }
};

export default normalizeCid;
