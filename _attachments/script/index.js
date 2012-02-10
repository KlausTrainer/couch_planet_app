$.couch.app(function(app) {
  $("#posts").evently(app.ddoc.evently.posts, app)

  $(".date").prettyDate()

  var ceaseFire = false

  var scrollFun = function() {
    if (ceaseFire)
      return false

    var last_entry = $("#posts li.entry:last")[0]

    if (!this.prev_date)
      this.prev_date= last_entry.getAttribute("date")

    var pathname = document.location.pathname
    var viewname = pathname.substring(pathname.lastIndexOf("/") + 1)

    var descending = $(document).getUrlParam("descending") || "true"

    var start = $(document).getUrlParam("startkey")
    var end_date = descending == "true" ?  "0000-01-01T00%3A00%3A00.000Z" : "9999-12-31T23%3A59%3A59.999Z"

    var date = last_entry.getAttribute("date")
    if (start && viewname == "recent-posts-by-topic") {
      var topic = JSON.parse(unescape(start))[0]
      var startkey = '["' + topic + '","' + date + '"]'
      var endkey = '["' + topic + '","' + end_date + '"]'
      if (date == this.prev_date) {
        var docid = last_entry.getAttribute("id")
        startkey = startkey + '&startkey_docid=' + '"' + docid + '"'
      }
      this.prev_date = date
    } else {
      var startkey = '"' + date + '"'
      var endkey = '"' + end_date + '"'
      if (date == this.prev_date) {
        var docid = last_entry.getAttribute("id")
        startkey = startkey + '&startkey_docid=' + '"' + docid + '"'
      }
      this.prev_date = date
    }

    var url = "../../_view/" + viewname + "?descending=" + descending +
              "&limit=5&skip=1&startkey=" + startkey + "&endkey=" + endkey
    var xhr = $.ajax({
      url : url,
      async: false
    })

    var data = null
    if ((xhr.status == 200 || xhr.status == 304))
      data = JSON.parse(xhr.responseText)

    if (data && data.rows) {
      if (data.offset == data.total_rows || data.rows.length < 4)
        ceaseFire = true
      var entries = data.rows
      var entriesXML = ""
      entries.forEach(function(entryObj) {
        var entry = entryObj.value
        if (entry.enclosure) {
          var enclosure = '<p class="enclosure"><img class="type-icon"' +
                      ' src="../../images/audio.png"/> <a href="' +
                      entry.enclosure_link + '">' + entry.enclosure +
                      '</a></p>'
        } else {
          var enclosure = ""
        }
        entriesXML += '<li id="' + entry.link + '" date="' + entry.date +
                      '" class="entry"><h3><a href="' + entry.providerUrl +
                      '">' + entry.providerName + '</a></h3><h4><a href="' +
                      entry.link + '">' + entry.title + '</a></h4>' +
                      '<div class ="body">' + entry.body + enclosure +
                      '<p class="by">by ' + entry.author +
                      ', <span class="date">' + $.prettyDate(entry.date) +
                      '</span></p></div></li>'
      })
      return entriesXML
    } else {
      return false
    }
  }

  $(document).endlessScroll({
    bottomPixels: 400,
    fireOnce: false,
    fireDelay: 500,
    data: scrollFun,
    loader: '<img id="loader" src="../../images/loading.gif"/>',
    insertAfter: "#posts li.entry:last",
    ceaseFire: function() { return ceaseFire }
  })
})
