
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $wikiHeaderElem = $('#wikipedia-header');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';

    $body.append('<img class="bgimg" src="' + streetviewURL + '">');

    //NY times request
    var nyAPI = 'f0c5af9b20bc327e6dc04f2fda26e270:13:73601028';
    var nySearchURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?callback=svc_search_v2_articlesearch&q=' + address + '&api-key=' + nyAPI;
    $.getJSON( nySearchURL, function( data ) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
          var article = articles[i];
          $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
        }

    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    //Wikipedia request
    var wikiSearchURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&prop=revisions&rvprop=content&format=json' ;
    $.ajax({
      url: wikiSearchURL,
      dataType: "jsonp",
      success: function(data, textStatus, jqXHR) {
        $wikiHeaderElem.text('Wikipedia Articles About ' + cityStr);
        var wikiTitle = data[1];
        var wikiLinks = data[3];
        for (var i = 0; i < data.length; i++){
            $wikiElem.append('<ul id="wikipedia-links"> <a href="' + wikiLinks[i] + '">' + wikiTitle[i] + '</a></ul>');
        }
        console.log("success");
        console.log(data[3]);
      },
    });

    return false;
    }

$('#form-container').submit(loadData);
