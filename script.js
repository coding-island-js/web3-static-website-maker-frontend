console.log("hello");

// select file input
const fileInput = document.getElementById("image-file-id");

// add event listener
fileInput.addEventListener("change", () => {
  uploadFile(fileInput.files[0]);
});

async function uploadFile(file) {
  // get API token
  const apiTokenInput = document.getElementById("api-token-id").value;

  // get website title input
  const websiteTitleInput = document.getElementById("website-title-id").value;
  // add file to FormData object
  const userFormData = new FormData();
  userFormData.append("image", file);
  userFormData.append("websiteTitle", websiteTitleInput);
  userFormData.append("token", apiTokenInput);
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
    .then((res) => res.json())
    .then((data) => {
      console.log(data.url);
      const websiteDiv = document.getElementById("website-div-id");
      const websiteLink = document.getElementById("web3-website-link-id");
      websiteDiv.style.visibility = "visible";
      websiteLink.href = data.url;
    })
    .catch((err) => console.error(err));
}
