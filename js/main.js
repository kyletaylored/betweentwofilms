function cleanFighters(fighters) {
  return fighters.filter(element => {
    if (!element.hasOwnProperty("died")) {
      return element;
    }
  });
}

function formatDate(date) {
  return date.getFullYear()
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
      var startDate = new Date(date - 90 *86400000);
      var endDate =   new Date(date + 90 *86400000);

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
        console.log(data);
        var results = cleanFighters(data.results.bindings);
        console.log(results);
        var fighter = results[Math.floor(Math.random() * results.length)];
        if (typeof fighter !== "undefined") {
          console.log(fighter);
          var fightLink = fighter.wikipedia_article.value;
          var fightPic = resizePhoto(fighter.picture.value);

          var markup =
            '<h2 class="answer">You&apos;re fighting: </h2><br><div class="thumbnail"><img alt="name" src="' +
            fightPic +
            '" style="height: 200px; width: auto; display: block;"><div class="caption"><h3><a target="_blank" href="' +
            fightLink +
            '">' +
            fighter.name.value +
            "</a></h3></div></div>";
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