console.log("hello");

// select button
const createWebsiteButton = document.getElementById("generate-button-id");

// add event listener
createWebsiteButton.addEventListener("click", () => {
  // get API token
  const apiTokenInput = document.getElementById("api-token-id").value;

  // get website title input
  const websiteTitleInput = document.getElementById("website-title-id").value;

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
  fetch("http://localhost:8080/upload-files", {
    mode: "cors",
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: userFormData,
  })
    .then((res) => {
      console.log(res.status);
      return res.json();
    })
    .then((data) => {
      //    console.log(data.url);
      console.log(data.error);
      const websiteDiv = document.getElementById("website-div-id");
      const websiteLink = document.getElementById("web3-website-link-id");
      websiteDiv.style.visibility = "visible";
      websiteLink.href = data.url;
    })
    .catch((err) => console.error(err));
}
