console.log("hello");

// select button
const createWebsiteButton = document.getElementById("generate-button-id");

// add event listener
createWebsiteButton.addEventListener("click", async () => {
  // get API token
  const apiTokenInput = document.getElementById("api-token-id").value;

  // select file input
  const fileInput = document.getElementById("image-file-id");

  // select header title input
  const headerTitleInput = document.getElementById("header-title-id");

  // select alt text for Image
  const altImage = document.getElementById("image-alt-text-id").value;

  // enable button after required fields are filled in
  if (
    apiTokenInput != "" &&
    headerTitleInput.value != "" &&
    fileInput.value != ""
  ) {
    uploadFile(fileInput.files[0], apiTokenInput, altImage, headerTitleInput);
  } else {
    document.getElementById("buttonRequired-id").style.color = "orange";
    document.getElementById("buttonRequired-id").innerText =
      "fill in required fields";
  }
});

async function uploadFile(file, apiToken, altImage, headerTitleInput) {
  // create random 4 digit number to uniquely identify folder name
  var val = Math.floor(1000 + Math.random() * 9000);
  console.log(String(val));

  const websiteDiv = document.getElementById("website-div-id");
  const websiteLink = document.getElementById("web3-website-link-id");
  const fileInput = document.getElementById("image-file-id");
  // get website title input

  // add file to FormData object
  const userFormData = new FormData();
  userFormData.append("folderName", String(val));
  userFormData.append("image", file);
  userFormData.append("headerTitle", headerTitleInput.value);
  userFormData.append("token", apiToken);
  userFormData.append("altImage", altImage);
  console.log([...userFormData]);
  createWebsiteButton.classList.add("loading");
  createWebsiteButton.innerText = "wait";
  websiteDiv.style.visibility = "hidden";
  document.getElementById("buttonRequired-id").innerText = "";

  // send `POST` request
  await fetch("https://web3-website-maker.herokuapp.com/upload-files", {
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
        document.getElementById("api-token-id").style.borderColor = "red";
        document.getElementById("incorrectAPI-id").innerText =
          "API token is incorrect";
        createWebsiteButton.classList.remove("loading");
        createWebsiteButton.innerText = "Create Website on Web3.storage";
        throw Error("res status error: " + res.status);
      }
      if (res.status === 200) {
        createWebsiteButton.classList.remove("loading");
        createWebsiteButton.innerText = "Create Website on Web3.storage";
        return res.json();
      }
    })
    .then((data) => {
      //    console.log(data.url);
      websiteDiv.style.visibility = "visible";
      websiteLink.href = data.url;
      headerTitleInput.value = "";
      fileInput.value = "";
    })
    .catch((err) => console.error(err));
}
