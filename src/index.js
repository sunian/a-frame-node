import AFRAME from "aframe";
import Dom from "./Dom";
import "./style.css";
import "aframe-controller-cursor-component";
import "aframe-environment-component";
import "./components/disable-culling";
import "./components/move-arm";
import "./components/controller-binds";

const App = () => (
  <a-scene background="color: black" renderer="antialias: true">
    <a-assets>
      <a-asset-item id="xbot" src="./assets/models/Xbot.glb"></a-asset-item>
    </a-assets>
    <a-entity environment="preset: japan;"></a-entity>

    {/* Primitives. */}
    <a-box position="-1 0.6 3" rotation="0 45 0" color="#4CC3D9"></a-box>
    <a-sphere position="0 1.35 5" radius="1.25" color="#EF2D5E"></a-sphere>
    <a-cylinder
      position="1 0.85 3"
      radius="0.5"
      height="1.5"
      color="#FFC65D"
    ></a-cylinder>
    <a-plane
      position="0 .01 4"
      rotation="-90 0 0"
      width="4"
      height="4"
      color="#7BC8A4"
    ></a-plane>
    <a-entity
      id="lightSphere"
      position="2 5 2"
      geometry="primitive: sphere; radius: .1"
      material="color: #FFF; shader: flat"
      light="type: point"
      animation__position="property: position; dir: alternate; loop: true; to: -3 5 5"
    ></a-entity>

    <a-entity id="human" position="0 0.01 -1">
      <a-gltf-model
        name="xbot"
        src="#xbot"
        disable-culling
        move-arm="arm: Left"
      />
    </a-entity>

    <a-entity id="cameraRig">
      {/* camera */}
      <a-entity
        id="head"
        camera
        wasd-controls
        look-controls
        position="0 1 0"
      ></a-entity>
      {/* hand controls */}
      <a-entity
        id="left-hand"
        hand-controls="hand: left"
        controller-binds
      ></a-entity>
      <a-entity
        id="right-hand"
        hand-controls="hand: right"
        controller-binds
      ></a-entity>
    </a-entity>
  </a-scene>
);

// Mount main app
document.querySelector("#game-container").replaceChildren(App());
