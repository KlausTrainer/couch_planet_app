function(doc) {
    'use strict';

    if (doc.type != "Activity Stream" || doc.verb != "post") {
      return;
    }

    var post = {},
        date = new Date(doc.postedTime);

    post.date = date;
    post.title = doc.title;
    post.link = doc.object.id;
    post.body = doc.object.summary;
    post.providerName = doc.provider.name;
    post.providerUrl = doc.provider.id;

    if (!doc.actor.name) {
      post.author = post.providerName;
    } else{
      post.author = doc.actor.name;
    }

    if (!doc.actor.link) {
      post.authorUrl = post.providerUrl;
    } else {
      post.authorUrl = doc.actor.link;
    }

    if (doc.object.objectType == "podcast") {
      post.enclosure = doc.object.id.substr(doc.object.id.lastIndexOf("/") + 1);
      post.enclosure_link = doc.object.link;
    }

    emit([post.providerUrl, post.date], post)
  }
