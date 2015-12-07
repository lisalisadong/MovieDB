var Bing = require('node-bing-api')({
	accKey : "qEJU0DWZxBhbw40arbtAyoSh1prT+/A0vEa8jTs4TJU"
});

exports.displaySearchResults = function(req, res) {

	var keyword = req.body.bingSearchContent;

	keyword += " + movie"

	Bing.video(keyword, {
		top : 20,
		market : 'en-US',
		adult : 'strict',
		skip : 0,
		videoFilters : {
			resolution : 'high'
		},
		videoSortBy : 'Relevance'
	}, function(error, res, body) {
		console.log(body);
		var titles = [];
		var urls = [];
	

		for (var i = 0; i < body.d.results.length; i++) {

			titles.push(body.d.results[i]["Title"]);
			urls.push(body.d.results[i]["Url"]);

		}
		response.render('bing', {
			titles : titles,
			urls : urls
		});
	});
}




