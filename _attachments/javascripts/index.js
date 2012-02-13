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

    $.ajax({
      url : url = "_view/recent-posts?descending=true&limit=9&skip=1&startkey=" + startkey + "&endkey=" + endkey,
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
                        '<span class="main">' + entry.body + '</span>' +
                        enclosure + '<p class="by">by ' + entry.author +
                        ', <span class="date">' + $.prettyDate(entry.date) +
                        '</span></p></div></li>')
            $('#posts').append(newEntry)
          })
        }
        return false
      }
    })
    return true
  }

  $(document).endlessScroll({
    bottomPixels: 512,
    fireOnce: true,
    fireDelay: 512,
    callback: scrollFun,
    loader: '<img id="loader" src="images/loading.gif"/>',
    insertAfter: "#posts li.entry:last",
    ceaseFire: function() { return ceaseFire }
  })
}, {db: "couch_planet", design: "couch_planet"})
