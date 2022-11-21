// This is the background script for the extension
console.log("background running");

// Listen for messages
browser.runtime.onMessage.addListener(receiver);

var user1;
var user2;
var userUrl1;
var userUrl2;
var results1;
var results2;
var array = [];
var array2 = [];
var tabid;

var allAnime = [];
var user1Anime = [];
var user2Anime = [];
var user1Ids = [];
var user2Ids = [];

function receiver(request, sender, sendResponse) {
	tabid = sender.tab.id;
	tabUrl = sender.tab.url;

	if (request.message === "isAuthenticated") {
		browser.tabs.sendMessage(tabid, "auth_not_required");
	} else if (request.message === "animeGenre") {
		if (tabUrl.includes("manga")) {
			mediaType = "manga";
			getGenre(request.anime, mediaType, request.table);
		} else {
			mediaType = "anime";
			getGenre(request.anime, mediaType, request.table);
		}
	} else {
		var results1;
		var results2;
		user1 = request.user_1;
		user2 = request.user_2;
		if (tabUrl.includes("manga")) {
			mediaType = "manga";
			userUrl1 =
				"https://api.myanimelist.net/v2/users/" +
				user1 +
				"/mangalist?fields=list_status(status,score,genres)&nsfw=true&limit=1000";
			userUrl2 =
				"https://api.myanimelist.net/v2/users/" +
				user2 +
				"/mangalist?fields=list_status(status,score,genres)&nsfw=true&limit=1000";
		} else {
			mediaType = "anime";
			userUrl1 =
				"https://api.myanimelist.net/v2/users/" +
				user1 +
				"/animelist?fields=list_status(status,score,genres)&nsfw=true&limit=1000";
			userUrl2 =
				"https://api.myanimelist.net/v2/users/" +
				user2 +
				"/animelist?fields=list_status(status,score,genres)&nsfw=true&limit=1000";
		}
		results = getAnimeList1(userUrl1, userUrl2, results1, results2);
	}
}

function getAnimeList1(url1, url2, results1, results2) {
	$.ajax({
		url: url1,
		type: "GET",
		dataType: "json",
		headers: {
			"X-MAL-CLIENT-ID": auth_token,
		},
		contentType: "application/json; charset=utf-8",
		success: function (result) {
			if (typeof results1 === "undefined" && result["data"].length != 1000) {
				results1 = result;
				getAnimeList2(url2, results1, results2);
			} else if (
				typeof results1 === "undefined" &&
				result["data"].length == 1000
			) {
				results1 = result;
				getAnimeList1(result["paging"]["next"], url2, results1, results2);
			} else if (result["data"].length != 1000) {
				for (let anime1 of result["data"]) {
					results1["data"].push(anime1);
				}
				getAnimeList2(url2, results1, results2);
			} else if (result["data"].length == 1000) {
				for (let anime1 of result["data"]) {
					results1["data"].push(anime1);
				}

				getAnimeList1(result["paging"]["next"], url2, results1, results2);
			} else {
				getAnimeList2(url2, results1, results2);
			}
		},
		error: function (error) {},
	});
}

function getAnimeList2(url2, results1, results2) {
	$.ajax({
		url: url2,
		type: "GET",
		dataType: "json",
		headers: {
			"X-MAL-CLIENT-ID": auth_token,
		},
		contentType: "application/json; charset=utf-8",
		success: function (result) {
			if (typeof results2 === "undefined" && result["data"].length != 1000) {
				results2 = result;
				parseData(results1, results2);
			} else if (
				typeof results2 === "undefined" &&
				result["data"].length == 1000
			) {
				results2 = result;
				getAnimeList2(result["paging"]["next"], results1, results2);
			} else if (result["data"].length != 1000) {
				for (let anime2 of result["data"]) {
					results2["data"].push(anime2);
				}
				console.log(result1, result2);
				parseData(results1, results2);
			} else if (result["data"].length == 1000) {
				for (let anime2 of result["data"]) {
					results2["data"].push(anime2);
				}
				getAnimeList2(result["paging"]["next"], results1, results2);
			} else {
				parseData(results1, results2);
			}
		},
		error: function (error) {},
	});
}

function parseData(result1, result2) {
	array = [];

	for (let anime1 of result1["data"]) {
		user1Ids.push(anime1["node"].id);
		user1Anime.push(anime1["node"]);
	}
	for (let anime2 of result2["data"]) {
		user2Ids.push(anime2["node"].id);
		user2Anime.push(anime2["node"]);
	}

	for (let anime1 of result1["data"]) {
		if (user2Ids.includes(anime1["node"].id)) {
			if (mediaType == "anime") {
				if (
					anime1["list_status"]["status"] == "completed" &&
					result2["data"][user2Ids.indexOf(anime1["node"]["id"])][
						"list_status"
					]["status"] == "plan_to_watch"
				) {
					array.push(anime1["node"]["id"]);
				}
			} else if (mediaType == "manga") {
				if (
					anime1["list_status"]["status"] == "completed" &&
					result2["data"][user2Ids.indexOf(anime1["node"]["id"])][
						"list_status"
					]["status"] == "plan_to_read"
				) {
					array.push(anime1["node"]["id"]);
				}
			}
		}
	}

	sendAnime(array, result1);
}

function sendAnime(array, result1) {
	for (let id of array) {
		for (let anime of result1["data"]) {
			if (anime["node"]["id"] == id && array.length != 0) {
				array2 = [];
				array2.push(id);
				array2.push(anime["node"]["title"]);
				array2.push(anime["list_status"]["score"]);
				browser.tabs.sendMessage(tabid, array2);
			}
		}
	}
	browser.tabs.sendMessage(tabid, "end");
	if (array.length == 0) {
		browser.tabs.sendMessage(tabid, "array=0");
	}
}

function getGenre(media, mediaType, tableID) {
	let results = "";

	if (user1Ids.includes(Number(media))) {
		console.log(user1Anime[user1Ids.indexOf(Number(media))]);
		var result = user1Anime[user1Ids.indexOf(Number(media))];
	} else if (user2Ids.includes(Number(media))) {
		console.log(user2Anime[user2Ids.indexOf(Number(media))]);
		var result = user2Anime[user2Ids.indexOf(Number(media))];
	}

	if (result) {
		for (let genre of result["genres"]) {
			results += genre.name;
			results += " | ";
		}
		var message = {
			message: "genre",
			anime: media,
			genres: results,
			table: tableID,
		};
		browser.tabs.sendMessage(tabid, message);
	}
}
