function cleanFighters(fighters) {
  return fighters.filter(element => {
    if (!element.hasOwnProperty("died")) {
      return element;
    }
  });
}

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

function processMovie(movie) {
  movie.poster = getImdbPoster(movie.imdb.value);
  return movie;
}

function getMovies(movies) {
  movies = filterMovies(movies);
  for (movie in movies) {
    movies[movie] = processMovie(movies[movie]);
  }
  return movies;
}

function filterMovies(movies) {
  var results = [];
  movies = shuffle(movies);
  // Loop twice.
  for (var i = 0; i < 2; i++) {
    results.push(movies.pop());
  }
  return results;
}

function getImdbPoster(id) {
  return "https://img.omdbapi.com/?apikey=" + window.getImdb() + "&i=" + id;
}

/**
 * Format date from birthday.
 * @param  {date} date   [description]
 * @param  {string} method [description]
 * @param  {int} val    [description]
 * @return {string}        [description]
 */
function formatDate(date, method, val) {
  if (method == "add") {
    return moment(date).add(val, "months").format("YYYY-MM-DD");
  }
  return moment(date).subtract(val, "months").format("YYYY-MM-DD");
}

/**
 * Get a smaller version of the photo because some of them are large.
 * @param  {string} link Path to the photo.
 * @return {string}      Updated path to photo.
 */
function resizePhoto(link) {
  return "https://commons.wikimedia.org/w/thumb.php?width=500&f=" + link.substring(link.lastIndexOf('/')+1);
}

(function ($) {

  $(document).ready(function () {
    // Populate years.
    $(function () {
      $('#datetimepicker').datetimepicker({format: 'L'});
    });

    $("#movie-form").submit(function (event) {
      event.preventDefault();
      var $form = $(this);
      var $arena = $(".fighter");
      var date = $("#birthday", $form).val();
      var notfamous = $("#notfamous", $form).prop("checked");

      console.log("year", date);
      console.log("notfamous", notfamous);

      var date =      new Date(date);
      var startDate = formatDate(date, "subtract", 6);
      var endDate =   formatDate(date, "add", 6);

      console.log("date", date);
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
        var movies = getMovies(data.results.bindings);
        console.log(movies);
        if (typeof movies !== "undefined") {
          // var fightLink = fighter.wikipedia_article.value;
          // var fightPic = resizePhoto(fighter.picture.value);
          for (var i = 0; i < movies.length; i++) {
            var title = movies[i].itemLabel.value;
            var link = "https://www.imdb.com/title/" + movies[i].imdb.value;
            var poster = movies[i].poster;
            movies[i] = '<div class="thumbnail"><img alt="name" src="'+poster+'" style="height: 200px; width: auto; display: block;"><div class="caption"><h3><a target="_blank" href="'+link+'">'+title+"</a></h3></div></div>";
          }

          var markup = '<h2 class="answer">You&apos;re born between: </h2><br>';
          markup += "<div class='row'>"
          markup += "<div class='col-md-5'>"+movies[0]+"</div>"
          markup += "<div class='col-md-2'><span class='text-large'><big>&amp;</big></span></div>"
          markup += "<div class='col-md-5'>"+movies[1]+"</div>"
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