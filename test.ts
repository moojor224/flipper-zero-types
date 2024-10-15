// use this file for verifying type definitions

let serial = require("serial");
serial.setup("lpuart", 115200);

let badusb = require("badusb");
badusb.setup({
    vid: 0xAAAA,
    pid: 0xBBBB
});

