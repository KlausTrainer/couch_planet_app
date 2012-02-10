jQuery.fn.extend({
/**
* Returns HTTP GET parameters.
*
* Returns null if the desired parameter does not exist.
*
* To get a document parameter:
* @example value = $(document).getUrlParam("paramName")
*
* To get a parameters of an html element (uses src or href attribute):
* @example value = $('#imgLink').getUrlParam("paramName")
*/
  getUrlParam: function(strParamName) {
    strParamName = escape(unescape(strParamName))

    var returnVal = new Array()
    var qString = null

    if ($(this).attr("nodeName") == "#document") {
      //document-handler

      if (window.location.search.search(strParamName) > -1 )
        qString = window.location.search.substr(1,window.location.search.length).split("&")

    } else if ($(this).attr("src")) {

      var strHref = $(this).attr("src")
      if (strHref && strHref.indexOf("?") > -1) {
        var strQueryString = strHref.substr(strHref.indexOf("?")+1)
        qString = strQueryString.split("&")
      }
    } else if ($(this).attr("href")) {

      var strHref = $(this).attr("href")
      if (strHref && strHref.indexOf("?") > -1) {
        var strQueryString = strHref.substr(strHref.indexOf("?") + 1)
        qString = strQueryString.split("&")
      }
    } else {
      return null
    }

    if (qString == null )
      return null

    for (var i=0; i < qString.length; i++) {
      if (escape(unescape(qString[i].split("=")[0])) == strParamName)
        returnVal.push(qString[i].split("=")[1])
    }

    if (returnVal.length == 0)
      return null
    else if (returnVal.length == 1)
      return returnVal[0]
    else
      return returnVal
  }
})
