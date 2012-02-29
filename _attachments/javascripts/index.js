$.couch.app(function(app) {
  var $nav = $('#nav-header'),
      $nav_home = $nav.find('a:first'),
      $posts = $('#posts')

  if (!$.couch.app.ddoc.getSubscription())
    $nav_home.addClass('nav-selected')

  $posts.evently(app.ddoc.evently.posts, app)

  var template = $.couch.app.ddoc.evently.posts._changes.mustache,
      loader = '<img id="loader" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAFACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>',
      bottomPixels = 768, fireDelay = 256, fired = false, ceaseFire = false,
      date, prev_date

  var scrollFun = function() {
    if (ceaseFire)
      return // scroll will still get called, but nothing will happen

    var is_scrollable = $(document).height() - $(window).height() <= $(window).scrollTop() + bottomPixels

    if (is_scrollable && fired != true) {
      fired = true


      var date, start, end, url,
          query = $.couch.app.ddoc.evently.posts._changes.query,
          $last_entry = $posts.find('li.entry:last')

      if ($last_entry.length === 0) {
        date = "3012-12-12T23%3A59%3A59.999Z"
      } else {
        $last_entry.after('<div id="endless_scroll_loader">' + loader + '</div>')
        date = $last_entry.data('date')
      }

      if (!prev_date || date === prev_date) {
        if (query.view === 'recent-posts') {
          start = 'startkey="' + date + '"&startkey_docid=' + '"' + $last_entry.attr('id') + '"'
        } else {
          start = 'startkey=["' + query.startkey[0] + '","' + date + '"]' + '&startkey_docid=' + '"' + $last_entry.attr('id') + '"'
        }
      } else {
        if (query.view === 'recent-posts') {
          start = 'skip=1&startkey="' + date + '"'
        } else {
          start = 'skip=1&startkey=["' + query.startkey[0] + '","' + date + '"]'
        }
      }
      prev_date = date

      if (query.view === 'recent-posts') {
        end = 'endkey="' + query.endkey + '"'
      } else {
        end = 'endkey=["' + query.endkey[0] + '","' + query.endkey[1] + '"]'
      }

      $.ajax({
        url: '_view/' + query.view + '?descending=true&limit=' + query.limit + '&' + start + '&' + end,
        dataType: 'json',
        complete: function(xhr, status) {
          if (status === 'success') {
            var data = $.parseJSON(xhr.responseText)
            if (data && data.rows) {
              ceaseFire = (data.offset == data.total_rows || data.rows.length < 8)
              $last_entry.after('<div id="endless_scroll_data">' + $.mustache(template, $.couch.app.ddoc.evently.posts._changes.data(data)) + '</div>')
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
  }

  $(document).scroll(scrollFun)

  var resetView = function() {
    $('*').off()
    $(document).off()
    $(document).scroll(scrollFun)
    $.couch.app.ddoc.evently.posts._changes.query = $.couch.app.ddoc.getQuery()
    $posts.children().remove()
    $posts.evently(app.ddoc.evently.posts, app)
    initPaths()
    return true
  }

  var initPaths = function() {
    $nav.pathbinder('home', '/')
    $nav.on('home', function() {
      $nav_home.addClass('nav-selected')
      resetView()
    })
    $posts.pathbinder('subscriptions', '/subscriptions/:id')
    $posts.on('subscriptions', function() {
      $nav_home.removeClass('nav-selected')
      resetView()
    })
  }

  initPaths()
},
{
  db: 'couch_planet',
  design: 'couch_planet',
  ddoc: $.couch.app.ddoc
})
