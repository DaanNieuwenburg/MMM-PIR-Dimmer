Module.register("MMM-PIR-gpio", {
  defaults: {
    gpio: 17,
    timeout: 240000,
    invert: false,
    debug: false
  },

  start: function() {
    this.presence = true;
    this.sendSocketNotification("PIR_CONFIG", this.config);
    console.log("MMM-PIR-gpio started");
  },

  notificationReceived: function(notification, payload, sender) {
    if (notification === "USER_PRESENCE") {
      this._setDim(!payload);
    }
    if (notification === "SHOW") this._setDim(false);
    if (notification === "HIDE") this._setDim(true);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "PIR_MOTION") {
      this.sendNotification("USER_PRESENCE", payload);
      this._setDim(!payload);
    }
  },

  _setDim: function(doDim) {
    if (doDim) {
      document.body.classList.add("dimmed");
    } else {
      document.body.classList.remove("dimmed");
    }
  }
});
