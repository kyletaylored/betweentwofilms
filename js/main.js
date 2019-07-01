/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

/**
 * Add a movie poster to the movie object.
 * @param  {Object} movie The selected movie object.
 * @return {Object}       The selected movie object with IMDB poster.
 */
function processMovie(movie) {
  movie.poster = getImdbPoster(movie.imdb.value);
  return movie;
}

/**
 * Returns array that contains 2 movies, before and after.
 * @param  {Array} movies A list of movies from Wikidata.
 * @param  {Date}  date   The birthday to filter around.
 * @return {Array}        A list of 2 movies, before and after.
 */
function getMovies(movies, date) {
  movies = filterMovies(movies, date);
  for (movie in movies) {
    movies[movie] = processMovie(movies[movie]);
  }
  return movies;
}

/**
 * Get the movie before your birthday.
 * @param  {Array} movies   A list of movie objects
 * @param  {Date} date      Your birthday in a Date object.
 * @param  {Object} exclude An object to exclude to prevent duplicates.
 * @return {Object}         The selected movie.
 */
function getBefore(movies, date, exclude) {
  var list = {};
  for (var i = 0; i < movies.length; i++) {
    var pub = new Date(movies[i].pubdate.value);
    // Skip same movies.
    if (exclude != null && exclude.imdb.value == movies[i].imdb.value) {
      continue;
    }
    // Check if movie date is before birthday.
    if (moment(pub).isBefore(date)) {
      list[i] = moment(date).diff(pub);
    }
  }
  var min = Object.keys(list).reduce(function(a, b){ return list[a] < list[b] ? a : b });
  return movies[min];
}

/**
 * Get the movie after your birthday.
 * @param  {Array} movies   A list of movie objects
 * @param  {Date} date      Your birthday in a Date object.
 * @param  {Object} exclude An object to exclude to prevent duplicates.
 * @return {Object}         The selected movie.
 */
function getAfter(movies, date, exclude) {
  var list = {};
  for (var i = 0; i < movies.length; i++) {
    var pub = new Date(movies[i].pubdate.value);
    // Skip same movies.
    if (exclude != null && exclude.imdb.value == movies[i].imdb.value) {
      continue;
    }
    // Check if movie date is after birthday.
    if (moment(pub).isAfter(date)) {
      list[i] = moment(date).diff(pub);
    }
  }
  var max = Object.keys(list).reduce(function(a, b){ return list[a] > list[b] ? a : b });
  return movies[max];
}

/**
 * Shuffles and selects 2 movies.
 * @param  {Array} movies A list of movies
 * @param  {Date} date    The birthday to filter around.
 * @return {Array}        An array of 2 movies.
 */
function filterMovies(movies, date) {
  var results = [];
  movies = shuffle(movies);
  var before = getBefore(movies, date);
  var after = getAfter(movies, date, before);
  results.push(before, after);
  return results;
}

/**
 * Adds poster link to movie object.
 * @param  {String} id The IMDB ID of the movie.
 * @return {String}    A link to the movie poster.
 */
function getImdbPoster(id) {
  return "https://img.omdbapi.com/?apikey=" + window.getImdb() + "&i=" + id;
}

/**
 * Format date from birthday.
 * @param  {Date} date   [description]
 * @param  {String} method [description]
 * @param  {Integer} val    [description]
 * @return {String}        [description]
 */
function formatDate(date, method, val) {
  val = val || 3; // Default to 3 months.
  if (method == "add") {
    return moment(date).add(val, "months").format("YYYY-MM-DD");
  }
  if (method == "subtract") {
    return moment(date).subtract(val, "months").format("YYYY-MM-DD");
  }
  return moment(date).format("YYYY-MM-DD");
}

// Main function
(function ($) {

  $(document).ready(function () {
    // Populate years.
    $(function () {
      $('#datetimepicker').datetimepicker({
        format: 'L'
      });
    });

    $("#movie-form").submit(function (event) {
      event.preventDefault();
      var $form = $(this);
      var $arena = $(".fighter");
      var date = $("#birthday", $form).val();
      var notfamous = $("#notfamous", $form).prop("checked");

      console.log("year", date);
      console.log("notfamous", notfamous);

      var date = new Date(date);
      var currentDate = formatDate(date);
      var startDate = formatDate(date, "subtract", 6);
      var endDate = formatDate(date, "add", 6);

      console.log("date", currentDate);
      console.log("start", startDate);
      console.log("end", endDate);

      // Empty arena.
      $arena.html("");

      $(".loading-wrapper").removeClass("hidden");
      var getRes = getResultUrl(startDate, endDate, notfamous);
      console.log(getRes);

      $.ajax({
        url: getRes
      }).done(function (data) {
        $(".loading-wrapper").addClass("hidden");
        console.log("wikidata", data);
        // Get data.
        var movies = getMovies(data.results.bindings, currentDate);
        console.log(movies);
        if (typeof movies !== "undefined") {

          // Process movies
          for (var i = 0; i < movies.length; i++) {
            var title = movies[i].itemLabel.value;
            var link = "https://www.imdb.com/title/" + movies[i].imdb.value;
            var poster = movies[i].poster;
            var date = moment(movies[i].pubdate.value).format("MMMM D, YYYY");
            movies[i] = '<div class="thumbnail text-center"><img alt="name" src="' + poster + '" style="display: block;"><div class="caption"><h3><a target="_blank" href="' + link + '">' + title + "</a><br><small><em>(" + date + ")</em></small></h3></div></div>";
          }

          var markup = '<h2 class="answer">You&apos;re born between: </h2><br>';
          markup += "<div class='flex-wrapper row' style='margin-bottom:1em'>"
          markup += "<div class='col-md-5'>" + movies[0] + "</div>"
          markup += "<div class='amp-wrapper col-md-2'><span class='text-large big-and'><big>&amp;</big></span></div>"
          markup += "<div class='col-md-5'>" + movies[1] + "</div>"
          markup += "</div>"
          $arena.html(markup);
          $("html, body").animate({
            scrollTop: $(document).height()
          }, 1000);
        } else {
          $arena.html(
            "<h2 class='answer'>You're a snowflake, or they're all dead by now (likely).</h2>"
          );
        }
      });
    });
  });
})(jQuery);

function outputUpdate(vol) {
  document.querySelector("#birthyear").value = vol;
}