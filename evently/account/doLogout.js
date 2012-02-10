function() {
  var index = $$(this).app.ddoc.couchapp.index
  var elem = $(this)
  $.couch.logout({
    success : function() {
      elem.trigger("_init")
      if (typeof(subscriptions) != 'undefined')
        document.location = index // redirect to index page
    }
  })
}
