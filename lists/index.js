function(head, req) {
  var ddoc = this
  var Mustache = require("vendor/couchapp/lib/mustache")
  var List = require("vendor/couchapp/lib/list")
  var Path = require("vendor/couchapp/lib/path").init(req)
  var Atom = require("vendor/couchapp/lib/atom")

  var indexPath = Path.list('index','recent-posts', {descending: true, limit: 8})
  var feedPath = Path.list('index','recent-posts', {descending: true, limit: 8, format: "atom"})

  // The provides function serves the format the client requests.
  // The first matching format is sent, so reordering functions changes
  // thier priority. In this case HTML is the preferred format, so it comes first.
  provides("html", function() {
    var posts = [], row, post, key
    while (row = getRow()) {
      post = row.value
      key = row.key
      posts.push({
        title : post.title,
        author : post.author,
        providerName : post.providerName,
        providerUrl : post.providerUrl,
        date : post.date,
        body : post.body,
        link : post.link,
        enclosure : post.enclosure || null,
        enclosure_link : post.enclosure_link || null
      })
    }
    // render the html head using a template
    var stash = {
      index: indexPath,
      title: ddoc.blog.title,
      feedPath: feedPath,
      posts: posts
    }
    return Mustache.to_html(ddoc.templates.index, stash, ddoc.templates.partials, List.send)
  })

  // if the client requests an atom feed and not html,
  // we run this function to generate the feed.
  provides("atom", function() {
    var markdown = require("vendor/couchapp/lib/markdown")
    // we load the first row to find the most recent change date
    var row = getRow()
    // generate the feed header
    var feedHeader = Atom.header({
      updated : (row ? new Date(row.value.date) : new Date()),
      title : ddoc.blog.title,
      feed_id : Path.absolute(indexPath),
      feed_link : Path.absolute(feedPath),
    })
    // send the header to the client
    send(feedHeader)
    // loop over all rows
    if (row) {
      do {
        if (row.value.format == "markdown") {
          var html = markdown.encode(row.value.body)
        } else {
          var html = row.value.body
        }
        // generate the entry for this row
        var feedEntry = Atom.entry({
          entry_id : Path.absolute('/' + encodeURIComponent(req.info.db_name) + '/' + encodeURIComponent(row.id)),
          title : row.value.title,
          content : html,
          updated : new Date(row.value.date),
          author : row.value.author,
          alternate : Path.absolute(Path.show('post', row.id))
        })
        // send the entry to client
        send(feedEntry)
      } while (row = getRow())
    }
    // close the loop after all rows are rendered
    return "</feed>"
  })
}
