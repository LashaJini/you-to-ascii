import "./global.css";
import styles from "./index.module.css";
import utilStyles from "./utils.module.css";

const defaultWidth = 50;
const defaultHeight = 50;
const wrapper = document.createElement("div");
const buttonsWrapper = document.createElement("div");
const notification = document.createElement("div");
const video = document.createElement("video");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const pre = document.createElement("pre");
const togglerButton = document.createElement("button");
const copyButton = document.createElement("button");
let paused = true;
let animationId = null;
const chars = "@#80GCLft1i!;:,. ";

const constraints = {
  audio: false,
  video: {
    width: defaultWidth,
    height: defaultHeight,
  },
};

function domSetup() {
  wrapper.className = styles.wrapper;
  buttonsWrapper.className = styles.buttonsWrapper;
  wrapper.append(buttonsWrapper);
  document.body.append(wrapper);

  /* just a "notificator" */
  notification.style.opacity = 0;
  notification.className = styles.notification;
  wrapper.append(notification);

  /* place video */
  video.autoplay = true;
  video.playsInline = true;
  video.style.display = "none";
  wrapper.append(video);

  /* we are capturing video data onto canvas */
  canvas.style.display = "none";
  canvas.width = defaultWidth;
  canvas.height = defaultHeight;
  wrapper.append(canvas);

  /* place button that plays/pauses video */
  togglerButton.innerText = "play";
  togglerButton.classList.add(styles.button, utilStyles.togglerBkg);
  buttonsWrapper.append(togglerButton);

  /* copies generated ascii text */
  copyButton.innerText = "copy";
  copyButton.classList.add(styles.button, utilStyles.copyBkg);
  buttonsWrapper.append(copyButton);

  /* we are dynamically inserting ascii into pre element */
  pre.textContent = "";
  pre.className = styles.pre;
  wrapper.append(pre);
}

function handleSuccess(stream) {
  video.srcObject = stream;
}

function handleError(err) {
  console.error(err);
}

function init() {
  domSetup();

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);

  addListeners();
}

function videoToASCII(ctx, pre) {
  let content = "";
  let w = ctx.canvas.width;
  let h = ctx.canvas.height;
  let arr = Array(w * h);
  let imageData;

  function render() {
    animate();
    animationId = requestAnimationFrame(render);
  }
  animationId = requestAnimationFrame(render);

  function animate() {
    setup();
    convertDataToGrayscale();
    generateASCII();
  }

  function setup() {
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(video, 0, 0, w, h);
    imageData = ctx.getImageData(0, 0, w, h);
    content = "";
    pre.textContent = "";
  }

  function generateASCII() {
    for (let i = 0; i < h; i++) {
      for (let j = w - 1; j >= 0; j--) {
        let index = Math.floor(((chars.length - 1) * arr[i * h + j]) / 255);
        content += chars[index];
      }
      content += "\n";
    }
    pre.textContent = content;
  }

  function convertDataToGrayscale() {
    let index = -1;
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];

      const grayScale = 0.2126 * r + 0.7152 * g + 0.072 * b;

      arr[++index] = grayScale;
    }
  }
}

function addListeners() {
  togglerButton.onclick = function (e) {
    if (paused) {
      paused = false;
      video.play();
      this.innerText = "pause";

      videoToASCII(ctx, pre);
    } else {
      paused = true;
      video.pause();
      this.innerText = "play";

      cancelAnimationFrame(animationId);
    }
  };

  copyButton.onclick = function (e) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(document.querySelector("pre").innerText);
      notify("success", "Copied to clipboard!");
    } else {
      console.error("navigator.clipboard not supported on your browser");
    }
  };
}

function notify(type, text) {
  if (type === "success") {
    notification.style.opacity = 1;
    notification.innerText = text;
    setTimeout(() => (notification.style.opacity = 0), 1300);
  }
}

init();
