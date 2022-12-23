AFRAME.registerComponent("disable-culling", {
  init: function () {
    this.el.addEventListener("model-loaded", () => {
      const model = this.el.object3D;
      model.traverse((node) => {
        if (node.isMesh) {
          node.frustumCulled = false;
          node.castShadow = true;
        }
      });
    });
  },
});
