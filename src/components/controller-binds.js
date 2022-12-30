AFRAME.registerComponent("controller-binds", {
  schema: {},

  init: function () {
    const scene = document.querySelector("a-scene");

    this.el.addEventListener("bbuttonup", () => scene.exitVR());
    this.el.addEventListener("ybuttonup", () => scene.exitVR());
  },
});
