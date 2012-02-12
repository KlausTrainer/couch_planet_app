function(data) {
  var posts = []
  data.rows.forEach(function(row) {
    var post = row.value
    posts.push({
      title : post.title,
      author : post.author,
      providerName : post.providerName,
      providerUrl : post.providerUrl,
      date: post.date,
      pretty_date : $.prettyDate(post.date),
      body : post.body,
      link : post.link,
    })
  })
  var ret = {}
  ret.posts = posts
  return ret
}
