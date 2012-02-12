$.couch.app(function(app) {
  $("#posts").evently(app.ddoc.evently.posts, app)

  var ceaseFire = false

  var scrollFun = function() {
    if (ceaseFire)
      return false

    var $last_entry = $("#posts li.entry:last")

    if (!this.prev_date)
      this.prev_date = $last_entry.data('date')

    var date = $last_entry.data("date"),
        startkey = '"' + date + '"',
        endkey = '"0000-01-01T00%3A00%3A00.000Z"'

    if (date === this.prev_date) {
      var docid = $last_entry.attr("id")
      startkey = startkey + '&startkey_docid=' + '"' + docid + '"'
    }
    this.prev_date = date

    var url = "_view/recent-posts?descending=true&limit=5&skip=1&startkey=" + startkey + "&endkey=" + endkey
    $.ajax({
      url : url,
      dataType: 'json',
      success: function(data) {
        if (data && data.rows) {
          ceaseFire = (data.offset == data.total_rows || data.rows.length < 4)
          data.rows.forEach(function(entryObj) {
            var entry = entryObj.value, enclosure = '', newEntry
            if (entry.enclosure) {
              enclosure = '<p class="enclosure"><img class="type-icon"' +
                          ' src="images/audio.png"/> <a href="' +
                          entry.enclosure_link + '">' + entry.enclosure +
                          '</a></p>'
            }
            newEntry = $('<li id="' + entry.link + '" data-date="' +
                        entry.date + '" class="entry"><h3><a href="' +
                        entry.providerUrl + '">' + entry.providerName +
                        '</a></h3><h4><a href="' + entry.link + '">' +
                        entry.title + '</a></h4>' + '<div class ="body">' +
                        entry.body + enclosure + '<p class="by">by ' +
                        entry.author + ', <span class="date">' +
                        $.prettyDate(entry.date) + '</span></p></div></li>')
            newEntry.find('div.body img,iframe').each(function() {
              var $i = $(this)
              if ($i.length && !$i.hasClass('type-icon')) {
                $i.replaceWith($("<div class='center'></div>").append($i.clone()))
              }
            })
            $('#posts').append(newEntry)
          })
        }
        return false
      }
    })
    return false
  }

  $(document).endlessScroll({
    bottomPixels: 256,
    fireDelay: 128,
    callback: scrollFun,
    loader: '<img id="loader" src="images/loading.gif"/>',
    insertAfter: "#posts li.entry:last",
    ceaseFire: function() { return ceaseFire }
  })
})
