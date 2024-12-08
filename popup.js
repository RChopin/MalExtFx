function setup() {
	browser.storage.local.get(["tags"], function (items) {
		if (typeof items["tags"] === "undefined") {
			items["tags"] = true;
			browser.storage.local.set({ tags: true }, () => {});
		}
		document.getElementById("tags").checked = items["tags"];
	});
	browser.storage.local.get(["completed"], function (items) {
		if (typeof items["completed"] === "undefined") {
			items["completed"] = true;
			browser.storage.local.set({ completed: true }, () => {});
		}
		document.getElementById("completed").checked = items["completed"];
	});
	browser.storage.local.get(["completedorder"], function (items) {
		document.getElementById("completedorder").checked = items["completedorder"];
	});
	browser.storage.local.get(["malgraph"], function (items) {
		if (typeof items["malgraph"] === "undefined") {
			items["malgraph"] = true;
			browser.storage.local.set({ malgraph: true }, () => {});
		}
		document.getElementById("malgraph").checked = items["malgraph"];
	});
	browser.storage.local.get(["malexlogin"], function (items) {
		if (typeof items["malexlogin"] === "undefined") {
			items["malexlogin"] = true;
			browser.storage.local.set({ malexlogin: true }, () => {});
		}
		document.getElementById("login").checked = items["malexlogin"];
	});
	browser.storage.local.get(["droptag"], function (items) {
		if (typeof items["droptag"] === "undefined") {
			items["droptag"] = true;
			browser.storage.local.set({ droptag: true }, () => {});
		}
		document.getElementById("droptag").checked = items["droptag"];
	});
	browser.storage.local.get(["sortcip"], function (items) {
		if (typeof items["sortcip"] === "undefined") {
			items["sortcip"] = true;
			browser.storage.local.set({ sortcip: true }, () => {});
		}
		document.getElementById("sortcip").checked = items["sortcip"];
	});
	browser.storage.local.get(["highlighter"], function (items) {
		if (typeof items["highlighter"] === "undefined") {
			items["highlighter"] = false;
			browser.storage.local.set({ highlighter: false }, () => {});
		}
		document.getElementById("highlighter").checked = items["highlighter"];
	});
	browser.storage.local.get(["bonker"], function (items) {
		if (typeof items["bonker"] === "undefined") {
			items["bonker"] = false;
			browser.storage.local.set({ bonker: false }, () => {});
		}
		document.getElementById("bonker").checked = items["bonker"];
	});
	browser.storage.local.get(["banMediaTypes"], function (items) {
		if (typeof items["banMediaTypes"] === "undefined") {
			items["banMediaTypes"] = [];
		}
		document.getElementById("inputBanMedia").value = items["banMediaTypes"];
		console.log(items["banMediaTypes"]);
	});
	// browser.storage.local.get(["music"], function (items) {
	// 	if (typeof items["music"] === "undefined") {
	// 		items["music"] = false;
	// 		browser.storage.local.set({ music: false }, () => {});
	// 	}
	// 	document.getElementById("music").checked = items["music"];
	// });
	// browser.storage.local.get(["pv"], function (items) {
	// 	if (typeof items["pv"] === "undefined") {
	// 		items["pv"] = false;
	// 		browser.storage.local.set({ pv: false }, () => {});
	// 	}
	// 	document.getElementById("pv").checked = items["pv"];
	// });
	// browser.storage.local.get(["cm"], function (items) {
	// 	if (typeof items["cm"] === "undefined") {
	// 		items["cm"] = false;
	// 		browser.storage.local.set({ cm: false }, () => {});
	// 	}
	// 	document.getElementById("cm").checked = items["cm"];
	// });
	browser.storage.local.get(["affinity"], function (items) {
		document.getElementById("affinity").checked = items["affinity"];
	});
	browser.storage.local.get(["cutoff"], function (items) {
		if (typeof items["cutoff"] === "undefined" || isNaN(items["cutoff"])) {
			items["cutoff"] = 5;
		}
		document.getElementById("inputBox").value = items["cutoff"];
	});

	const manifestData = browser.runtime.getManifest();
	document.getElementById("version").innerHTML = "v" + manifestData.version;
}

setup();

const checkbox1 = document.getElementById("tags");

checkbox1.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ tags: true }, function () {});
	} else {
		browser.storage.local.set({ tags: false }, function () {});
	}
});

const checkbox2 = document.getElementById("completed");

checkbox2.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ completed: true }, function () {});
	} else {
		browser.storage.local.set({ completed: false }, function () {});
	}
});

const checkbox3 = document.getElementById("completedorder");

checkbox3.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ completedorder: true }, function () {});
	} else {
		browser.storage.local.set({ completedorder: false }, function () {});
	}
});

const checkbox4 = document.getElementById("malgraph");

checkbox4.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ malgraph: true }, function () {});
	} else {
		browser.storage.local.set({ malgraph: false }, function () {});
	}
});

const checkbox5 = document.getElementById("login");

checkbox5.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ malexlogin: true }, function () {});
	} else {
		browser.storage.local.set({ malexlogin: false }, function () {});
	}
});

const checkbox6 = document.getElementById("droptag");

checkbox6.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ droptag: true }, function () {});
	} else {
		browser.storage.local.set({ droptag: false }, function () {});
	}
});

const checkbox7 = document.getElementById("sortcip");

checkbox7.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ sortcip: true }, function () {});
	} else {
		browser.storage.local.set({ sortcip: false }, function () {});
	}
});

const checkbox8 = document.getElementById("highlighter");

checkbox8.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ highlighter: true }, function () {});
	} else {
		browser.storage.local.set({ highlighter: false }, function () {});
	}
});

const checkbox13 = document.getElementById("bonker");

checkbox13.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ bonker: true }, function () {});
	} else {
		browser.storage.local.set({ bonker: false }, function () {});
	}
});

const inputBanMedia = document.getElementById("banMedia");
let inputBanMediaButton = inputBanMedia.childNodes[3];

inputBanMediaButton.addEventListener("click", (event) => {
	event.preventDefault();
	let inputValue = inputBanMedia.childNodes[1].value;
	browser.storage.local.set({ banMediaTypes: inputValue }, function () {});
	console.log(inputValue);
});

// const checkbox9 = document.getElementById("music");

// checkbox9.addEventListener("change", (event) => {
// 	if (event.target.checked) {
// 		browser.storage.local.set({ music: true }, function () {});
// 	} else {
// 		browser.storage.local.set({ music: false }, function () {});
// 	}
// });

// const checkbox10 = document.getElementById("pv");

// checkbox10.addEventListener("change", (event) => {
// 	if (event.target.checked) {
// 		browser.storage.local.set({ pv: true }, function () {});
// 	} else {
// 		browser.storage.local.set({ pv: false }, function () {});
// 	}
// });

// const checkbox11 = document.getElementById("cm");

// checkbox11.addEventListener("change", (event) => {
// 	if (event.target.checked) {
// 		browser.storage.local.set({ cm: true }, function () {});
// 	} else {
// 		browser.storage.local.set({ cm: false }, function () {});
// 	}
// });

const checkbox12 = document.getElementById("affinity");

checkbox12.addEventListener("change", (event) => {
	if (event.target.checked) {
		browser.storage.local.set({ affinity: true }, function () {});
	} else {
		browser.storage.local.set({ affinity: false }, function () {});
	}
});

const input = document.getElementById("cutoff");
let inputButton = input.childNodes[3];

inputButton.addEventListener("click", (event) => {
	event.preventDefault();
	let inputValue = input.childNodes[1].value;
	browser.storage.local.set({ cutoff: inputValue }, function () {});
});

let eatCookiesButton = document.getElementById("eat-cookies");

eatCookiesButton.addEventListener("click", (event) => {
	event.preventDefault();
	const domain = "dirtyfix2.vercel.app"; // Cookies domain
	browser.cookies.getAll({ domain }).then((cookies) => {
		cookies.forEach((cookie) => {
			const cookieDetails = {
				url: `http${cookie.secure ? "s" : ""}://${cookie.domain}${cookie.path}`,
				name: cookie.name,
			};

			browser.cookies.remove(cookieDetails).then(() => {
				console.log(`Removed cookie: ${cookie.name}`);
			});
		});
	});
});

const timestamp = document.getElementById("timestamp");
timestamp.innerHTML = "now: " + new Date().getTime() / 1000;

const datepicker = document.getElementById("datepicker");
const discord_timestamp = document.getElementById("discord-timestamp");
datepicker.addEventListener("change", (event) => {
	discord_timestamp.innerHTML = `&lt;t:${
		Date.parse(datepicker.value) / 1000
	}&gt;`;
});
