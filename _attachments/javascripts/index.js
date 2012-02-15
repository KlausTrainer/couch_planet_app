$.couch.app(function(app) {
  $('#posts').evently(app.ddoc.evently.posts, app)

  var template = $.couch.app.ddoc.evently.posts._changes.mustache,
      loader = '<img id="loader" src="images/loading.gif"/>',
      insertAfter = '#posts li.entry:last',
      bottomPixels = 768, fireDelay = 256, fired = false, ceaseFire = false

  $(document).scroll(function() {
    if (ceaseFire)
      return // scroll will still get called, but nothing will happen

    var is_scrollable = $(document).height() - $(window).height() <= $(window).scrollTop() + bottomPixels

    if (is_scrollable && fired != true) {
      fired = true
      $(insertAfter).after('<div id="endless_scroll_loader">' + loader + '</div>')

      var $last_entry = $('#posts li.entry:last'),
          date = $last_entry.data('date'), start

      if (!this.prev_date || date === this.prev_date) {
        start = 'startkey="' + date + '"' + '&startkey_docid=' + '"' + $last_entry.attr('id') + '"'
      } else {
        start = 'skip=1&startkey="' + date + '"'
      }
      this.prev_date = date

      $.ajax({
        url : url = '_view/recent-posts?descending=true&limit=9&' + start + '&endkey="0000-01-01T00%3A00%3A00.000Z"',
        dataType: 'json',
        complete: function(xhr, status) {
          if (status === 'success') {
            var data = $.parseJSON(xhr.responseText)
            if (data && data.rows) {
              ceaseFire = (data.offset == data.total_rows || data.rows.length < 8)
              $(insertAfter).after('<div id="endless_scroll_data">' + $.mustache(template, $.couch.app.ddoc.evently.posts._changes.data(data)) + '</div>')
              $('div#endless_scroll_data').hide().fadeIn()
              $('div#endless_scroll_data').removeAttr('id')
              $('body').after('<div id="endless_scroll_marker"></div>')
              // slight delay for preventing event firing twice
              $('div#endless_scroll_marker').fadeTo(fireDelay, 1, function() {
                $(this).remove()
              })
            }
          }
          fired = false
          $('div#endless_scroll_loader').remove()
        }
      })
    }
  })
},
{
  db: 'couch_planet',
  design: 'couch_planet',
  ddoc: $.couch.app.ddoc
})
