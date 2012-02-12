function() {
  // center images
  $('#posts li.entry:first div.body img,iframe').each(function() {
    var $i = $(this)
    if ($i.length && !$i.hasClass('type-icon') && !$i.parent().hasClass('center')) {
      var $center = $("<div class='center'></div>")
      $i.replaceWith($center.append($i.clone()))
    }
  })
}
