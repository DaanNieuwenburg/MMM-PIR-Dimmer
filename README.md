1. First pull the code from the directory.
2. run npm install to install the dependencies

3. Add the following to the magicmirror config.js:
   {
  			module: "MMM-PIR-gpio",
  			config: {
    				gpio: 17,         // GPIO pin your PIR sensor is connected to
				mapping: 'gpio',
    				timeout: 1000,  // Delay (ms) before turning screen off after no motion (default: 4 minutes)
    				invert: false,    // Set true if your PIR sensor outputs inverted signal
    				debug: false      // Set true for console debug messages
  				}
		},


4. Add a custom.css to the magicmirror/css with the following code

body::after {
 content: "";
 position: fixed;
 inset: 0;
 background: rgba(0,0,0,0);
 transition: background 1s ease, opacity 1s ease;
 opacity: 0;
 z-index: 9999;
 }

 body.dimmed::after {
  background: rgba(0,0,0,0.6);
  opacity: 1;
  }

Enjoy
