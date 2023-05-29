import { changeColorComponent } from "./components.js";
import { xrLightComponent, xrLightSystem } from "./xrlight.js";


import { tapHotspotComponent } from "./tap-hotspot.js";

//import { metalnessComponent } from "./metalness.js";

import { chromaKeyShader } from "./chroma-key.js";
import { targetVideoComponent } from "./target-video.js";


var sfx_button_1, sfx_button_2, sfx_button_3;

var lets_go_clicked = false, take_action_clicked = false;
localStorage.removeItem("is_age_18");
localStorage.removeItem("lets_go_clicked_once");
if (localStorage.getItem("lets_go_clicked_once") === null) var lets_go_clicked_once = false;
else var lets_go_clicked_once = localStorage.getItem("lets_go_clicked_once");

var hotSpot1Clicked = false
var hotSpot2Clicked = false
var hotSpot3Clicked = false
var hotSpot4Clicked = false
var hotSpot5Clicked = false

export function hotSpot1ClickedFunc() {
  hotSpot1Clicked = true
}
export function hotSpot2ClickedFunc() {
  hotSpot2Clicked = true
}
export function hotSpot3ClickedFunc() {
  hotSpot3Clicked = true
}
export function hotSpot4ClickedFunc() {
  hotSpot4Clicked = true
}
export function hotSpot5ClickedFunc() {
  hotSpot5Clicked = true
}

var yrot;
var radius;
var allowedTapToPlace = false;
var infoShowing = false;
var infoCounter = 0;
var gameCamera;
var tapToPlaceGrid;
var infoShowingTimer;
var isLowPowerModeChecked = false

var validateState = false;
var allHotSpotClicked = false

var gameTime = 30000;

const tapToPlaceRaycaster = new THREE.Raycaster();
var rayOrigin = new THREE.Vector2(0, 0);
var cursorLocation = new THREE.Vector3(0, 0, 0);
var ground;
var positionCursor = new THREE.Vector3(0, 0, 0);

var isMuted = false;

var intro1Timer;

export var finalTimer;
var timerReturnToVR;

var currentURL = "https://www.google.com/";

var sfx_background, sfx_vibro, sfx_woosh;
var tapToPlaceTimer;
var scene;

var sec;

var man, glb, videoBoostEntity, verticalRotation, horizontalRotation;

var shareDataBlob;
var shareImage;

var shareImg;

var allowedToScan = false;

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});

var checking8thwallSupport = () => {
  if (!window.XR8.XrDevice.isDeviceBrowserCompatible({ allowedDevices: XR8.XrConfig.device().MOBILE })) {
    document.getElementById("notification_8thwall_not_supported").style.display = "flex"
    setTimeout(() => {
      location.href = 'https://www.discoverglo.com/it/it/discover-glo';
    }, 3000);
  }
};

window.XR8 ? checking8thwallSupport() : window.addEventListener('xrloaded', checking8thwallSupport)


const method1 = () => {
  // add image to the document
  document.body.insertAdjacentHTML('afterbegin', `
    <img id="frame" src='./assets/frame.png' style="display: none;">`)

  // add image to captured media
  XRExtras.MediaRecorder.configure({
    onProcessFrame: ({ ctx }) => {
      // add a white border
      // ctx.strokeStyle = 'white'
      // ctx.lineWidth = 40
      // ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      // add a photo frame
      const img = document.getElementById('frame')
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, ctx.canvas.width, ctx.canvas.height)
    },
  })
}
const method2 = () => {
  // add image and overlay canvas to the document
  document.body.insertAdjacentHTML('afterbegin', `
    <img id="frame" src='./assets/frame.png'>
    <canvas id="overlay" style="z-index: 1"></canvas>`)
  // setup overlay canvas
  const canvas = document.getElementById('overlay')
  const ctx = canvas.getContext('2d')
  const img = document.getElementById('frame')
  // add photo frame to overlay canvas
  img.onload = () => {
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height)
  }
  // set foreground canvas
  window.XR8.CanvasScreenshot.setForegroundCanvas(canvas)
  window.XRExtras.MediaRecorder.configure({
    foregroundCanvas: canvas,
  })
}
const onxrextrasloaded = () => {
  method1()
}
window.XRExtras ? onxrextrasloaded() : window.addEventListener('xrextrasloaded', onxrextrasloaded)

$(document).ready(function () {


  document.getElementById("video").addEventListener('suspend', () => {
    // suspend invoked
    // show play button
    // iphone is in low power mode
    if (isLowPowerModeChecked) return
    isLowPowerModeChecked = true
    console.log("iphone is in low power mode")

    $('#low_power_warning').css('display', 'block');


  });

  document.getElementById("video").addEventListener('play', () => {
    // video is played
    // remove play button UI
    // iphone is not in low power mode
    if (isLowPowerModeChecked) return
    isLowPowerModeChecked = true
    console.log("iphone is not in low power mode")

    $('#low_power_warning').css('display', 'none');
  });
  document.getElementById("video").play()

  // bitmaps cause texture issues on iOS this workaround prevents black textures and crashes
  const IS_IOS =
    /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
    (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
  if (IS_IOS) {
    window.createImageBitmap = undefined
  }


  AFRAME.registerComponent("alfa-test", {
    dependencies: ["material"],

    init: function () {
      var material = this.el.getObject3D("mesh").material;
      material.alphaTest = 0.5;
      material.needsUpdate = true;
      material.depthWrite = false;
    },
  });


  AFRAME.registerComponent("change-color", changeColorComponent);

  AFRAME.registerComponent("xr-light", xrLightComponent);
  AFRAME.registerSystem("xr-light", xrLightSystem);

  AFRAME.registerComponent("tap-hotspot", tapHotspotComponent);

  AFRAME.registerComponent('custom_one_finger_rotate', {
    schema: {
      factor: { default: 6 },
    },
    init() {
      this.handleEvent = this.handleEvent.bind(this)
      //this.el.sceneEl.addEventListener('onefingermove', this.handleEvent)
      this.el.classList.add('cantap')  // Needs "objects: .cantap" attribute on raycaster.
      this.verticalRot = 0;
      this.yAxisRot = 0;
      this.onceTapped = false
    },
    remove() {
      this.el.sceneEl.removeEventListener('onefingermove', this.handleEvent)
    },
    handleEvent(event) {
      console.log("onefingermove")
      clearTimeout(finalTimer); console.log("clearTimeout(finalTimer)");
      this.verticalRot += (event.detail.positionChange.y * this.data.factor) * (180 / Math.PI)
      if (!this.onceTapped) {
        var verticalRotation = 0
        var timerverticalRotation = 500
        document.getElementById("verticalRotation").setAttribute("animation", {
          'property': 'rotation',
          'to': { x: 0, y: verticalRotation, z: 0 }, 'dur': timerverticalRotation
        });
        setTimeout(() => {
          document.getElementById("verticalRotation").setAttribute("rotation", { x: verticalRotation, y: 0, z: 0 });
          document.getElementById("verticalRotation").removeAttribute("animation");
        }, timerverticalRotation + 50);

      }
      else document.getElementById("verticalRotation").setAttribute("rotation", { x: this.verticalRot % 360, y: 0, z: 0 })


      //document.getElementById("verticalRotation").setAttribute("rotation", { x: this.verticalRot % 360, y: 0, z: 0 })
      //document.getElementById("verticalRotation").setAttribute("rotation", { x: this.verticalRot % 360, y: 0, z: 0 })
      this.el.object3D.rotation.y += (event.detail.positionChange.x * this.data.factor) % (2 * Math.PI)

      this.onceTapped = true

      console.log((document.getElementById("horizontalRotation").object3D.rotation.y) * (180 / Math.PI) + " " +
        (document.getElementById("verticalRotation").object3D.rotation.x) * (180 / Math.PI))

    },
    tick: function () {
      //console.log(document.getElementById("verticalRotation").getAttribute('rotation'))
    },
    qux: function (e) {
      if (e)
        this.el.sceneEl.addEventListener('onefingermove', this.handleEvent)
      else
        this.el.sceneEl.removeEventListener('onefingermove', this.handleEvent)
    },
  }
  );

  AFRAME.registerComponent('custom_pinch_scale', {
    schema: {
      min: { default: 0.33 },
      max: { default: 3 },
      scale: { default: 0 },  // If scale is set to zero here, the object's initial scale is used.
    },
    init() {
      const s = this.data.scale
      this.initialScale = (s && { x: s, y: s, z: s }) || this.el.object3D.scale.clone()
      this.scaleFactor = 1
      this.handleEvent = this.handleEvent.bind(this)
      //this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
      this.el.classList.add('cantap')  // Needs "objects: .cantap" attribute on raycaster.
    },
    remove() {
      this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
    },
    handleEvent(event) {
      this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread
      this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z
    },
    qux: function (e) {
      if (e)
        this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
      else
        this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
    },

  }
  );

  AFRAME.registerShader('chromakey', chromaKeyShader)
  AFRAME.registerComponent('target-video', targetVideoComponent)

  scene = document.querySelector("#main_scene")
  man = document.getElementById("man");
  glb = document.getElementById("glb");
  horizontalRotation = document.getElementById("horizontalRotation");
  verticalRotation = document.getElementById("verticalRotation");



  ground = document.querySelector("#ground");
  tapToPlaceGrid = document.querySelector("#flat_surface");

  sfx_background = new Howl({
    src: ["./assets/sfx/lost-vesky-musicbed.mp3"],
    autoplay: false,
    loop: true,
    volume: 1.0,
  });

  sfx_button_1 = new Howl({
    src: ["./assets/sfx/BUTTON_click-01.mp3"],
    autoplay: false,
    loop: false,
  });

  sfx_button_2 = new Howl({
    src: ["./assets/sfx/BUTTON_click-02.mp3"],
    autoplay: false,
    loop: false,
  });

  sfx_button_3 = new Howl({
    src: ["./assets/sfx/BUTTON_click-03.mp3"],
    autoplay: false,
    loop: false,
  });

  sfx_vibro = new Howl({
    src: ["./assets/sfx/vibro.mp3"],
    autoplay: false,
    loop: false,
  });

  sfx_woosh = new Howl({
    src: ["./assets/sfx/woosh.mp3"],
    autoplay: false,
    loop: false,
    rate: 0.1
  });
  $("#low_power_warning").click(function () {
    $("#low_power_warning").css("display", "none");
  })

  $("#outro_button_1").click(function () {
    click_sound();
    window.open(
      "https://www.discoverglo.com/it/",
      "_blank" // <- This is what makes it open in a new window.
    );
  });



  $("#find_out_more_bottom").click(function () {
    click_sound();
    window.open(
      "https://www.discoverglo.com/it/it/discover-glo​",
      "_blank" // <- This is what makes it open in a new window.
    );
  })
  $("#outro_button_2").click(function () {
    click_sound();
    startAgain();
  });

  $("#tap_to_place").click(function () {
    if (!allowedTapToPlace) return;
    click_sound();
    tapToPlaceGrid.setAttribute("visible", false);
    //scene.emit("recenter");
    setTimeout(() => {
      sceneInit()
    }, 350);


  });



  $("#button_submit").click(function () {
    click_sound();
    if (
      !document.getElementById("check-box").checked ||
      !validateState ||
      !document.getElementById("name").value
    )
      return;
    ajaxFunc();

    window.open(
      currentURL,
      "_blank" // <- This is what makes it open in a new window.
    );
  });

  $("#intro_1_text").click(() => {
    click_sound();
    intro();
    clearTimeout(intro1Timer);
  });

  $("#lets_go").click(() => {

    if (lets_go_clicked) return
    /*
    if (lets_go_clicked_once == false) {
      window.open(
        "https://www.discoverglo.com/it/",
        "_blank" // <- This is what makes it open in a new window.
      );
      lets_go_clicked_once = true;
      localStorage.setItem("lets_go_clicked_once", "true");
      return
    }
    */
    allowedToScan = true;

    lets_go_clicked = true;

    $("#lets_go").addClass("lets_go_on");
    click_sound()
    setTimeout(() => {

      $("#intro_background").css("display", "none");

      $("#bottom_bar").css("display", "none");

      $("#lets_go").css("display", "none");
      $("#intro_1_text").css("display", "none");

      $("#tap_to_place").css("display", "none");

      lets_go_clicked = false;
    }, 1000);
    scene.emit("recenter");

    document.getElementById('man').setAttribute("position", `0 12 ${document.getElementById('man').object3D.position.z - 3}`)
    document.getElementById('man').setAttribute("visible", true)

    sceneInitRun()
  });

  // Get Page Elements

  const shareData = {
    title: "AR Experience",
    text: "The experience link",
    url: window.location.href,
  };


  var handleCameraStatusChange = function handleCameraStatusChange(event) {
    console.log("camera status change", event.detail.status);
    if (
      event.detail.status == "hasStream" ||
      event.detail.status == "hasDesktop3D"
    ) {

      horizontalRotation.setAttribute("scale", "0.0001 0.0001 0.0001");

      document.getElementById("video").play();

      setTimeout(() => {
        document.getElementById("video").pause();
        document.getElementById("video").currentTime = 0;
        $("#iyp_loading").css("display", "none");
        $("#low_power_warning").css("display", "none");
        console.log(localStorage.getItem("is_age_18"))
        if (localStorage.getItem("is_age_18") === null) intro_age_verification();
        if (localStorage.getItem("is_age_18") === "false") intro_age_verification();
        if (localStorage.getItem("lets_go_clicked_once") === null && localStorage.getItem("is_age_18") === "true") intro();
        if (localStorage.getItem("lets_go_clicked_once") === "true") intro();
        //|| localStorage.getItem("lets_go_clicked_once") === "true"
      }, 1000);

      //localStorage.getItem("lets_go_clicked_once") ===null
    }
  };

  document
    .querySelector("#main_scene")
    .addEventListener("camerastatuschange", handleCameraStatusChange);

  $("#take_action").click(function () {

    if (take_action_clicked) return
    take_action_clicked = true;

    $("#take_action").addClass("take_action_on");
    click_sound();

  });


  document.getElementById("video").addEventListener("play", (event) => { console.log("videoplay") });


  async function shareFunc() {
    try {

      await navigator.share(shareData);
      console.log("AR Experience shared successfully");
    } catch (err) {
      console.log("Error: " + err);
    }

  }

  $("#btn_soundToggle").click(function () {
    isMuted = !isMuted;
    //click_sound();
    if (isMuted == true) {

      sfx_background.volume(0);
      sfx_button_1.volume(0);
      sfx_button_2.volume(0);
      sfx_button_3.volume(0);
      sfx_vibro.volume(0);
      sfx_woosh.volume(0);
      $("#btn_soundToggle").removeClass("on");
      $("#btn_soundToggle").addClass("off");
    } else {

      sfx_background.volume(1.0);
      sfx_button_1.volume(1.0);
      sfx_button_2.volume(1.0);
      sfx_button_3.volume(1.0);
      sfx_vibro.volume(1.0);
      sfx_woosh.volume(1.0);
      $("#btn_soundToggle").addClass("on");
      $("#btn_soundToggle").removeClass("off");
    }
  });

  $("#btn_recenter").click(function () {
    click_sound();
    console.log("Recenter");

    scene.emit("recenter");
  });

  $("#button_verification_18").click(function () {
    click_sound();
    intro();
    localStorage.setItem("is_age_18", "true")
  });

  $("#button_verification_no_18").click(function () {
    click_sound();
    //intro();
    user_is_underage();
    localStorage.setItem("is_age_18", "false")
  });

  document
    .querySelector("#main_scene")
    .addEventListener("screenshotready", (e) => {
      // Hide the flash
      console.log("screenshotready");
      // container.classList.remove('flash')
      // If an error occurs while trying to take the screenshot, e.detail will be empty.
      // We could either retry or return control to the user
      if (!e.detail) {
        return;
      }

      //Polaroid
      var strMime = "image/jpeg";
      var imgData = "data:image/jpeg;base64," + e.detail;

      var canvasImg = document.createElement("img");
      document.body.appendChild(canvasImg);
      canvasImg.onload = function () {
        var img_game_button_press_overlay = new Image(); // Create new img element
        img_game_button_press_overlay.addEventListener(
          "load",
          function () {
            var img2 = new Image(); // Create new img element
            img2.addEventListener(
              "load",
              function () {
                var img_game_left_overlay = new Image(); // Create new img element
                img_game_left_overlay.addEventListener(
                  "load",
                  function () {
                    var img_img_logo = new Image(); // Create new img element
                    img_img_logo.addEventListener(
                      "load",
                      function () {
                        var img_game_count_down_bg_opverlay = new Image(); // Create new img element
                        img_game_count_down_bg_opverlay.addEventListener(
                          "load",
                          function () {
                            var img_game_right_overlay = new Image(); // Create new img element
                            img_game_right_overlay.addEventListener(
                              "load",
                              function () {
                                var canvas = $("#polaroidHolder")[0];
                                var ctx = canvas.getContext("2d");

                                ctx.canvas.width = canvasImg.width;
                                ctx.canvas.height = canvasImg.height;
                                var canvasWidth = canvas.width;
                                var canvasHeight = canvas.height;

                                ctx.fillStyle = "#ffffff";
                                ctx.filter = "blur(16px)";
                                ctx.fillRect(0, 0, canvasWidth, canvasHeight);

                                ctx.drawImage(
                                  canvasImg,
                                  20,
                                  20,
                                  canvasWidth - 40,
                                  canvasHeight - 40
                                );
                                /*
                              ctx.fillStyle = "#ffffff";
                              ctx.fillRect(
                                0,
                                (canvasHeight/10)*9,
                                canvasWidth,
                                canvasHeight/10
                              );
                              */

                                ctx.drawImage(
                                  img2,
                                  20,
                                  canvasHeight - canvasWidth * 0.3,
                                  canvasWidth - 40,
                                  (canvasWidth - 40) * 0.457
                                );

                                ctx.drawImage(
                                  img_game_button_press_overlay,
                                  0,
                                  canvasHeight - canvasWidth,
                                  canvasWidth,
                                  canvasWidth
                                );

                                ctx.drawImage(
                                  img_game_count_down_bg_opverlay,
                                  20,
                                  canvasHeight - canvasWidth * 0.55,
                                  canvasWidth / 4,
                                  canvasWidth / 4
                                );

                                ctx.drawImage(
                                  img_game_left_overlay,
                                  20,
                                  canvasHeight - canvasWidth * 0.55,
                                  canvasWidth / 4,
                                  canvasWidth / 4
                                );

                                ctx.drawImage(
                                  img_img_logo,
                                  canvasWidth * 0.2,
                                  20,
                                  canvasWidth * 0.6,
                                  canvasWidth * 0.6
                                );

                                ctx.drawImage(
                                  img_game_right_overlay,
                                  3 * (canvasWidth / 4) - 20,
                                  canvasHeight - canvasWidth * 0.55,
                                  canvasWidth / 4,
                                  canvasWidth / 4
                                );


                                const imgFame = document.getElementById('frame')
                                ctx.drawImage(imgFame, 0, 0, imgFame.naturalWidth, imgFame.naturalHeight, 0, 0, canvasWidth, canvasHeight)


                                var myImage = canvas.toDataURL("image/png");
                                shareImage = myImage;

                                window.dispatchEvent(new Event("ensurecamerastart"));

                                var imageElement =
                                  document.getElementById("polaroidImage");
                                imageElement.src = myImage;

                                $("#polaroidShare").css("display", "block");
                                $("#hold_to_save").css("display", "block");
                                $("#btnClosePolaroid").css("display", "block");
                              },
                              false
                            );
                            img_game_right_overlay.src =
                              document.getElementById("empty").src;
                          },
                          false
                        );
                        img_game_count_down_bg_opverlay.src =
                          document.getElementById("empty").src;
                      },
                      false
                    );
                    img_img_logo.src = document.getElementById("empty").src;
                  },
                  false
                );
                img_game_left_overlay.src =
                  document.getElementById("empty").src;
              },
              false
            );
            img2.src = document.getElementById("empty").src; // Set source path
          },
          false
        );
        img_game_button_press_overlay.src =
          document.getElementById("empty").src;
      };
      canvasImg.src = imgData.replace(strMime, "image/octet-stream");
      //Polaroid

    });

  $("#btnClosePolaroid").click(function () {
    $("#polaroidShare").css("display", "none");
    $("#btnClosePolaroid").css("display", "none");
    $("#ar_mode_takePhoto_button").css("display", "block");

    click_sound();
  });


  $("#btnCloseInfo").click(function () {
    $("#info").css("display", "none");

    clearTimeout(infoShowingTimer);
    infoShowing = false;
    click_sound();
    document.getElementById("hot_spot1").setAttribute("visible", true);
    document.getElementById("hot_spot2").setAttribute("visible", true);
    document.getElementById("hot_spot3").setAttribute("visible", true);
    document.getElementById("hot_spot4").setAttribute("visible", true);
    document.getElementById("hot_spot5").setAttribute("visible", true);
    document.getElementById("boost").setAttribute("visible", false)
    console.log(hotSpot1Clicked, hotSpot2Clicked, hotSpot3Clicked, hotSpot4Clicked, hotSpot5Clicked)
    if (hotSpot1Clicked && hotSpot2Clicked && hotSpot3Clicked && hotSpot4Clicked && hotSpot5Clicked) allHotSpotsClicked();
    if (allHotSpotClicked) {
      finalFrame();
      console.log(`removeEventListener("animation-finished"`)
      document.getElementById("glb").removeEventListener("animation-finished", foo, true)
    }

  });

  document
    .getElementById("ar_mode_takePhoto_button")
    .addEventListener("touchstart", async function (e) {
      //console.log(e);
      document.querySelector("#main_scene").emit("screenshotrequest");
      $("#polaroidShare").css("display", "none");
      $("#btnClosePolaroid").css("display", "none");

      $("#polaroidImage").addClass("noselect");
      $("#ar_mode_takePhoto_button").addClass("animated pulse faster");

      $("#info").css("display", "none");
      clearTimeout(infoShowingTimer);
      infoShowing = false;
      click_sound();

    });


  $("#hold_to_save").click(async () => {
    try {
      click_sound()
      await navigator.share(shareDataBlob);
      console.log("MDN shared successfully");
    } catch (err) {
      console.log("Error: " + err);
    }
  });

  window.addEventListener("ensurecamerastart", async function (e) {
    const blob = await (await fetch(shareImage)).blob();
    const filesArray = [
      new File([blob], "photo.png", {
        type: blob.type,
        lastModified: new Date().getTime(),
      }),
    ];
    shareDataBlob = {
      files: filesArray,
    };

    //navigator.share(shareDataBlob);

    $("#ar_mode_takePhoto_button").removeClass("animated pulse faster");
    $("#polaroidImage").removeClass("noselect");
  });


  // filter-dance



});

function intro_age_verification() {
  $("#intro_background").css("display", "flex");
  $("#top_bar").css("display", "flex");
  $("#intro_age_verification").css("display", "flex");
}

function intro() {
  $("#intro_background").css("display", "flex");
  $("#top_bar").css("display", "flex");
  $("#intro_age_verification").css("display", "none");
  //$("#top_bar").css("display", "flex");
  //$("#intro_background").css("display", "flex");
  //$("#btn_restart").css("display", "none");
  $("#intro_1_text").css("display", "flex");
  $("#bottom_bar").css("display", "flex");
  $("#logo_white").css("display", "flex");
  $("#lets_go").css("display", "flex");

}
function user_is_underage() {
  $("#intro_age_verification").css("display", "none");
  $("#user_is_underage").css("display", "flex");
}


export function allHotSpotsClicked() {
  allHotSpotClicked = true
  console.log("allHotSpotClicked" + allHotSpotClicked)
}

export function finalFrame() {
  sfx_background.stop();


  $("#speech_text").css("display", "none");
  $("#ar_mode_takePhoto_button").css("display", "none");
  $("#polaroidShare").css("display", "none");
  $("#btn_recenter").css("display", "none");
  $("#info").css("display", "none");
  $("#bottom_bar").css("display", "none");
  $("#filter-dance").css("display", "none");
  $("#ar_text").css("display", "none");
  $("#bottom_bar").css("display", "none");
  $("#bottom_bar_outro").css("display", "none");
  $("#find_out_more_bottom").css("display", "none");
  $("#logo_white").css("display", "none");


  $("#outro").css("display", "block");
  clearTimeout(finalTimer); console.log("clearTimeout(finalTimer)");;
}

function startAgain() {

  document.getElementById("initColorButton").click()


  allHotSpotClicked = false
  hotSpot1Clicked = false
  hotSpot2Clicked = false
  hotSpot3Clicked = false
  hotSpot4Clicked = false
  hotSpot5Clicked = false


  document.getElementById("video").pause();
  document.getElementById("video").currentTime = 0;

  horizontalRotation.setAttribute("scale", "0.0001 0.0001 0.0001");

  document.getElementById("beginLight").setAttribute("visible", true);
  document.getElementById("orangeLight").setAttribute("visible", false);
  document.getElementById("blackLight").setAttribute("visible", false);
  document.getElementById("cobaltBlueLight").setAttribute("visible", false);
  document.getElementById("goldWhiteLight").setAttribute("visible", false);
  document.getElementById("blackRedLight").setAttribute("visible", false);
  document.getElementById("khakiGreenLight").setAttribute("visible", false);
  document.getElementById("greenBlueLight").setAttribute("visible", false);

  if (lets_go_clicked) return

  lets_go_clicked = true;

  click_sound()


  $("#outro").css("display", "none");

  lets_go_clicked = false;

  scene.emit("recenter");

  document.getElementById('man').setAttribute("visible", true)

  sceneInitRun()
}

export function sceneInitRun() {
  document.querySelector('[custom_one_finger_rotate]').components.custom_one_finger_rotate.qux(false);
  document.querySelector('[custom_pinch_scale]').components.custom_pinch_scale.qux(false);
  console.log("sceneInitRun")
  document.getElementById("video").play();

  setTimeout(() => {
    $("#speech_text").css("display", "block");
    $("#speech_text").addClass("speech_text_1")

    setTimeout(() => {
      $("#speech_text").removeClass("speech_text_1")
      $("#speech_text").addClass("speech_text_2")

      setTimeout(() => {
        $("#speech_text").removeClass("speech_text_2")
        $("#speech_text").addClass("speech_text_3")
      }, 4000);
    }, 4000);
  }, 2000);


  setTimeout(() => {
    $("#speech_text").css("display", "none");
    //document.querySelector('[custom_one_finger_rotate]').components.custom_one_finger_rotate.qux(true);
    //document.querySelector('[custom_pinch_scale]').components.custom_pinch_scale.qux(true);
    initGlo();
  }, 14000);


  sfx_background.play();

  // Fires when the sound finishes playing.

  ground.setAttribute("visible", false);


  clearTimeout(tapToPlaceTimer);

}

export function allowedToScanGet() {
  return allowedToScan;
}
function hideArIntro() {
  man.setAttribute("visible", false);
  $("#speech_text").css("display", "none");
}

export { hideArIntro };

function getRandomNum() {
  sec = new Date().getSeconds();
  return sec % 3;
}


function runFinalTimer() {
  console.log("runFinalTimer");
  finalTimer = setTimeout(() => {
    finalFrame();
  }, gameTime);
}



export function click_sound() {
  switch (getRandomNum()) {
    case 0:
      sfx_button_1.play();
      break;
    case 1:
      sfx_button_2.play();
      break;
    case 2:
      sfx_button_3.play();
      break;

    default:
      break;
  };


}

export function woosh_sound() {
  sfx_woosh.play();
}
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}





export function vibrate() {
  sfx_vibro.play();
}

function initGlo() {
  console.log("initGlo")
  man.setAttribute("visible", false);
  document.getElementById("video").pause();

  document.getElementById("beginLight").setAttribute("visible", false);
  document.getElementById("blackRedLight").setAttribute("visible", true);
  /*
  document.getElementById("hot_spot1").setAttribute("tap-hotspot", "");
  document.getElementById("hot_spot2").setAttribute("tap-hotspot", "");
  document.getElementById("hot_spot3").setAttribute("tap-hotspot", "");
  document.getElementById("hot_spot4").setAttribute("tap-hotspot", "");
  document.getElementById("hot_spot5").setAttribute("tap-hotspot", "");
  */
  horizontalRotation.setAttribute("scale", "1 1 1");

  glb.setAttribute("animation-mixer", {
    clip: "GHX2_Device_01_ThrowIn",
    loop: "once",
    repetitions: "1",
    crossFadeDuration: 0.4,
    timeScale: 6.0,
    clampWhenFinished: true,
  });


  setTimeout(() => {

    horizontalRotation.setAttribute("scale", "1 1 1");

    document.getElementById("verticalRotation").setAttribute("animation", {
      'property': 'rotation',
      'to': { x: 0, y: 0, z: 0 }, 'dur': 900
    });
    setTimeout(() => {
      document.getElementById("verticalRotation").setAttribute("rotation", { x: 0, y: 0, z: 0 });

      setTimeout(() => {
        document.getElementById("verticalRotation").removeAttribute("animation");

        document.getElementById("hot_spot1").setAttribute("visible", true);
        document.getElementById("hot_spot2").setAttribute("visible", true);
        document.getElementById("hot_spot3").setAttribute("visible", true);
        document.getElementById("hot_spot4").setAttribute("visible", true);
        document.getElementById("hot_spot5").setAttribute("visible", true);

        document.getElementById("glb").addEventListener("animation-finished", foo, true)
        document.getElementById("ar_text").removeClass = "ar_text_1";
        document.getElementById("ar_text").className = "ar_text_2";

        document.getElementById("horizontalRotation").setAttribute("animation", {
          'property': 'rotation',
          'to': { x: 0, y: -150, z: 0 }, 'dur': 1000
        });
        setTimeout(() => {
          document.getElementById("horizontalRotation").setAttribute("rotation", { x: 0, y: -150, z: 0 });
          document.getElementById("horizontalRotation").removeAttribute("animation");

        }, 1000);
/*
        setTimeout(() => {
          document.getElementById("ar_text").style.display = "none";
          runFinalTimer();
        }, 3000);
        */
      }, 1000);

    }, 1000);

  }, 2050);

  document.getElementById("filter-dance").style.display = "flex"
  document.getElementById("find_out_more_bottom").style.display = "flex"

  document.getElementById("ar_text").style.display = "block";

}



function foo(event) {
  console.log("animation-finished")
  $("#info").css("display", "block");
}