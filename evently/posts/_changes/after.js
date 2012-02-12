function(data) {
  // center images
  $('#posts li.entry:lt('+data.rows.length+') div.body img,iframe').each(function() {
    var $i = $(this)
    if ($i.length && !$i.hasClass('type-icon')) {
      var $center = $("<div class='center'></div>")
      $i.replaceWith($center.append($i.clone()))
    }
  })
}
