function() {
  var index = $$(this).app.ddoc.couchapp.index
  var elem = $(this)
  $$(this).userCtx = null
  $.couch.session({
    success : function(r) {
      var userCtx = r.userCtx
      if (userCtx.name) {
        elem.trigger("loggedIn", [r, index])
      } else if (userCtx.roles.indexOf("_admin") != -1) {
        elem.trigger("adminParty")
      } else {
        elem.trigger("loggedOut", index)
      }
    }
  })
}
