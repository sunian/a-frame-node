import AFRAME from "aframe";
import { IK, IKChain, IKJoint, IKBallConstraint, IKHelper } from "three-ik";

const THREE = AFRAME.THREE;

AFRAME.registerComponent("move-arm", {
  schema: {
    arm: { type: "string", default: "Left" },
    angle: { type: "number", default: NaN },
  },

  init: function () {
    const scene = this.el.sceneEl.object3D;
    this.target = new THREE.Object3D();
    scene.add(this.target);
    this.iks = [];

    this.el.addEventListener("model-loaded", () => {
      const mesh = this.el.getObject3D("mesh");
      const skeleton = mesh.getObjectByName("Beta_Surface").skeleton;
      const bones = skeleton.bones;
      const findBone = function (name) {
        return bones.find((b) => b.name.includes(name));
      };
      this.armBone = findBone(this.data.arm + "Arm");
      console.log(this.armBone);
      // console.log(isNaN(this.data.angle));
    });
  },

  tick: function (time, timeDelta) {
    this.armBone.rotation.y = (Math.random() - 0.5) * Math.PI;
    for (let ik of this.iks) {
      ik.solve();
    }
  },
});
