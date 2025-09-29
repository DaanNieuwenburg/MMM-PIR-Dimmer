const NodeHelper = require("node_helper");
const rpio = require("rpio");

// Use BCM GPIO numbering instead of physical pin numbers
rpio.init({mapping: 'gpio'});


module.exports = NodeHelper.create({
  start: function() {
    this.config = null;
    this.pin = null;
    this.timeout = null;
    this.timer = null;
    this.currentState = null;
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "PIR_CONFIG") {
      this.config = payload;
      this._initGPIO();
    }
  },

  _initGPIO: function() {
    if (!this.config) return;
    const pin = this.config.gpio;
    const invert = !!this.config.invert;
    const timeout = parseInt(this.config.timeout) || 240000;

    rpio.open(pin, rpio.INPUT, rpio.PULL_DOWN);

    this.timeout = timeout;
    this.currentState = null;

    const pollHandler = (pin) => {
      const value = rpio.read(pin);
      const motion = invert ? (value === 0) : (value === 1);
      this._handleMotion(motion);
    };

    rpio.poll(pin, pollHandler, rpio.POLL_BOTH);

    // read initial state
    const level = rpio.read(pin);
    const initMotion = invert ? (level === 0) : (level === 1);
    this._handleMotion(initMotion, true);
  },

  _handleMotion: function(motion, initial=false) {
    if (motion) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.currentState !== true || initial) {
        this.currentState = true;
        this.sendSocketNotification("PIR_MOTION", true);
      }
      return;
    }

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.currentState = false;
      this.sendSocketNotification("PIR_MOTION", false);
      this.timer = null;
    }, this.timeout);
  },

  stop: function() {
    if (this.config?.gpio !== undefined) {
      rpio.close(this.config.gpio, rpio.PIN_RESET);
    }
  }
});
