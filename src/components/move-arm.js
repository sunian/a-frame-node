import AFRAME from "aframe";
import "three-ik";
import IKHelper from "./IKHelper";

const THREE = AFRAME.THREE;

AFRAME.registerComponent("move-arm", {
  schema: {
    arm: { type: "string", default: "Left" },
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
      const findBone = function (name) {
        return skeleton.bones.find((b) => b.name.includes(name));
      };
      console.log(skeleton.bones.map((b) => b.name));
      const lastMobileBone = findBone(this.data.arm + "HandMiddle1");
      const firstMobileBone = findBone(this.data.arm + "Shoulder");
      var currentBone = firstMobileBone;
      const rootBone = new THREE.Bone();
      rootBone.name = currentBone.name;
      rootBone.position.copy(currentBone.position);
      while (currentBone instanceof THREE.Bone) {
        rootBone.position.multiply(currentBone.scale);
        currentBone = currentBone.parent;
        rootBone.position.add(currentBone.position);
        rootBone.scale.multiply(currentBone.scale);
      }
      currentBone = lastMobileBone;
      const modelBones = [currentBone];
      while (currentBone !== firstMobileBone) {
        currentBone = currentBone.parent;
        modelBones.push(currentBone);
      }
      modelBones.reverse();

      console.log("*****");
      for (let bone of modelBones) {
        console.log(bone.name, bone.position);
      }
      console.log("*****");

      const ik = new THREE.IK();

      const chain = new THREE.IKChain();
      const flexConstraint = [new THREE.IKBallConstraint(120)];
      const fixedConstraint = [new THREE.IKBallConstraint(0)];

      // Create a target that the IK's effector will reach
      // for.
      const movingTarget = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      this.target.add(movingTarget);

      // Create a chain of THREE.Bone's, each wrapped as an IKJoint
      // and added to the IKChain
      var constraints = flexConstraint;
      const ikBones = [];
      var scale = new THREE.Vector3(1, 1, 1);
      for (let i = 0; i < modelBones.length; i++) {
        const bone = new THREE.Bone();
        const modelBone = i === 0 ? rootBone : modelBones[i];
        bone.name = modelBone.name;
        scale.multiply(modelBone.scale);
        bone.position.multiply(scale);
        bone.position.copy(scale.clone().multiply(modelBone.position));
        bone.rotation.copy(modelBone.rotation);
        bone.up.copy(modelBone.up);

        if (ikBones[i - 1]) {
          ikBones[i - 1].add(bone);
        }
        ikBones.push(bone);

        // The last IKJoint must be added with a `target` as an end effector.
        const target = modelBone === lastMobileBone ? movingTarget : null;
        chain.add(new THREE.IKJoint(bone, { constraints }), { target });
      }
      console.log(chain);

      // Add the chain to the IK system
      ik.add(chain);

      // Ensure the root bone is added somewhere in the scene
      scene.add(ik.getRootBone());

      // Create a helper and add to the scene so we can visualize
      // the bones
      const helper = new IKHelper(ik);
      scene.add(helper);
      this.iks.push(ik);
      this.modelBones = modelBones;
      this.ikBones = ikBones;
    });
  },

  tick: function (time, timeDelta) {
    this.target.position.copy(this.leftController.position);
    for (let ik of this.iks) {
      ik.solve();
    }
    for (let i = 0; i < this.modelBones.length; i++) {
      this.modelBones[i].rotation.copy(this.ikBones[i].rotation);
    }
  },
});
