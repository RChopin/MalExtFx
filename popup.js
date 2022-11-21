function setup() {
  browser.storage.local.get(["tags"], function (items) {
    document.getElementById("tags").checked = items["tags"];
  });
  browser.storage.local.get(["completed"], function (items) {
    document.getElementById("completed").checked = items["completed"];
  });
  browser.storage.local.get(["malgraph"], function (items) {
    document.getElementById("malgraph").checked = items["malgraph"];
  });
}

setup();

const checkbox1 = document.getElementById("tags");

checkbox1.addEventListener("change", (event) => {
  if (event.target.checked) {
    browser.storage.local.set({ tags: true }, function () {
      //  Data's been saved boys and girls, go on home
    });
  } else {
    browser.storage.local.set({ tags: false }, function () {
      //  Data's been saved boys and girls, go on home
    });
  }
});

const checkbox2 = document.getElementById("completed");

checkbox2.addEventListener("change", (event) => {
  if (event.target.checked) {
    browser.storage.local.set({ completed: true }, function () {
      //  Data's been saved boys and girls, go on home
    });
  } else {
    browser.storage.local.set({ completed: false }, function () {
      //  Data's been saved boys and girls, go on home
    });
  }
});

const checkbox3 = document.getElementById("malgraph");

checkbox3.addEventListener("change", (event) => {
  if (event.target.checked) {
    browser.storage.local.set({ malgraph: true }, function () {
      //  Data's been saved boys and girls, go on home
    });
  } else {
    browser.storage.local.set({ malgraph: false }, function () {
      //  Data's been saved boys and girls, go on home
    });
  }
});
