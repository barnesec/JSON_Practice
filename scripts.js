$(document).ready(function(){
	var url = "//www.nba.com/nets/api/v1/json?tags=brooklenns-own";
	getArticles(url, null);

	$(window).scroll(function() {  
		if($(window).scrollTop() + document.body.clientHeight == $(document).height()) {
			$("#loader").html("<img src='img/loader.gif'>");

			setTimeout(function(){
				var offset = $(".articleNode").length - 1,
				size = 10 + $(".articleNode").length;

				console.log(size);

				getArticles(url, size, offset);
			}, 1500);
		}
	});
});

// Get data from json feed
function getArticles(feed, size, offset){
	var feed = feed,
	size = size != 0 && size !== null ? size : 10;

	$.ajax({
		url : feed,
		jsonp : "callback",
		dataType : "jsonp",
		data : {
			size : size
		},
		success : function(response){
			buildArticleList(response.node, offset);

			$(".articleImg").each(function(i, val){
				if(!val.hasAttribute("src")){
					// Set default image if image from json feed is broken/missing
					$(this).attr("src", "img/placeholder.jpg");
				}
			});		
		},
		fail : function(response){
			alert("There are no articles to be loaded.");
		}
	});
}

// Build article blocks after json data is loaded
function buildArticleList(json, offset){
	var contentContainer = $("#content"),
	sortedJson = sortObjects(json, offset);

	for(var key in sortedJson){
		var contentRow = $("<div></div>").attr("class", "articleNode"),
		contentHeadline = $("<h3></h3>").attr("class", "headline"),
		contentHLink = $("<a></a>").attr("class", "Headlink").attr("target", "_blank"),
		contentILink = $("<a></a>").attr("class", "Imglink").attr("target", "_blank"),
		contentImg = $("<img>").attr("class", "articleImg"),
		contentInfo = $("<p></p>").attr("class", "paragraph"),
		contentDate = $("<span></span>").attr("class", "date");
		contentTags = $("<span></span>").attr("class", "tag");

		contentHeadline.html(sortedJson[key][1].title);					
		contentHLink.attr("href", sortedJson[key][1].url);					
		contentILink.attr("href", sortedJson[key][1].url);					
		contentImg.attr("src", sortedJson[key][1].thumbnail);					
		contentImg.attr("alt", sortedJson[key][1].title);					
 		contentImg.attr("title", sortedJson[key][1].type);					
		contentInfo.html(sortedJson[key][1].body);					
		contentDate.html(sortedJson[key][1].created);					
		contentTags.html(sortedJson[key][1].author);	

		for(var k in sortedJson[key][1].tagging){
			contentTags.html(sortedJson[key][1].tagging[k]);
		};

		var articleNode = contentRow.append(contentHLink.html(contentHeadline));
		articleNode = contentRow.append(contentILink.html(contentImg));
		articleNode = contentRow.append(contentInfo);
		articleNode = contentRow.append(contentDate);
		articleNode = contentRow.append(contentTags);

		contentContainer.append(articleNode);		
	};	
}

// Sort objects by date (created)
function sortObjects(obj, offset){
	sortedByDate = [];

	console.log(obj);

	for(var article in obj){
		sortedByDate.push([article, obj[article]]);
	};

	console.log(offset);
	console.log(sortedByDate);

	// If offset is defined, return only the number of elements that haven't already been loaded
	if(offset !== "" && offset != null){
		sortedByDate = sortedByDate.slice(offset);
	}

	console.log(sortedByDate);

	sortedByDate.sort(function(a, b){
		return a[1].created + b[1].created;
	});


	return sortedByDate;
}