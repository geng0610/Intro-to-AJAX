
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    //console.log('loading');
    //console.log($('#street').val());
    //console.log($('#city').val());
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ',' + cityStr;
    $greeting.text('So, you want to live at ' + address + '?');

    if(streetStr && cityStr)
    {
        $body.append('<img class = "bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x400&location='+address+'"">');
        var nyTimesAPI = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+cityStr.replace(" ","+")+"&page=2&sort=newest&api-key=9cc39d19c3fa25ffc4e49839acbcb524:9:65627894";
        //console.log(nyTimesAPI)
        $.getJSON(nyTimesAPI, function(data){
            $nytHeaderElem.text('New York Times Articles About '+cityStr);
            articles =data.response.docs;
            //console.log(articles[0].headline.main)

            /*for (var i=0; i<articles.length; i++){
                var article = articles[i];
                //console.log(article.web_url);
                $nytElem.append('<li class = "article">'+'<a href ="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
            }*/


            //WHY DOESN'T THIS CODE WORK????
            var tempNytArticles = $(document.createDocumentFragment());
            for (var i=0; i<articles.length; i++){
                var article = articles[i];
                //console.log(article.web_url);
                tempNytArticles.append('<li class = "article">'+'<a href ="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
            };
            $nytElem.append(tempNytArticles);
        }).error(function(e){
            $nytHeaderElem.text('New York Times Articles Could not be Loaded');
        });
        var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+cityStr+'&format=json&callback=wikiCallback';
        
        var wikiRequestTimeout = setTimeout(function(){
            $wikiElem.text("failed to get wikipedia resources");
        }, 8000);

        $.ajax({
            url:wikiURL,
            dataType:"jsonp",
            success: function(response){
                var articleList=response[1];
                for (var i=0; i<articleList.length; i++){
                    articleStr = articleList[i];
                    var url = 'http:en.wikipedia.org/wiki/'+articleStr;
                    console.log(url);
                    $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');
                };

                clearTimeout(wikiRequestTimeout);
            }
        });
    }

    // YOUR CODE GOES HERE!

    return false;
};

$('#form-container').submit(loadData);

loadData();
