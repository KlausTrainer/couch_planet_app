function() {
  var ret = {},
      pathname = document.location.pathname,
      viewname = pathname.substring(pathname.lastIndexOf("/") + 1),
      descending = $(document).getUrlParam("descending"),
      skip = $(document).getUrlParam("skip"),
      limit = $(document).getUrlParam("limit"),
      startkey = $(document).getUrlParam("startkey"),
      endkey = $(document).getUrlParam("endkey")

  if (viewname == "recent-posts-by-topic")
    ret.view = "recent-posts-by-topic"
  else
    ret.view = "recent-posts"

  if (descending)
    ret.descending = descending
  if (skip)
    ret.skip = skip
  if (limit)
    ret.limit = limit
  if (startkey)
    ret.startkey = JSON.parse(unescape(startkey))
  if (endkey)
    ret.endkey = JSON.parse(unescape(endkey))

  return ret
}
