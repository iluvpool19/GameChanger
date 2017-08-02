const phantom = require('phantom');

var phantomInstance;

// starts one phantom instance on server start to prevent starting a new one each time.

phantom.create().then(instance => {
  phantomInstance = instance;
})
//this is js comment

module.exports = function buildPng(imgObj, socketNameSpace) {
  var nsp = socketNameSpace;
  var svg = buildImg(imgObj);
  var sitePage;

  // spins up new page in existing phantom instance to load SVG and create PNG

  phantomInstance.createPage()
    .then(openPage => {

      openPage.viewportSize = {
        width: imgObj.w + 10,
        height: imgObj.h + 10
      };
      sitePage = openPage;

      return openPage.open(svg);

    })
    .then((status) => {
      // renders the existing svg to png
      return sitePage.renderBase64('PNG');

    })
    .then((png) => {
      // emits the png URI and closes existing page
      nsp.emit('image', 'data:image/png;base64,' + png);
      sitePage.close();
    })
}




// adds appropriate context to image svg info from player.
var buildImg = function(imgObj) {
  imgData = imgObj.html;

  if (imgObj.html.indexOf('<img') >= 0) {
    var re = /<img\s+[^>]*src="([^"]*)"[^>]*>/;

    var len = imgObj.html.match(re).index + imgObj.html.match(re)[0].length
    imgData = imgObj.html.slice(0, len) + '</img>' + imgObj.html.slice(len);
  }

var xml = '<foreignObject x="0" y="0" width="100%" height="100%">' + imgData + '</foreignObject>';
var foreignObject = '<svg xmlns="http://www.w3.org/2000/svg" width="' + imgObj.w + '" height="' + imgObj.h + '">' + xml + '</svg>';
return 'data:image/svg+xml;charset=utf-8,' + foreignObject;
}
