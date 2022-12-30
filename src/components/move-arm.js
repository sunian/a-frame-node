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
    this.leftController = document.querySelector("#left-hand").object3D;

    this.target = new THREE.Object3D();
    this.leftController.position.z = -0.5;
    scene.add(this.target);
    this.iks = [];

    this.el.addEventListener("model-loaded", () => {
      const mesh = this.el.getObject3D("mesh");
      const skeleton = mesh.getObjectByName("Beta_Surface").skeleton;
      const bones = skeleton.bones;
      const findBone = function (name) {
        return bones.find((b) => b.name.includes(name));
      };
      this.armBone = findBone(this.data.arm + "ForeArm");
      this.ikBones = [];
      const ik = new THREE.IK();
      const chain = new THREE.IKChain();
      const constraints = [new THREE.IKBallConstraint()];

      // first
      chain.add(
        new THREE.IKJoint(findBone(this.data.arm + "Shoulder"), { constraints })
      );
      chain.add(
        new THREE.IKJoint(findBone(this.data.arm + "Arm"), { constraints })
      );
      chain.add(
        new THREE.IKJoint(findBone(this.data.arm + "ForeArm"), { constraints })
      );

      // last
      chain.add(
        new THREE.IKJoint(findBone(this.data.arm + "Hand"), { constraints }),
        { target: this.target }
      );
      ik.add(chain);
      // scene.add(ik.getRootBone());
      this.iks.push(ik);
    });
  },

  tick: function (time, timeDelta) {
    this.target.position.copy(this.leftController.position);
    for (let ik of this.iks) {
      ik.solve();
    }
  },
});
