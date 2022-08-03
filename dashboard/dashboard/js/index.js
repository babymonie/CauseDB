function checkStorage() {
  if (localStorage.getItem("token") == undefined) {
    return false;
  } else {
    return true;
  }
}
function getStorage() {
  return localStorage.getItem("token");
}
function auth() {
  fetch("/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: getStorage() || getToken(),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.title = "Hi, " + data.username;
      } else {
        document.location.href = "/login";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
async function check() {
  if (checkStorage() == false) {
    window.location.href = "/login";
  } else {
    auth();
  }
}
check();
