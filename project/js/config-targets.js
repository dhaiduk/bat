const configTargets = {
    schema: {
      targets: { type: 'array', default: [''] },
    },
    ensureImageTargetsConfigured() {
      if (this.configured || !this.configOk) {
        return
      }
      console.log(`Scanning for targets: ${JSON.stringify(this.data.targets)}`)
      XR8.XrController.configure({ imageTargets: this.data.targets })

      this.configured = true
    },
    init() {
      this.configured = false
      this.configOk = false
      this.el.sceneEl.addEventListener('realityready', () => {
        this.configOk = true
        this.ensureImageTargetsConfigured()
      })
    },
    update() {
      this.configured = false
      this.ensureImageTargetsConfigured()
    },
  }