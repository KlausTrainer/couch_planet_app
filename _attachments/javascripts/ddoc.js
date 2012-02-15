$.couch.app.ddoc = {
  evently: {
    posts: {
      _changes: {
        query: {limit: 8, descending: true, view: 'recent-posts'},
        data: function(data) {
          var ret = {}, posts = []
          data.rows.forEach(function(row) {
            var post = row.value
            posts.push({
              title: post.title,
              author: post.author,
              providerName: post.providerName,
              providerUrl: post.providerUrl,
              enclosure_link: post.enclosure_link,
              enclosure: post.enclosure,
              date: post.date,
              pretty_date: $.prettyDate(post.date),
              body: post.body,
              link: post.link
            })
          })
          ret.posts = posts
          return ret
        },
        mustache: '{{#posts}}<li id="{{link}}" data-date="{{date}}" class="entry"><h3><a href="{{providerUrl}}">{{providerName}}</a></h3><h4><a href="{{link}}">{{title}}</a></h4><div class="body"><p class="main">{{{body}}}</p>{{#enclosure}}<p class="enclosure"><img class="type-icon" src="images/audio.png"/> <a href="{{enclosure_link}}">{{enclosure}}</a></p>{{/enclosure}}<p class="by">by {{author}}, <span class="date">{{pretty_date}}</span></p></div></li>{{/posts}}',
        render: 'prepend'
      }
    }
  }
}
