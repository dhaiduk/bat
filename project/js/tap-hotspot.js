import {
  vibrate,
  click_sound,
  woosh_sound,
  allHotSpotsClicked,
  finalTimer,
  hotSpot1ClickedFunc,
  hotSpot2ClickedFunc,
  hotSpot3ClickedFunc,
  hotSpot4ClickedFunc,
  hotSpot5ClickedFunc
  //switchPre360Screen,
  //SwitchVRScreen,
  //hideArIntro,
  //staredStatus,
  //switch360SubScreen,
} from "./app.js";
/*
var hotSpot1Clicked = false
var hotSpot2Clicked = false
var hotSpot3Clicked = false
var hotSpot4Clicked = false
var hotSpot5Clicked = false
*/
const tapHotspotComponent = {
  init() {

    const animationList = [
      "GHX2_Device_01_ThrowIn",
      "GHX2_Device_02_ButtonRingLight",
      "GHX2_Device_03_ShutterLightRays",
      "GHX2_Device_04_USB",
    ];

    var lastAnimation;
    let idx = 0
    let ledTapped = false;
    let irisShutterTapped = false


    document.getElementById("glb").addEventListener("animation-loop", (e) => {
      console.log(e.detail.action._clip.name);
      lastAnimation = e.detail.action._clip.name
    });

    const hideHotSpots = (e) => {
      document.getElementById("hot_spot1").setAttribute("visible", false);
      document.getElementById("hot_spot2").setAttribute("visible", false);
      document.getElementById("hot_spot3").setAttribute("visible", false);
      document.getElementById("hot_spot4").setAttribute("visible", false);
      document.getElementById("hot_spot5").setAttribute("visible", false);
      //document.getElementById("boost").setAttribute("visible", false);
    }

    const showHotSpots = (e) => {
      document.getElementById("hot_spot1").setAttribute("visible", true);
      document.getElementById("hot_spot2").setAttribute("visible", true);
      document.getElementById("hot_spot3").setAttribute("visible", true);
      document.getElementById("hot_spot4").setAttribute("visible", true);
      document.getElementById("hot_spot5").setAttribute("visible", true);
    }


    const showInfo = (e) => {
      console.log((document.getElementById("glb").object3D.rotation.y) * (180 / Math.PI) + " " +
        (document.getElementById("verticalRotation").object3D.rotation.x) * (180 / Math.PI))

      console.log("show_" + e)
      for (let index = 0; index < 5; index++) {
        $("#info").removeClass("info_" + index);

      }
      document.getElementById("videoInfo5").style.display = "none"
      //$("#info").css("display", "block");
      if (e < 5)
        $("#info").addClass("info_" + e); else {
          document.getElementById("videoInfo5").style.display = "block";
          /*
          setTimeout(() => {
            document.getElementById("videoInfo5").style.display = "none"
            $("#info").addClass("info_" + e)
          }, 11000);
          */
        }
    }

    const nextAnimation = (e) => {
      e.preventDefault();
      document.getElementById("ar_text").style.display = "none"
      
      document.getElementById("glb").setAttribute("scale", {
        x: document.getElementById("glb").getAttribute("scale").x + 0.001,
        y: document.getElementById("glb").getAttribute("scale").y + 0.001,
        z: document.getElementById("glb").getAttribute("scale").z + 0.001
      })
      console.log(document.getElementById("glb").getAttribute("scale"));
      console.log(e)
      //document.querySelector('[custom_one_finger_rotate]').components.custom_one_finger_rotate.qux(false);
      //document.querySelector('[custom_pinch_scale]').components.custom_pinch_scale.qux(false);
      //document.getElementById("glb").removeAttribute("custom_one_finger_rotate")

      console.log("click nextAnimation")
      clearTimeout(finalTimer); console.log("clearTimeout(finalTimer)");
      var currentTarget = e.target.id;
      click_sound();
      switch (currentTarget) {

        case "hot_spot1":
          hotSpot1ClickedFunc()
          setTimeout(() => {
            showInfo(1)
            document.getElementById("info").style.display = "block"
            hideHotSpots();
          }, 30);    
          vibrate()
          break;
        case "hot_spot2":
          hotSpot2ClickedFunc()
          vibrate()
          document.getElementById("boost").setAttribute("visible", true)
          document.getElementById("videoBoost").play()
          hideHotSpots();
          setTimeout(() => {
            showInfo(2)
            document.getElementById("info").style.display = "block"
            
          }, 3000);
          //woosh_sound();
          break;

        case "hot_spot3":
          hotSpot3ClickedFunc()
          setTimeout(() => {
            showInfo(3)
          }, 190);
          hideHotSpots();
          document.getElementById("glb").removeAttribute('animation-mixer')
          document.getElementById("glb").setAttribute('animation-mixer', {
            clip: animationList[1],
            loop: "once",
            repetitions: "1",
            timeScale: 1.0,
            clampWhenFinished: true,
          });

          var rotationHotSpot3 = -350
          var timerHotSpot3 = 5000
          document.getElementById("glb").setAttribute("animation", {
            'property': 'rotation',
            'to': { x: 0, y: rotationHotSpot3, z: 0 }, 'dur': timerHotSpot3
          });
          setTimeout(() => {
            document.getElementById("glb").setAttribute("rotation", { x: 0, y: rotationHotSpot3, z: 0 });
            document.getElementById("glb").removeAttribute("animation");

          }, timerHotSpot3 + 50);

          var verticalRotation3 = 50

          document.getElementById("verticalRotation").setAttribute("animation", {
            'property': 'rotation',
            'to': { x: verticalRotation3, y: 0, z: 0 }, 'dur': timerHotSpot3
          });
          setTimeout(() => {
            document.getElementById("verticalRotation").setAttribute("rotation", { x: verticalRotation3, y: 0, z: 0 });

            document.getElementById("verticalRotation").removeAttribute("animation");

            console.log((document.getElementById("glb").object3D.rotation.y) * (180 / Math.PI) + " " +
              (document.getElementById("verticalRotation").object3D.rotation.x) * (180 / Math.PI))
          }, timerHotSpot3 + 50);
          woosh_sound();
          break;
        case "hot_spot4":
          hotSpot4ClickedFunc()
          hideHotSpots();

          setTimeout(() => {
            showInfo(4)
          }, 300);

          setTimeout(() => {
            document.getElementById("info").style.display = "block"
          }, 7000);

          document.getElementById("glb").removeAttribute('animation-mixer')
          document.getElementById("glb").setAttribute('animation-mixer', {
            clip: animationList[2],
            loop: "once",
            repetitions: "1",
            timeScale: 1.0,
            clampWhenFinished: true,
          });


          var rotationHotSpot4 = -45
          var timerHotSpot4 = 5000
          document.getElementById("glb").setAttribute("animation", {
            'property': 'rotation',
            'to': { x: 0, y: rotationHotSpot4, z: 0 }, 'dur': timerHotSpot4
          });
          setTimeout(() => {
            document.getElementById("glb").setAttribute("rotation", { x: 0, y: rotationHotSpot4, z: 0 });
            document.getElementById("glb").removeAttribute("animation");
          }, timerHotSpot4 + 50);

          var verticalRotation4 = 40

          document.getElementById("verticalRotation").setAttribute("animation", {
            'property': 'rotation',
            'to': { x: verticalRotation4, y: 0, z: 0 }, 'dur': timerHotSpot4
          });
          setTimeout(() => {
            document.getElementById("verticalRotation").setAttribute("rotation", verticalRotation4 + " 0 0");
            document.getElementById("verticalRotation").removeAttribute("animation");
          }, timerHotSpot4 + 50);
          woosh_sound();
          break;

        case "hot_spot5":
          hotSpot5ClickedFunc()
          hideHotSpots();
          setTimeout(() => {
            showInfo(5)
          }, 150);
          document.getElementById("glb").setAttribute('animation-mixer', {
            clip: animationList[3],
            loop: "once",
            repetitions: "1",
            timeScale: 1.0,
            clampWhenFinished: true,
          });
          var rotationHotSpot5 = -25
          var timerHotSpot5 = 5000
          document.getElementById("glb").setAttribute("animation", {
            'property': 'rotation',
            'to': { x: 0, y: rotationHotSpot5, z: 0 }, 'dur': timerHotSpot5
          });
          setTimeout(() => {
            document.getElementById("glb").setAttribute("rotation", { x: 0, y: rotationHotSpot5, z: 0 });
            document.getElementById("glb").removeAttribute("animation");
          }, timerHotSpot5 + 50);

          var verticalRotation5 = 40

          document.getElementById("verticalRotation").setAttribute("animation", {
            'property': 'rotation',
            'to': { x: verticalRotation5, y: 0, z: 0 }, 'dur': timerHotSpot5
          });
          setTimeout(() => {
            document.getElementById("verticalRotation").setAttribute("rotation", verticalRotation5 + " 0 0");
            document.getElementById("verticalRotation").removeAttribute("animation");
          }, timerHotSpot5 + 50);
          woosh_sound();
          break;
        default:
          break;

      }

      console.log(e.target.id)

      //document.getElementById("glb").setAttribute("custom_one_finger_rotate","")
      //document.querySelector('[custom_one_finger_rotate]').components.custom_one_finger_rotate.qux(true);
      //document.querySelector('[custom_pinch_scale]').components.custom_pinch_scale.qux(true);

    }
    this.el.addEventListener("click", nextAnimation, true);
  },
};
export { tapHotspotComponent};
