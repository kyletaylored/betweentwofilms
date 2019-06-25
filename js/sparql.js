const wdk = require("wikibase-sdk")({
  instance: "https://www.wikidata.org",
  sparqlEndpoint: "https://query.wikidata.org/sparql"
});

/**
 * Returns the URL to fetch for the JSON results from Wikimedia
 * @param {string} date The birth date.
 * @param {boolean} notfamous If you don't care about famous movies.
 * @param {int} range The number of months to give a range. 3 by default.
 */
function getResultUrl(start, end, notfamous) {
  // Check for famous people.
  let lc = notfamous ? "1" : "50";

  const sparql =
    "SELECT DISTINCT ?item ?itemLabel ?imdb ?wikipedia_article WHERE { \n" +
      "?item wdt:P31 wd:Q11424. \n" +
      "?item wdt:P345 ?imdb. \n" +
      "?item wdt:P577 ?pubdate. \n" +
      'FILTER((?pubdate >= "'+ start +'T00:00:00Z"^^xsd:dateTime) && (?pubdate <= "'+ end +'T00:00:00Z"^^xsd:dateTime)) \n' +
      "?item wikibase:sitelinks ?linkcount . \n" +
      "FILTER (?linkcount > " + lc + ") . \n" +
      'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } \n' +
      "?wikipedia_article schema:about ?item . \n" +
      "?wikipedia_article schema:isPartOf <https://en.wikipedia.org/> . \n" +
    "} \n" +
    "ORDER BY DESC(?linkcount) \n" +
    "LIMIT 50";

  return wdk.sparqlQuery(sparql);
}

function getImdb() {
  return "76df3652";
}

// Global functions
window.getResultUrl = getResultUrl;
window.getImdb = getImdb;