import FlexSearch from "flexsearch";
import * as params from "@params";
import artifactsData from "artifacts.json";
import showdown from "showdown";

function inputFocus(e, search, suggestions) {
  if (e.ctrlKey && e.key === "/") {
    e.preventDefault();
    search.focus();
  }

  if (e.key === "Escape") {
    search.blur();
    suggestions.classList.add("d-none");
  }
}

function rangeYears(fromYear, toYear) {
  if (toYear === null || toYear === undefined) {
    return [fromYear]
  } else {
    return Array.from(new Array(toYear - fromYear + 1), (_, i) => i + fromYear)
  }
}

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toTitle(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function acceptSuggestion(suggestions) {
  while (suggestions.lastChild) {
    suggestions.removeChild(suggestions.lastChild);
  }

  return false;
}

function showResults(index, search, suggestions) {
  const maxResult = 10;

  const value = search.value;
  const results = index.search(value, { limit: maxResult, enrich: true });

  suggestions.classList.remove("d-none");
  suggestions.innerHTML = "";

  //flatSearch now returns results for each index field. create a single list
  const flatResults = {}; //keyed by href to dedupe results
  results.forEach(result => {
    result.result.forEach(r => {
      flatResults[r.doc.href] = r.doc;
    });
  });

  //construct a list of suggestions list
  for (const href in flatResults) {
    const doc = flatResults[href];

    const entry = document.createElement("div");
    entry.innerHTML = "<a href><span></span><span></span></a>";

    entry.querySelector("a").href = href;
    entry.querySelector("span:first-child").innerHTML = doc.title;
    entry.querySelector("span:nth-child(2)").innerHTML = doc.summary;

    suggestions.appendChild(entry);
    if (suggestions.childElementCount === maxResult) break;
  }
}

function suggestionFocus(e, suggestions) {
  const focusableSuggestions = suggestions.querySelectorAll("a");
  const focusable = [...focusableSuggestions];
  const index = focusable.indexOf(document.activeElement);

  const keyDefault = suggestions.classList.contains("d-none");

  let nextIndex = 0;

  if ((e.keyCode === 38) && (!keyDefault)) {
    e.preventDefault();
    nextIndex = index > 0 ? index - 1 : 0;
    focusableSuggestions[nextIndex].focus();
  } else if ((e.keyCode === 40) && (!keyDefault)) {
    e.preventDefault();
    nextIndex = index + 1 < focusable.length ? index + 1 : index;
    focusableSuggestions[nextIndex].focus();
  }
}

function indexArchiveSearch(search, suggestions) {
  const index = new FlexSearch.Document({
    tokenize: "forward",
    cache: 100,
    document: {
      id: "id",
      store: ["href", "title", "summary"],
      index: ["title", "summary", "description", "years", "identities", "people"],
    },
  });

  const mdConverter = new showdown.Converter();

  for (const artifact of artifactsData) {
    index.add({
      id: `artifact/${artifact.id}`,
      href: new URL(artifact.url).pathname,
      title: mdConverter.makeHtml(artifact.title),
      summary: mdConverter.makeHtml(artifact.summary),
      description: artifact.description,
      years: rangeYears(artifact.from_year, artifact.to_year),
      identities: artifact.identities,
      people: artifact.people,
    });
  }

  const people = new Set();
  const identities = new Set();
  const decades = new Set();

  for (const artifact of artifactsData) {
    for (const person of artifact.people) {
      people.add(person);
    }

    for (const identity of artifact.identities) {
      identities.add(identity);
    }

    for (const decade of artifact.decades) {
      decades.add(decade);
    }
  }

  for (const person of people) {
    index.add({
      id: `person/${toSlug(person)}`,
      href: `/categories/people/${toSlug(person)}/`,
      title: person,
      summary: `Artifacts involving ${person}`,
    });
  }

  for (const identity of identities) {
    index.add({
      id: `identity/${toSlug(identity)}`,
      href: `/categories/identities/${toSlug(identity)}/`,
      title: toTitle(identity),
      summary: `Artifacts involving ${identity} people`,
    });
  }

  for (const decade of decades) {
    index.add({
      id: `decade/${decade}`,
      href: `/categories/decades/${decade}/`,
      title: decade,
      summary: `Artifacts from the ${decade}s`,
    });
  }

  search.addEventListener("input", () => showResults(index, search, suggestions), true);
  suggestions.addEventListener("click", () => acceptSuggestion(suggestions), true);
}

function indexDocsSearch(search, suggestions) {
  const index = new FlexSearch.Document({
    tokenize: "forward",
    cache: 100,
    document: {
      id: "id",
      store: ["href", "title", "summary"],
      index: ["title", "summary", "content"],
    },
  });

  const docsPages = params.docsPages;

  for (const [i, page] of docsPages.entries()) {
    index.add({
      id: `docs/${i}`,
      href: new URL(page.url).pathname,
      title: page.title,
      summary: page.summary,
      content: page.content,
    });
  }

  search.addEventListener("input", () => showResults(index, search, suggestions), true);
  suggestions.addEventListener("click", () => acceptSuggestion(suggestions), true);
}

const archiveSearch = document.querySelector("#archive-search > #search");
const archiveSuggestions = document.querySelector("#archive-search > #suggestions");

const docsSearch = document.querySelector("#docs-search > #search");
const docsSuggestions = document.querySelector("#docs-search > #suggestions");

if (docsSearch && docsSuggestions) {
  document.addEventListener("keydown", (e) => inputFocus(e, docsSearch, docsSuggestions));
  document.addEventListener("keydown", (e) => suggestionFocus(e, docsSuggestions));
  document.addEventListener("click", function (event) {
    if (!docsSuggestions.contains(event.target)) {
      docsSuggestions.classList.add("d-none");
    }
  });
  indexDocsSearch(docsSearch, docsSuggestions);
}

if (archiveSearch && archiveSuggestions) {
  document.addEventListener("keydown", (e) => inputFocus(e, archiveSearch, archiveSuggestions));
  document.addEventListener("keydown", (e) => suggestionFocus(e, archiveSuggestions));
  document.addEventListener("click", function (event) {
    if (!archiveSuggestions.contains(event.target)) {
      archiveSuggestions.classList.add("d-none");
    }
  });
  indexArchiveSearch(archiveSearch, archiveSuggestions);
}
