function(e, name, pass) {
  var elem = $(this)
  $.couch.login({
    name : name,
    password : pass,
    success : function(r) {
      elem.trigger("_init")
      if (typeof(subscriptions) == 'undefined')
        document.location = "../../subscriptions.html"
    }
  })
}
