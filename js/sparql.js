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
function getResultUrl(date, notfamous, range) {
  range = range || 3;
  // Check for famous people.
  let lc = notfamous ? "1" : "50";

  // Create start/end dates.


  const sparql =
    "SELECT DISTINCT ?item ?itemLabel ?picture ?pubdate ?wikipedia_article WHERE { \n" +
      "?item wdt:P31 wd:Q11424. \n" +
      "?item wdt:P18 ?picture. \n" +
      "?item wdt:P577 ?pubdate. \n" +
      'FILTER((?pubdate >= "'+startDate+'T00:00:00Z"^^xsd:dateTime) && (?pubdate <= "'+endDate+'T00:00:00Z"^^xsd:dateTime)) \n' +
      "?item wikibase:sitelinks ?linkcount . \n" +
      "FILTER (?linkcount > 50) . \n" +
      'SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". } \n' +
      "?wikipedia_article schema:about ?item . \n" +
      "?wikipedia_article schema:isPartOf <https://en.wikiquote.org/> . \n" +
    "} \n" +
    "ORDER BY DESC(?linkcount) \n" +
    "LIMIT 50";

  return wdk.sparqlQuery(sparql);
}

window.getResultUrl = getResultUrl;
