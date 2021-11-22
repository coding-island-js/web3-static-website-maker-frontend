console.log("hello");

// select button
const createWebsiteButton = document.getElementById("generate-button-id");

// add event listener
createWebsiteButton.addEventListener("click", async () => {
  // get API token
  const apiTokenInput = document.getElementById("api-token-id").value;

  // get website title input
  const websiteTitleInput = await sanitizeInput(
    document.getElementById("website-title-id").value
  );

  // select file input
  const fileInput = document.getElementById("image-file-id");

  // enable button after required fields are filled in
  if (apiTokenInput != "" && websiteTitleInput != "" && fileInput.value != "") {
    uploadFile(fileInput.files[0], apiTokenInput, websiteTitleInput);
  } else {
    document.getElementById("buttonRequired-id").style.color = "orange";
    document.getElementById("buttonRequired-id").innerText =
      "fill in required fields";
  }
});

async function uploadFile(file, apiToken, websiteTitle) {
  // create random 4 digit number to uniquely identify folder name
  var val = Math.floor(1000 + Math.random() * 9000);
  console.log(String(val));
  // add file to FormData object
  const userFormData = new FormData();
  userFormData.append("folderName", String(val));
  userFormData.append("image", file);
  userFormData.append("websiteTitle", websiteTitle);
  userFormData.append("token", apiToken);
  console.log([...userFormData]);

  // send `POST` request
  await fetch("http://localhost:8080/upload-files", {
    mode: "cors",
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: userFormData,
  })
    .then((res) => {
      console.log(res.status);
      if (res.status == 403) {
        console.log("API token is incorrect");
        return false;
      }
      return res.json();
    })
    .then((data) => {
      //    console.log(data.url);
      const websiteDiv = document.getElementById("website-div-id");
      const websiteLink = document.getElementById("web3-website-link-id");
      const fileInput = document.getElementById("image-file-id");
      // get website title input
      const websiteTitleInput = document.getElementById("website-title-id");
      websiteDiv.style.visibility = "visible";
      websiteLink.href = data.url;
      websiteTitleInput.value = "";
      fileInput.value = "";
    })
    .catch((err) => console.error(err));
}

// sanitize input
var tagBody = "(?:[^\"'>]|\"[^\"]*\"|'[^']*')*";

var tagOrComment = new RegExp(
  "<(?:" +
    // Comment body.
    "!--(?:(?:-*[^->])*--+|-?)" +
    // Special "raw text" elements whose content should be elided.
    "|script\\b" +
    tagBody +
    ">[\\s\\S]*?</script\\s*" +
    "|style\\b" +
    tagBody +
    ">[\\s\\S]*?</style\\s*" +
    // Regular name
    "|/?[a-z]" +
    tagBody +
    ")>",
  "gi"
);

async function sanitizeInput(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, "");
  } while (html !== oldHtml);
  return html.replace(/</g, "&lt;");
}
