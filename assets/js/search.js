import FlexSearch from "flexsearch";

function inputFocus(e, search, suggestions) {
    if (e.key === "/") {
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

function acceptSuggestion(suggestions) {
    while (suggestions.lastChild) {
        suggestions.removeChild(suggestions.lastChild);
    }

   return false;
}

function showResults(index, search, suggestions) {
    const maxResult = 5;

    const value = search.value;
    const results = index.search(value, {limit: maxResult, enrich: true});

    suggestions.classList.remove("d-none");
    suggestions.innerHTML = "";

    //flatSearch now returns results for each index field. create a single list
    const flatResults = {}; //keyed by href to dedupe results
    results.forEach(result=>{
        result.result.forEach(r=>{
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
        nextIndex= index > 0 ? index-1 : 0;
        focusableSuggestions[nextIndex].focus();
    } else if ((e.keyCode === 40) && (!keyDefault)) {
        e.preventDefault();
        nextIndex= index+1 < focusable.length ? index+1 : index;
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
            index: ["title", "summary", "description", "content", "years", "identities", "people"],
        },
    });


    {{ $artifactList := (where .Site.RegularPages "Section" "artifacts") -}}
    {{ $artifactLen := (len $artifactList) -}}

    index.add(
    {{- range $index, $element := $artifactList }}{
        id: "{{ printf "artifact-%d" $index }}",
        href: "{{ .RelPermalink }}",
        title: {{ .Title | markdownify | jsonify }},
        summary: {{ .Params.summary | markdownify | jsonify }},
        description: {{ .Params.description | markdownify | jsonify }},
        content: {{ .Content | jsonify }},
        years: rangeYears({{ .Params.fromYear | jsonify }}, {{ .Params.toYear | jsonify }}),
        identities: {{ .Params.identities | jsonify }},
        people: {{ .Params.people | jsonify }},
    })
        {{- if ne (add $index 1) $artifactLen -}}
            .add(
        {{- end -}}
        {{ end -}}
    ;

    {{ $identityList := slice -}}
    {{ range .Site.Taxonomies.identities -}}
        {{ $identityList = $identityList | append .Page -}}
    {{ end -}}
    {{ $identityLen := (len $identityList) -}}

    index.add(
    {{- range $index, $element := $identityList -}}{
        id: "{{ printf "identity-%d" $index }}",
        href: "{{ $element.RelPermalink }}",
        title: {{ $element.Title | title | jsonify }},
        summary: {{ printf "Artifacts involving %s people" $element.Title | jsonify }},
    })
        {{- if ne (add $index 1) $identityLen -}}
            .add(
        {{- end -}}
        {{ end -}}
    ;

    {{ $decadeList := slice -}}
    {{ range .Site.Taxonomies.decades -}}
        {{ $decadeList = $decadeList | append .Page -}}
    {{ end -}}
    {{ $decadeLen := (len $decadeList) -}}

    index.add(
    {{- range $index, $element := $decadeList -}}{
        id: "{{ printf "decade-%d" $index }}",
        href: "{{ $element.RelPermalink }}",
        title: {{ $element.Title | title | jsonify }},
        summary: {{ printf "Artifacts from the %ss" $element.Title | jsonify }},
    })
        {{- if ne (add $index 1) $decadeLen -}}
            .add(
        {{- end -}}
        {{ end -}}
    ;

    {{ $peopleList := slice -}}
    {{ range .Site.Taxonomies.people -}}
        {{ $peopleList = $peopleList | append .Page -}}
    {{ end -}}
    {{ $peopleLen := (len $peopleList) -}}

    index.add(
    {{- range $index, $element := $peopleList -}}{
        id: "{{ printf "person-%d" $index }}",
        href: "{{ $element.RelPermalink }}",
        title: {{ $element.Title | title | jsonify }},
        summary: {{ printf "Artifacts involving %s" $element.Title | jsonify }},
    })
        {{- if ne (add $index 1) $peopleLen -}}
            .add(
        {{- end -}}
        {{ end -}}
    ;

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

    {{ $docsList := (where .Site.Pages "Section" "docs") -}}
    {{ $docsLen := (len $docsList) -}}

    index.add(
    {{- range $index, $element := $docsList -}}{
        id: "{{ printf "doc-%d" $index }}",
        href: "{{ .RelPermalink }}",
        title: {{ .Title | jsonify }},
        summary: {{ .Params.description | jsonify }},
        content: {{ .Content | jsonify }},
    })
        {{- if ne (add $index 1) $docsLen -}}
            .add(
        {{- end -}}
        {{ end -}}
    ;

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
    document.addEventListener("click", function(event) {
        if (!docsSuggestions.contains(event.target)) {
            docsSuggestions.classList.add("d-none");
        }
    });
    indexDocsSearch(docsSearch, docsSuggestions);
}

if (archiveSearch && archiveSuggestions) {
    document.addEventListener("keydown", (e) => inputFocus(e, archiveSearch, archiveSuggestions));
    document.addEventListener("keydown", (e) => suggestionFocus(e, archiveSuggestions));
    document.addEventListener("click", function(event) {
        if (!archiveSuggestions.contains(event.target)) {
            archiveSuggestions.classList.add("d-none");
        }
    });
    indexArchiveSearch(archiveSearch, archiveSuggestions);
}
