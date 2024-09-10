declare module "badusb" {
    type USBConfiguration = {
        /** Vendor ID (mandatory) */
        vid: number,
        /** Product ID (mandatory) */
        pid: number,
        /** Manufacturer name (32 ASCII characters max), optional */
        mfr_name?: string,
        /** Product name (32 ASCII characters max), optional */
        prod_name?: string
    }

    /**
     * Start USB HID with optional parameters. Should be called before all other methods
     * @param config Configuration object (optional)
     * @example
     * // Start USB HID with default parameters
     * badusb.setup();
     * // Start USB HID with custom vid:pid = AAAA:BBBB, manufacturer and product strings not defined
     * badusb.setup({ vid: 0xAAAA, pid: 0xBBBB }); 
     * // Start USB HID with custom vid:pid = AAAA:BBBB, manufacturer string = "Flipper Devices", product string = "Flipper Zero"
     * badusb.setup({ vid: 0xAAAA, pid: 0xBBBB, mfr_name: "Flipper Devices", prod_name: "Flipper Zero" });
     */
    function setup(config?: USBConfiguration): void;
    /**
     * Returns USB connection state.
     * @returns true if connected, false otherwise
     * @example
     * if (badusb.isConnected()) {
     *    // Do something
     * } else {
     *    // Show an error
     * }
     */
    function isConnected(): boolean;

    /**
     * Press and release a key.
     * @param keys Key or modifier name, key code.
     * @example
     * badusb.press("a"); // Press "a" key
     * badusb.press("A"); // SHIFT + "a"
     * badusb.press("CTRL", "a"); // CTRL + "a"
     * badusb.press("CTRL", "SHIFT", "ESC"); // CTRL + SHIFT + ESC combo
     * badusb.press(98); // Press key with HID code (dec) 98 (Numpad 0 / Insert)
     * badusb.press(0x47); // Press key with HID code (hex) 0x47 (Scroll lock)
     */
    function press(...keys: (string | number)[]): void;

    /**
     * Hold a key. Up to 5 keys (excluding modifiers) can be held simultaneously.
     * @param keys Key or modifier name, key code.
     * @example
     * badusb.hold("a"); // Press and hold "a" key
     * badusb.hold("CTRL", "v"); // Press and hold CTRL + "v" combo
     */
    function hold(...keys: (string | number)[]): void;

    /**
     * Release a previously held key.
     * @param keys Key or modifier name, key code. (optional)
     * Release all keys if called without parameters.
     * @example
     * badusb.release(); // Release all keys
     * badusb.release("a"); // Release "a" key
     */
    function release(...keys: (string | number)[]): void;

    /**
     * Print a string.
     * @param message A string to print
     * @param delay Delay between key presses (optional)
     * @example
     * badusb.print("Hello, world!"); // print "Hello, world!"
     * badusb.print("Hello, world!", 100); // Add 100ms delay between key presses
     */
    function print(message: string, delay?: number): void;

    /**
     * Print a string and press "ENTER".
     * @param message A string to print
     * @param delay Delay between key presses (optional)
     * @example
     * badusb.println("Hello, world!"); // print "Hello, world!" and press "ENTER"
     */
    function println(message: string, delay?: number): void;
}

declare module "dialog" {
    /**
     * Show a simple message dialog with header, text and "OK" button.
     * @param header Dialog header text
     * @param text Dialog text
     * @returns true if central button was pressed, false if the dialog was closed by back key press
     * @example
     * dialog.message("Dialog demo", "Press OK to start");
     */
    function message(header: string, text: string): boolean;
    type DialogConfig = {
        /** Dialog header text */
        header: string,
        /** Dialog text */
        text: string,
        /** left button name (optional) */
        button_left?: string,
        /** right button name (optional) */
        button_right?: string,
        /** central button name (optional) */
        button_center?: string
    }

    /**
     * More complex dialog with configurable buttons
     * @param config Dialog configuration object
     * @returns Name of pressed button or empty string if the dialog was closed by back key press
     * @example
     * let dialog_params = ({
     *     header: "Dialog header",
     *     text: "Dialog text",
     *     button_left: "Left",
     *     button_right: "Right",
     *     button_center: "OK"
     * });
     * 
     * dialog.custom(dialog_params);
     */
    function custom(config: DialogConfig): string;
}

declare module "math" {
    const PI: 3.14159265358979323846264338327950288;
    const E: 2.71828182845904523536028747135266250;
    const EPSILON: 2.2204460492503131e-16;
    /**
     * Return the absolute value of a number
     * @param x A number
     * @returns The absolute value of x. If x is negative (including -0), returns -x. Otherwise, returns x. The result is therefore always a positive number or 0
     * @example
     * math.abs(-5); // 5
     */
    function abs(x: number): number;

    function acos(x: number): number;
    function acosh(x: number): number;
    function asin(x: number): number;
    function asinh(x: number): number;
    function atan(x: number): number;
    function atan2(y: number, x: number): number;
    function atanh(x: number): number;
    function cbrt(x: number): number;
    function ceil(x: number): number;
    function clz32(x: number): number;
    function cos(x: number): number;
    function exp(x: number): number;
    function floor(x: number): number;
    function is_equal(a: number, b: number, e: number): boolean;
    function max(a: number, b: number): number;
    function min(a: number, b: number): number;
    function pow(base: number, exponent: number): number;
    function random(): number;
    function sign(x: number): number;
    function sin(x: number): number;
    function sqrt(x: number): number;
    function trunc(x: number): number;

}

declare module "serial" {
    /**
     * Configure serial port. Should be called before all other methods.
     * @param port Serial port name (usart, lpuart)
     * @param baudrate Data transmission rate
     * @example
     * serial.setup("lpuart", 115200);
     */
    function setup(port: "lpuart" | "usart", baudrate: 4800 | 9600 | 19200 | 38400 | 57600 | 115200 | number): void;

    /**
     * Write data to serial port
     * @param data Data to be sent. Can be a string, number, number array, ArrayBuffer or DataView
     */
    function write(...data: (string | number | number[] | ArrayBuffer | DataView)[]): void;

    /**
     * Read a fixed number of characters from serial port
     * @param bytes Number of bytes to read
     * @param timeout Timeout value in ms (optional)
     * @returns A string of received characters or undefined if nothing was received before timeout.
     * @example
     * serial.read(1); // Read a single byte, without timeout
     * serial.read(10, 5000); // Read 10 bytes, with 5s timeout
     */
    function read(bytes: number, timeout?: number): string | undefined;

    /**
     * Read from serial port until line break character
     * @param timeout Timeout value in ms (optional)
     * @returns A string of received characters or undefined if nothing was received before timeout.
     * @example
     * serial.readln(); // Read without timeout
     * serial.readln(5000); // Read with 5s timeout
     */
    function readln(timeout?: number): string | undefined;

    /**
     * Read a fixed number of bytes from serial port
     * @param bytes Number of bytes to read
     * @param timeout Timeout value in ms (optional)
     * @example
     * serial.readBytes(4); // Read 4 bytes, without timeout
     * 
     * // Read one byte from receive buffer with zero timeout, returns UNDEFINED if Rx buffer is empty
     * serial.readBytes(1, 0);
     */
    function readBytes(bytes: number, timeout?: number): ArrayBuffer | undefined;

    /**
     * Search for a string pattern in received data stream
     * @param pattern the pattern to search for eother in string or byte array format
     * @param timeout Timeout value in ms (optional)
     * @example
     * // Wait for root shell prompt with 1s timeout, returns 0 if it was received before timeout, undefined if not
    * serial.expect("# ", 1000); 
    * 
    * // Infinitely wait for one of two strings, should return 0 if the first string got matched, 1 if the second one
    * serial.expect([": not found", "Usage: "]);
     */
    function expect(pattern: string | string[] | number[], timeout?: number): number | undefined;
}

declare module "notification" {
    /** "Success" flipper notification message */
    function success(): void;

    /** "Error" flipper notification message */
    function error(): void;

    /**
     * Blink notification LED
     * @param color Blink color
     * @param type Blink type
     */
    function blink(color: "blue" | "red" | "green" | "yellow" | "cyan" | "magenta", type: "short" | "long"): void;
}

declare module "submenu" {
    /**
     * Set the submenu header text
     * @param header The submenu header text
     */
    function setHeader(header: string): void;

    /**
     * Add a new submenu item
     * @param label The submenu item label text
     * @param id The submenu item ID, must be a Uint32 number
     */
    function addItem(label: string, id: number): void;

    /**
     * Show a submenu that was previously configured using the {@link setHeader()|`setHeader()`} and {@link addItem()|`addItem()`} methods
     * @returns The ID of the submenu item that was selected, or undefined if the BACK button was pressed
     */
    function show(): number | undefined;
}

declare module "textbox" {
    /**
     * Set focus and font for the textbox
     * @param focus "start" to focus on the beginning of the text, or "end" to focus on the end of the text
     * @param font "text" to use the default proportional font, or "hex" to use a monospaced font, which is convenient for aligned array output in HEX
     * @example
     * textbox.setConfig("start", "text");
     * textbox.addText("Hello world");
     * textbox.show();
     */
    function setConfig(focus: "start" | "end", font: "text" | "hex"): void;
    function addText(text: string): void;
    function clearText(): void;
    function isOpen(): boolean;
    function show(): void;
    function close(): void;
}

interface modules {
    "badusb": typeof import("badusb");
    "dialog": typeof import("dialog");
    "math": typeof import("math");
    "serial": typeof import("serial");
    "notification": typeof import("notification");
    "submenu": typeof import("submenu");
    "textbox": typeof import("textbox");
}

declare function require<M extends keyof modules>(module: M): modules[M];

/**
 * Delay for a number of milliseconds
 * @param ms Delay value in ms
 */
declare function delay(ms: number): void;

/**
 * Print a message on a screen console
 * @param args the values to be printed
 */
declare function print(...args: (string | number | boolean | undefined)[]): void;

/**
 * converts a number to a string
 * @param num the number to convert
 */
declare function to_string(num: number): string;

/**
 * converts a number to a hex string
 * @param num the number to convert
 */
declare function to_hex_string(num: number): string;