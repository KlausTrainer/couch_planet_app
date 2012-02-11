$(function() {
  // center images
  $('#posts .entry div.body img,iframe').each(function() {
    var $i = $(this)
    if ($i.length && !$i.hasClass('type-icon')) {
      var $center = $("<div class='center'></div>")
      $i.replaceWith($center.append($i.clone()))
    }
  })
})
