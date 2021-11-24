// declare environment
// to determine API url
let env = "dev";
let url;

if (env === "dev") {
  url = "http://localhost:8080/upload-files";
}

if (env === "prod") {
  url = "https://web3-website-maker.herokuapp.com/upload-files";
}

// select button Id
const createWebsiteButton = document.getElementById("generate-button-id");

// add click event listener that
// will get Input Ids, Input Values
createWebsiteButton.addEventListener("click", async () => {
  const apiTokenInput = document.getElementById("api-token-id");
  const fileInput = document.getElementById("image-file-id");
  const headerTitleInput = document.getElementById("header-title-id");
  const altImageInput = document.getElementById("image-alt-text-id");

  // check if Input fields is complete
  // if complete then call Function uploadFile
  // pass file selected, api token value, alt image value, and header title value
  if (
    apiTokenInput.value != "" &&
    headerTitleInput.value != "" &&
    fileInput.value != ""
  ) {
    uploadFile(fileInput, apiTokenInput, altImageInput, headerTitleInput);
  } else {
    // if the fields are incomplete
    // display error message
    document.getElementById("buttonRequired-id").style.display = "block";
    document.getElementById("buttonRequired-id").style.color = "orange";
    document.getElementById("buttonRequired-id").innerText =
      "fill in required fields";
  }
});

async function uploadFile(
  fileInput,
  apiTokenInput,
  altImageInput,
  headerTitleInput
) {
  // create random 4 digit number to create folder on server with a unique name
  var folderName = String(Math.floor(1000 + Math.random() * 9000));

  // grab website link element ID
  // we will use this to display the link after a successful response from the server
  const websiteLink = document.getElementById("web3-website-link-id");

  // add file and user input to FormData object
  const userFormData = new FormData();
  userFormData.append("folderName", folderName);
  userFormData.append("image", fileInput.files[0]);
  userFormData.append("headerTitle", headerTitleInput.value);
  userFormData.append("token", apiTokenInput.value);
  userFormData.append("altImage", altImageInput.value);
  console.log([...userFormData]);
  createWebsiteButton.classList.add("loading");
  createWebsiteButton.innerText = "wait";
  websiteLink.style.display = "none";
  document.getElementById("buttonRequired-id").innerText = "";
  document.getElementById("incorrectAPI-id").innerText = "";
  document.getElementById("api-token-id").style.borderColor = "#1a45df";

  // send `POST` request
  await fetch(url, {
    mode: "cors",
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: userFormData,
  })
    .then((res) => {
      // if status is OK from server, then set the button to its original text
      if (res.status === 200) {
        createWebsiteButton.classList.remove("loading");
        createWebsiteButton.innerText = "Create Website on Web3.storage";
        return res.json();
      }
    })
    .then((data) => {
      // display the website link with the URL from the backend server
      websiteLink.style.display = "block";
      websiteLink.href = data.url;
      headerTitleInput.value = "";
      fileInput.value = "";
    })
    .catch((err) => {
      // catch error and display a message
      // apply border styling
      // set the button to its original text
      console.log("error: " + err);
      document.getElementById("api-token-id").style.borderColor = "red";
      document.getElementById("incorrectAPI-id").innerText =
        "Something went wrong. Your API token might be incorrect";
      createWebsiteButton.classList.remove("loading");
      createWebsiteButton.innerText = "Create Website on Web3.storage";
    });
}
