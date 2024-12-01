let user;
let animelist;
let animenodelist;
let animeId;
let sharedanime;
let sharedtypes;
let uniqueanime;
let cipanime;
let auth_type;
let auth_token;
let mediaType;

// const no_auth_token = "";
// const CLIENT_ID = encodeURIComponent("");

const MAL_URI_ENDPOINT = "https://myanimelist.net/v1/oauth2/authorize";
const RESPONSE_TYPE = encodeURIComponent("code");

var text = "";
var possible =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
for (var i = 0; i < 128; i++) {
	text += possible.charAt(Math.floor(Math.random() * possible.length));
}
const CODE_CHALLENGE = encodeURIComponent(text);
const STATE = encodeURIComponent("RequestID42");
// let optionsPage = browser.runtime.getURL("options.html");
// console.log(optionsPage);
// const REDIRECT_URI = encodeURIComponent(optionsPage);
// console.log(REDIRECT_URI);

function create_auth_endpoint() {
	let endpoint_url = `${MAL_URI_ENDPOINT}?response_type=${RESPONSE_TYPE}&client_id=${CLIENT_ID}&code_challenge=${CODE_CHALLENGE}&state=${STATE}`;
	return endpoint_url;
}

function authorize() {
	navigator.clipboard.writeText(CODE_CHALLENGE);
	let endpoint_url = create_auth_endpoint();
	let redirectURL = browser.identity.getRedirectURL();
	console.log("authorize");
	return browser.windows.create(
		{ url: endpoint_url } // optional object
	);

	// return browser.identity.launchWebAuthFlow({
	// 	interactive: true,
	// 	url: endpoint_url,
	// 	redirect_uri: redirectURL,
	// });
}

function validate(redirect_uri) {
	console.log(redirect_uri);
	console.log("validate");
	if (browser.runtime.lastError || redirect_uri.includes("access_denied")) {
		console.log(browser.runtime.lastError);
		console.log("Could not authenticate.");
	} else {
		getToken(redirect_uri.slice(63, -18), sendResponse).then(
			sendResponse({ message: "auth_completed" })
		);
	}
}

function launchAuthFlow(sendResponse) {
	var redirectURL = browser.identity.getRedirectURL();
	console.log(redirectURL);
	console.log(create_auth_endpoint());
	// let endpoint_url = create_auth_endpoint();

	return authorize().then(validate);
	// return true;
}

async function getToken(code, sendResponse) {
	const MAL_TOKEN_ENDPOINT = "https://myanimelist.net/v1/oauth2/token";
	const CODE = encodeURIComponent(code);
	const GRANT_TYPE = encodeURIComponent("authorization_code");
	var tokenUrl = `${MAL_TOKEN_ENDPOINT}`;
	await fetch(tokenUrl, {
		method: "POST",

		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
		body: new URLSearchParams({
			client_id: CLIENT_ID,
			code: CODE,
			code_verifier: CODE_CHALLENGE,
			grant_type: GRANT_TYPE,
		}).toString(),
	})
		.then((response) => response.json())
		.then((data) => {
			browser.cookies.set({
				url: "https://myanimelist.net/",
				name: "token",
				value: data.access_token,
				expirationDate: new Date().getTime() / 1000 + data.expires_in,
				secure: true,
				httpOnly: true,
			});
		});
}

// browser.runtime.onInstalled.addListener((installed) => {
//   console.log(installed);
// });

browser.runtime.onInstalled.addListener((details) => {
	if (details.reason === "install") {
		// The extension has just been installed

		const width = 350; // Adjust the width as needed
		const height = 700; // Adjust the height as needed

		browser.windows.create({
			type: "popup",
			url: "firstpopup.html",
			width: width,
			height: height,
			left: Math.round((screen.availWidth - width) / 2),
			top: Math.round((screen.availHeight - height) / 2),
		});
	}
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	user = [];
	animelist = [[], []];
	animenodelist = [[], []];
	animeId = [[], []];
	sharedanime = [];
	sharedtypes = [];
	uniqueanime = [[], []];
	cipanime = [];
	auth_token = null;
	mediaType = null;

	if (sender.tab.url.includes("manga")) {
		mediaType = "manga";
	} else {
		mediaType = "anime";
	}

	if (message) {
		switch (message.command) {
			case "login":
				launchAuthFlow(sendResponse);
				return true;
			case "auth_check":
				console.log("cookie check");
				let domain = "https://dirtyfix2.vercel.app/";
				let name = "token";

				browser.cookies.get({ url: domain, name: name }, function (cookie) {
					console.log(cookie);
					if (cookie) sendResponse({ message: "authorized" });
					else sendResponse({ message: "auth_required" });
				});
				return true;

			case "getUserData":
				user[0] = message.u0;
				user[1] = message.u1;
				auth_type = message.auth_type;

				if (auth_type === true) {
					let domain = "https://dirtyfix2.vercel.app/";
					let name = "token";
					browser.cookies.get({ url: domain, name: name }, function (cookie) {
						if (cookie) {
							auth_token = cookie.value;
							console.time("fetchDataTotal");
							console.time("fetchDataU1");
							getUserData(0).then(() => {
								console.timeEnd("fetchDataU1");
								console.time("fetchDataU2");
								getUserData(1).then(() => {
									console.timeEnd("fetchDataU2");
									console.time("fetchDataEnd");
									parseUserData().then(() => {
										var response = {
											animelist: animelist,
											animenodelist: animenodelist,
											animeId: animeId,
										};
										console.timeEnd("fetchDataEnd");
										console.timeEnd("fetchDataTotal");
										sendResponse(response);
									});
								});
							});
						}
					});
				} else {
					console.time("fetchDataTotal");
					console.time("fetchDataU1");
					getUserData(0).then(() => {
						console.timeEnd("fetchDataU1");
						console.time("fetchDataU2");
						getUserData(1).then(() => {
							console.timeEnd("fetchDataU2");
							console.time("fetchDataEnd");
							parseUserData().then(() => {
								var response = {
									animelist: animelist,
									animenodelist: animenodelist,
									animeId: animeId,
								};
								console.timeEnd("fetchDataEnd");
								console.timeEnd("fetchDataTotal");
								sendResponse(response);
							});
						});
					});
				}

				return true;
			case "getShared":
				anime = message.anime;
				animeId = message.animeId;
				animelist = message.animelist;
				animenodelist = message.animenodelist;
				sharedtypes = message.sharedtypes;

				getShared().then(() => {
					var response = {
						sharedanime: sharedanime,
					};
					sendResponse(response);
				});

				return true;

			case "getUnique":
				anime = message.anime;
				animeId = message.animeId;
				animelist = message.animelist;
				animenodelist = message.animenodelist;
				sharedanime = message.sharedanime;

				getUnique().then(() => {
					var response = {
						uniqueanime: uniqueanime,
					};
					sendResponse(response);
				});

				return true;

			case "getCompletedInPlanned":
				anime = message.anime;
				animeId = message.animeId;
				animelist = message.animelist;
				animenodelist = message.animenodelist;
				completedorder = message.completedorder;

				getCompletedInPlanned().then(() => {
					var response = {
						cipanime: cipanime,
					};
					sendResponse(response);
				});

				return true;
		}
	}
});

async function getCompletedInPlanned() {
	// take all user anime
	// check if in cpl
	// check if in 2nd user's ptw
	// if so push to temp

	console.time("getCompletedInPlanned");
	let user1list; //user 1
	let user1Ids;
	let user0list; //user 2 i guess
	let user0Ids;
	if (completedorder == false) {
		user1list = animelist[1]; //user 1
		user1Ids = animeId[1];
		user0list = animelist[0]; //user 2 i guess
		user0Ids = animeId[0];
	} else if (completedorder == true) {
		user1list = animelist[0]; //user 1
		user1Ids = animeId[0];
		user0list = animelist[1]; //user 2 i guess
		user0Ids = animeId[1];
	}

	let templist = [];

	if (mediaType == "anime") {
		plan_to_do_what = "plan_to_watch";
	} else {
		plan_to_do_what = "plan_to_read";
	}

	for (let anime of user1list) {
		if (anime.list_status.status == "completed") {
			if (user0Ids.includes(anime.node.id)) {
				if (
					user0list[user0Ids.indexOf(anime.node.id)].list_status.status ==
					plan_to_do_what
				) {
					templist.push(anime.node.id);
				}
			}
		}
	}

	cipanime = [...templist];

	console.timeEnd("getCompletedInPlanned");
}

async function getUnique() {
	// take all user anime
	// check if in shared => cont
	// check if in ptw => cont
	// push all reamaining to temp list

	console.time("getUnique");

	let tempshared = [];
	for (let anime of sharedanime) {
		tempshared.push(anime.id);
	}

	let templist = [[], []];
	let plan_to_do_what;
	if (mediaType == "anime") {
		plan_to_do_what = "plan_to_watch";
	} else {
		plan_to_do_what = "plan_to_read";
	}
	for (let i in animelist) {
		for (let anime of animelist[i]) {
			if (tempshared.includes(anime.node.id)) continue;
			if (anime.list_status.status == plan_to_do_what) continue;
			templist[i].push(animeId[i][animeId[i].indexOf(anime.node.id)]);
		}
	}
	uniqueanime = [...templist];

	console.timeEnd("getUnique");
}

async function getShared() {
	console.time("getShared");
	for (let anime of animeId[0]) {
		if (animeId[1].includes(anime)) {
			try {
				if (
					sharedtypes.includes(
						animelist[0][animeId[0].indexOf(anime)].list_status.status
					) &&
					sharedtypes.includes(
						animelist[1][animeId[1].indexOf(anime)].list_status.status
					)
				)
					sharedanime.push({
						id: anime,
						title: animelist[0][animeId[0].indexOf(anime)].node.title,
						u0: animelist[0][animeId[0].indexOf(anime)].list_status.score,
						u1: animelist[1][animeId[1].indexOf(anime)].list_status.score,
					});
			} catch (e) {
				console.warn(e);
				console.warn(
					animenodelist[1][animeId[1].indexOf(anime)].title,
					"caused some trouble"
				);
			}
		}
	}
	console.timeEnd("getShared");
}

async function parseUserData() {
	for (let list in animelist) {
		for (let anime of animelist[list]) {
			animeId[list].push(anime.node.id);
			animenodelist[list].push(anime.node);
		}
	}
}

async function getUserData(userNo, paging) {
	let userUrl;
	let header;
	if (auth_type) {
		header = {
			Authorization: "Bearer " + auth_token,
			"Content-Type": "application/json",
			charset: "utf-8",
		};
	} else {
		header = {
			"X-MAL-CLIENT-ID": no_auth_token,
			"Content-Type": "application/json",
			charset: "utf-8",
		};
	}
	if (paging) userUrl = paging;
	else
		userUrl = `https://api.myanimelist.net/v2/users/${user[userNo]}/${mediaType}list?fields=list_status(status,score,genres,media_type,rating,start_date,end_date,num_episodes,num_volumes)&nsfw=true&limit=1000`;
	console.log(userUrl);
	await fetch(userUrl, {
		method: "GET",
		headers: header,
	})
		.then((response) => response.json())
		.then((data) => {
			animelist[userNo].push(...data.data);
			if (data.data.length == 1000) {
				return getUserData(userNo, data.paging.next);
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}
