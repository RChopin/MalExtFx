var doTags;
var doCompleted;

function setup() {
  browser.storage.local.get(
    ["tags", "completed", "malgraph"],
    function (items) {
      doTags = items["tags"];
      doCompleted = items["completed"];
      doMalGraph = items["malgraph"];
      isAuthenticated();
    }
  );
}

var content = document.getElementById("content");
var divs = content.getElementsByTagName("h2");
var tables = content.getElementsByTagName("table");
var animes = [];

var user1 = divs[0].getElementsByTagName("a")[2];
var user2 = divs[0].getElementsByTagName("a")[1];
//browser.runtime.sendMessage(message);

setup();

browser.runtime.onMessage.addListener(gotMessage);

function isAuthenticated() {
  var message = {
    message: "isAuthenticated",
  };
  browser.runtime.sendMessage(message);

  if (doCompleted === true) {
    setCompletedFrame();
  }
}

function sendNames(user1, user2) {
  if (user1.text.length > 0) {
    var message = {
      user_1: user1.text,
      user_2: user2.text,
    };
    browser.runtime.sendMessage(message);
  }
}

function loadGeneres(media, tableID) {
  var message = {
    message: "animeGenre",
    anime: media.toString(),
    table: tableID,
  };
  browser.runtime.sendMessage(message);
}

function sendGenres() {
  let con = 0;

  for (i = 0; i < tables.length; i++) {
    table = tables[i].rows;

    for (let row of table) {
      if (con != 0) {
        let element = row.getElementsByClassName("borderClass")[0];
        try {
          loadGeneres(element.innerHTML.slice(16, 22).split("/")[0], i);
        } catch (error) {
          console.error(error);
        }
      } else {
        con += 1;
      }
    }
  }
}

var celll1;
var roww;

function setCompletedFrame() {
  var title = document.createElement("H2");
  var textnode = document.createTextNode(
    "Completed by " + user1.text + ", planned by " + user2.text
  );
  title.appendChild(textnode);
  content.insertBefore(title, content.childNodes[9]);

  var table = document.createElement("TABLE");
  table.border = "0";
  table.cellPadding = "0";
  table.cellSpacing = "0";
  table.width = "100%";
  var row_1 = table.insertRow(0);
  var cell_1 = row_1.insertCell(0);
  var cell_2 = row_1.insertCell(1);
  var celCon1 = document.createElement("STRONG");
  var celCon2 = document.createElement("STRONG");
  celCon1.innerHTML = "Title";
  celCon2.innerHTML = user1.text + "'s Score";
  cell_1.classList.add("borderClass");
  cell_2.classList.add("borderClass");
  cell_2.style.textAlign = "center";
  cell_2.width = "140";
  cell_1.appendChild(celCon1);
  cell_2.appendChild(celCon2);
  content.insertBefore(table, content.childNodes[10]);

  roww = tables[1].insertRow(-1);
  celll1 = roww.insertCell(0);
}

function setAuthentication(row2) {
  var buttonDiv = document.createElement("DIV");
  var button = document.createElement("BUTTON");
  button.innerHTML = "AUTHENTICATE";
  button.type = "submit";
  button.style.cssText =
    "background-color:#2e51a2;border-radius:0.25em;color:#ffffff;font-weight:bold;text-decoration:none;font-family:'Roboto',sans-serif;border: none;padding:0.3em 1.2em;margin:0 0.3em 0.3em 0;text-align:center;transition: all 2s;";
  buttonDiv.appendChild(button);
  buttonDiv.style.display = "inline-block";
  buttonDiv.style.float = "right";

  row2.appendChild(buttonDiv);

  row2.classList.add("spaceit");

  content.insertBefore(row2, content.childNodes[1]);
  var empty = document.createElement("DIV");
  var emptyP = document.createElement("P");
  emptyP.innerHTML = " ⠀";
  empty.appendChild(emptyP);
  row2.appendChild(empty);
  row2.classList.add("spaceit");
  content.insertBefore(row2, content.childNodes[1]);
}

function setFlip(row2) {
  var flip = document.createElement("DIV");
  var aflip = document.createElement("A");
  aflip.text = "Flip users";
  aflip.href = "/shared.php?u1=" + user1.text + "&u2=" + user2.text;
  flip.appendChild(aflip);

  flip.style.display = "inline-block";
  row2.appendChild(flip);
  content.insertBefore(row2, content.childNodes[1]);
}

function setCompletedAuthRequired() {
  celll1.innerHTML = "Authenication required";
  celll1.style.textAlign = "center";
}

function setCompletedAuthNotRequired() {
  celll1.innerHTML = "Loading...";
  celll1.style.textAlign = "center";
}

function setMalGraph() {
  var row3 = document.createElement("DIV");
  var m1 = document.createElement("DIV");
  var m1t = document.createElement("A");
  m1t.text = `${user1.text}'s MalGraph`;
  m1t.href = `https://anime.plus/${user1.text}?referral=search`;
  m1.appendChild(m1t);
  row3.appendChild(m1);

  let p = document.createTextNode(" | ");
  m1.appendChild(p);

  var m2t = document.createElement("A");
  m2t.text = `${user2.text}'s MalGraph`;
  m2t.href = `https://anime.plus/${user2.text}?referral=search`;
  m1.appendChild(m2t);
  row3.appendChild(m1);

  row3.classList.add("spaceit");
  content.insertBefore(row3, content.childNodes[1]);
}

function gotMessage(message, sender, sendResponse) {
  if (message == "auth_required") {
    var row2 = document.createElement("DIV");
    setAuthentication(row2);
    setFlip(row2);
    if (doCompleted === true) {
      setCompletedAuthRequired();
    }

    if (doMalGraph === true) {
      setMalGraph();
    }

    const Button = document.querySelector("button");

    Button.addEventListener("click", () => {
      var message = {
        message: "login",
      };
      browser.runtime.sendMessage(message);
    });
  } else if (message == "auth_not_required") {
    var row2 = document.createElement("DIV");
    setFlip(row2);
    if (doCompleted === true) {
      setCompletedAuthNotRequired();
      sendNames(user1, user2);
    } else {
      if (doTags === true) {
        sendGenres();
      }
    }

    if (doMalGraph === true) {
      setMalGraph();
    }
  } else if (message == "authenticated") {
    location.reload();
  } else if (message == "end") {
    animes.sort(function (x, y) {
      return y.score - x.score;
    });
    roww.parentNode.removeChild(roww);
    for (let anime of animes) {
      var row = tables[1].insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      if (window.location.href.slice(-5) != "manga") {
        cell1.innerHTML =
          '<a href="/anime/' +
          anime.id +
          '/">' +
          anime.name +
          "</a>" +
          '<a href="https://myanimelist.net/ownlist/anime/add?selected_series_id=' +
          anime.id +
          '&amp;hideLayout=1" title="Quick add anime to my list" class="Lightbox_AddEdit button_add">add</a>';
      } else {
        cell1.innerHTML =
          '<a href="/manga/' +
          anime.id +
          '/">' +
          anime.name +
          "</a>" +
          '<a href="https://myanimelist.net/ownlist/manga/add?selected_series_id=' +
          anime.id +
          '&amp;hideLayout=1" title="Quick add manga to my list" class="Lightbox_AddEdit button_add">add</a>';
      }
      cell2.innerHTML = anime.score;
      cell1.classList.add("borderClass");
      cell2.classList.add("borderClass");
      cell2.style.textAlign = "center";
    }
    var row = tables[1].insertRow(-1);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = '<a href="#">Top</a>';
    cell1.classList.add("borderClass");
    cell1.style.cssText = "border-width: 0";

    row = tables[1].insertRow(-1);
    cell1 = row.insertCell(0);
    cell1.innerHTML = '<a href="#">Top</a>';
    cell1.classList.add("spaceit_pad");
    cell1.style.textAlign = "center";

    if (doTags === true) {
      sendGenres();
    }
  } else if (message == "array=0") {
    var row = tables[1].insertRow(1);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = "No entries";
    cell1.style.textAlign = "center";
  } else if (message.message == "genre") {
    let con = 0;
    table = tables[message.table].rows;
    for (let row of table) {
      if (con != 0) {
        let element = row.getElementsByClassName("borderClass")[0];
        let anime = element.innerHTML.slice(16, 22).split("/")[0];
        if (anime == message.anime) {
          element.innerHTML += message.genres.slice(0, -2);
        }
      } else {
        con += 1;
      }
    }
  } else {
    var anime = { id: message[0], name: message[1], score: message[2] };
    animes.push(anime);
  }
}
