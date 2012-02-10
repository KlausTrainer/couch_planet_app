function(e, r, index) {
  return {
    main_page: typeof(subscriptions) == 'undefined' ? true : false,
    index: index,
    name: r.userCtx.name,
    uri_name: encodeURIComponent(r.userCtx.name),
    auth_db: encodeURIComponent(r.info.authentication_db)
  }
}
