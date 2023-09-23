const nav = document.querySelector("nav");
const input = document.querySelector("input");
const imageBefore = document.querySelector("#img_before");
const imageAfter = document.querySelector("#img_after");
const hidden = document.querySelector("#hidden");
const rmContainer = document.querySelector(".rm_container");
const rmSubContent1 = document.querySelector(".rm_subContent1");
const rmSubContent = document.querySelector(".rm_subContent");
const heading = document.querySelector(".heading");
const subHeading = document.querySelector(".sub_heading");
const textContent = document.querySelector(".text_content");
const tryBtn = document.querySelector("#try_btn");
const loader = document.querySelector(".loader");
const btn = document.querySelector("#btn");
const imgBtn1 = document.querySelector(".btn_img_1");
const imgBtn2 = document.querySelector(".btn_img_2");
const imgBtn3 = document.querySelector(".btn_img_3");
const imgBtn4 = document.querySelector(".btn_img_4");
const notificationModal = document.querySelector(".notification_modal");
const rmImgBefore = document.querySelector(".rm_img_before");
const cross = document.querySelector(".cross");
const modalContent2 = document.querySelector(".modal_content2");
const modalContentBox = document.querySelector(".modal_content1 div");
const mode = document.querySelector(".mode");
const download = document.querySelector(".download");
const modeCircle = document.querySelector(".mode_circle");

let globalMode = "light";

// handle modal close
let timer = "";

// this function run when Dom content is fully loaded

const init = () => {
  // handle close of notification
  cross.addEventListener("click", () => {
    if (timer) clearTimeout(timer);
    notificationModal.classList.add("transform_out");
    modalContent2.style.width = "0%";
    modalContent2.style = "transition-duration:0s;";
    if (globalMode === "dark") {
      modalContentBox.style = "color:black;font-weight:600";
      modalContentBox.nextElementSibling.style = "color:black";
    } else {
      modalContentBox.style = "color:white;font-weight:600";
      modalContentBox.nextElementSibling.style = "color:white";
    }
    modalContent2.style = "transition-duration:9s;";
  });

  // auto close notification after 9s
  const handleAutoClose = () => {
    modalContent2.style.width = "100%";
    timer = setTimeout(() => {
      if (!notificationModal.classList.contains("transform_out")) {
        cross.click();
      }
    }, 9000);
  };

  // handle all notifications
  const handleMessage = (str, isWarning = true) => {
    modalContentBox.textContent = str;
    if (isWarning) {
      modalContentBox.style = `color:red;font-weight:600`;
    } else {
      if (globalMode === "dark") {
        modalContentBox.style = "color:black;font-weight:600";
        modalContentBox.nextElementSibling.style = "color:black";
      } else {
        modalContentBox.style = "color:white;font-weight:600";
        modalContentBox.nextElementSibling.style = "color:white";
      }
    }
    if (notificationModal.classList.contains("transform_out")) {
      notificationModal.classList.remove("transform_out");
    }
    notificationModal.classList.add("transform_in");
    handleAutoClose();
  };

  // handle input clicks

  btn.addEventListener("click", () => {
    input.click();
  });
  tryBtn.addEventListener("click", () => {
    removeElement(imageBefore, imageAfter);
    hidden.style.display = "none";
    rmSubContent.style.display = "block";
    rmSubContent1.style.display = "block";
  });

  // creating the image Element
  const createElement = (imgElement, source, id = "") => {
    let img = document.createElement("img");
    img.src = source;
    img.style.width = "inherit";
    img.style.height = "inherit";
    img.id = id;
    imgElement.appendChild(img);
    rmSubContent.style.display = "none";
    rmSubContent1.style.display = "none";
    setTimeout(() => {
      hidden.style.display = "block";
    }, 100);
  };

  //reading and create the input and drag image files
  const readAndCreateElement = (file, imgElement) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      createElement(imgElement, reader.result);
    };
  };

  // Removing image element
  const removeElement = (imageElement, imageElement1 = null) => {
    if (imageElement.firstElementChild) {
      imageElement.removeChild(imageElement.firstElementChild);
    }
    if (imageElement1 && imageElement1.childElementCount > 1) {
      imageElement1.removeChild(imageElement1.lastElementChild);
    }
  };

  // Initialize the background removing process
  const bgRemoverInit = async (file) => {
    try {
      // disabling the try another button and also download button
      loader.style.display = "flex";
      tryBtn.style = "cursor:not-allowed;pointer-events:none";
      tryBtn.setAttribute("disabled", true);
      download.style = "cursor:not-allowed;pointer-events:none";
      download.setAttribute("disabled", true);
      // reading the file and create the element
      readAndCreateElement(file, imageBefore);

      //   removing the background
      const imageBlob = await removeBackGround(file);
      const objectURL = URL.createObjectURL(imageBlob);

      // showing message
      handleMessage("Hey, background is removed from the image.", false);

      // display image and also set its id
      createElement(imageAfter, objectURL, "resultImg");
    } catch (err) {
      handleMessage("Something went wrong, Try again!!");
      console.log(err);
    } finally {
      loader.style.display = "none";
      // enabling the try another button and also download button
      tryBtn.style = "cursor:pointer;pointer-events:all;";
      tryBtn.removeAttribute("disabled");
      download.style = "cursor:pointer;pointer-events:all;";
      download.removeAttribute("disabled");
    }
  };

  //handle input image file

  input.addEventListener("change", async () => {
    const files = input.files;

    if (files && files.length > 0) {
      try {
        await bgRemoverInit(files[0]);
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      // show error for multiple file upload..
      handleMessage("Something happen wrong!! Try again!");
    }
  });

  // for try out inputs
  imgBtn1.addEventListener("click", async () => {
    const src = imgBtn1.firstElementChild.src;
    const res = await fetch(src);
    const blob = await res.blob();

    await bgRemoverInit(blob);
  });

  imgBtn2.addEventListener("click", async () => {
    const src = imgBtn2.firstElementChild.src;
    const res = await fetch(src);
    const blob = await res.blob();

    await bgRemoverInit(blob);
  });

  imgBtn3.addEventListener("click", async () => {
    const src = imgBtn3.firstElementChild.src;
    const res = await fetch(src);
    const blob = await res.blob();

    await bgRemoverInit(blob);
  });

  imgBtn4.addEventListener("click", async () => {
    const src = imgBtn4.firstElementChild.src;
    const res = await fetch(src);
    const blob = await res.blob();

    await bgRemoverInit(blob);
  });

  // drag and drop logic

  const active = () => rmSubContent.classList.add("border_color");
  const inActive = () => rmSubContent.classList.remove("border_color");

  const prevents = (e) => e.preventDefault();

  //preventing the default behaviour of element
  ["dragover", "dragover", "drop", "dragleave"].forEach((event) => {
    rmSubContent.addEventListener(event, prevents);
  });

  ["dragenter", "dragover"].forEach((event) => {
    rmSubContent.addEventListener(event, active);
  });

  ["dragleave", "drop"].forEach((event) => {
    rmSubContent.addEventListener(event, inActive);
  });

  rmSubContent.addEventListener("drop", handleDrop);

  // handle download

  download.addEventListener("click", () => {
    const img = document.getElementById("resultImg");
    if (!img) {
      handleMessage("No Image to Download, Try again");
      return;
    }
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    handleMessage("Downloading started", false);
    download.setAttribute("disabled", true);
    setTimeout(() => {
      download.removeAttribute("disabled");
      document.body.removeChild(a);
    }, 1000);
  });

  // handle modes
  mode.addEventListener("click", () => {
    if (modeCircle.classList.contains("left")) {
      modeCircle.classList.remove("left");
      modeCircle.classList.add("right");
      mode.style = "background-color:white;";
      rmContainer.style = "background-image: url(./images/dark.avif);";
      nav.style.backgroundColor = "black";
      heading.style.color = "white";
      subHeading.style.color = "white";
      textContent.style.color = "white";
      notificationModal.style = "color:black;background-color:white";
      rmImgBefore.style = "color:white";
      document.body.style = "background-color:black";
      document.body.style.scrollbarBaseColor = "black";
      globalMode = "dark";
      return;
    }
    modeCircle.classList.remove("right");
    modeCircle.classList.add("left");
    mode.style = "background-color:black;";
    rmContainer.style =
      "background-image: url(https://static.fotor.com/app/features/static/media/image_no_bg.e9d2eb5f.svg);";
    nav.style.backgroundColor = "#f2f3f7";
    heading.style.color = "black";
    subHeading.style.color = "black";
    textContent.style.color = "black";
    notificationModal.styl = "color:white;background-color:black";
    rmImgBefore.style = "color:black";
    document.body.style = "background-color:white";
    document.body.style.scrollbarBaseColor = "white";
    globalMode = "light";
  });
};
document.addEventListener("DOMContentLoaded", init);

// handling drop files
const handleDrop = async (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files && files.length >= 2) {
    handleMessage("Please select only one image.");
    return;
  }

  if (files && files[0].type.split("/")[0] !== "image") {
    handleMessage("Please select an image.");
    return;
  }

  try {
    await bgRemoverInit(files[0]);
  } catch (error) {
    handleMessage("Some error appear. Try again!");
    console.log("Error", error);
  }
};

// If api key is not working then go login to photoroom website and take your apikey and also you can use only for 10 images per month..
const apiKey = "81ce527cdccf5e31a3faa673036a3c1f0446ad8d";
const url = "https://sdk.photoroom.com/v1/segment";

//background remvover function..
const removeBackGround = async (files) => {
  const formData = new FormData();
  formData.append("image_file", files);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    console.log(response.json());
    throw new Error("Network response was not ok");
  }

  const imageBlog = await response.blob();

  return imageBlog;
};
