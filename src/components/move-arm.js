import AFRAME from "aframe";
import "three-ik";
import IKHelper from "./IKHelper";

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
      this.armBone = findBone(this.data.arm + "Shoulder");
      console.log(this.armBone);
      const ik = new THREE.IK();

      const chain = new THREE.IKChain();
      const flexConstraint = [new THREE.IKBallConstraint(120)];
      const fixedConstraint = [new THREE.IKBallConstraint(0)];
      this.tempBones = [];

      // Create a target that the IK's effector will reach
      // for.
      const movingTarget = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      this.target.add(movingTarget);

      // Create a chain of THREE.Bone's, each wrapped as an IKJoint
      // and added to the IKChain
      for (let i = 0; i <= 3; i++) {
        const bone = new THREE.Bone();
        if (i === 0) {
          // bone.position.copy(this.armBone.position);
          bone.position.y = 0;
        } else {
          bone.position.y = 0.5;
        }

        if (this.tempBones[i - 1]) {
          this.tempBones[i - 1].add(bone);
        }
        this.tempBones.push(bone);

        // The last IKJoint must be added with a `target` as an end effector.
        const target = i === 3 ? movingTarget : null;
        const constraints = i === 0 ? fixedConstraint : flexConstraint;
        chain.add(new THREE.IKJoint(bone, { constraints }), { target });
      }

      // Add the chain to the IK system
      ik.add(chain);

      // Ensure the root bone is added somewhere in the scene
      scene.add(ik.getRootBone());

      // Create a helper and add to the scene so we can visualize
      // the bones
      const helper = new IKHelper(ik);
      scene.add(helper);
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
