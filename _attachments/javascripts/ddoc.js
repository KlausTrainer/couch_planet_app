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
        mustache: '{{#posts}}<li id="{{link}}" data-date="{{date}}" class="entry"><h3><a href="{{providerUrl}}">{{providerName}}</a></h3><h4><a href="{{link}}">{{title}}</a></h4><div class="body"><div class="main">{{{body}}}</div>{{#enclosure}}<p class="enclosure"><img class="type-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAjZJREFUOI3F0T2IFWcUxvH/eWfmeufO7C6667psUEFkg2CVQgnYBUQEBUFjVkQsxA+sLNIkIFaClbXEwsJOkjI2CYRACgu10UJYRFn2xtW9+3W/Zuad9xwby3trT3meww8eDnztkVHLizfnHkXYd2Y4HJGpiDh1Gogc4lQQRCPR6FM8CrDazp849UNzdnqByfwbsnSaJMlxLiLUJUW1SW/4gQcP78+MBADmZvfSSlPyPGci20OeztNIJijKDt3+Mq00B2c2FtjsvsPrNpXv0hu02dGYQojwdZ/Sb1FWGxCQsYCv+/z+x7+9wUBFAqKGQxBTdXEzqn88ezw1dDwAxvZmyGvi/VRbVdGYqpsMfUHq88JvmYIGGw+YKSLCkwftZcCg/yXZYPHabtQCoOLGAWo1ZtidO6NfrVYDxnhAa0TgH0bfqHoCXypcuLL7ZNKUX2KXH40bLRmW68Gkxgm20EZmrs4eTyO5m2U7DwgS9YYbqlaAIvFPN+YvJC78dub0udbCwWP0h21WO8+jje4SBnTd3K09U1O3Ly3+nO3aOU9/uMr/nWds95cQkLgh4cq3h7NWYa94836FolxnWK7hJMYMcxJ+PfL9vuzj9t982KwZVh287+NcgiEuDqb/vV0aHJmcbGdptkrtlV4v0OsOUFWXNOTTysryRKPpRcRRFiWd9QFrawNvZk4AFq/P3IuILgfVaYfzUSLvDH0RKv3TU79uJjseh6CHnLjK1IKL3Utf1X+5OH76GR2mFFD4ymXXAAAAAElFTkSuQmCC"/> <a href="{{enclosure_link}}">{{enclosure}}</a></p>{{/enclosure}}<p class="by">by {{author}}, <span class="date">{{pretty_date}}</span></p></div></li>{{/posts}}',
        render: 'prepend'
      }
    }
  }
}
