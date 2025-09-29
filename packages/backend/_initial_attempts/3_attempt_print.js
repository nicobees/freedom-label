// Import the 'exec' function from the built-in 'child_process' module.
// 'exec' is used to run shell commands from within a Node.js script.
const { exec } = require("child_process");

// --- Configuration ---
// This section defines the components of the print command.

/**
 * The base command for printing. 'lpr' is a common command on Unix-like systems (macOS, Linux).
 * @type {string}
 */
const command = "lpr";

/**
 * The name of the target printer. This must match a printer name recognized by the system.
 * Use `lpstat -p -d` in your terminal to see a list of available printers.
 * @type {string}
 */
const printerName = "-P SN_420B";

/**
 * Printing options related to the page layout.
 * - PageSize: Specifies a custom paper size of 50x30mm.
 * - orientation-requested: Sets the page orientation. '3' typically corresponds to portrait.
 * @type {string}
 */
const layoutOptions = "-o PageSize=Custom.50x30mm -o orientation-requested=3";

/**
 * The path to the PDF file that needs to be printed.
 * @type {string}
 */
const fileName = "output_pdf/2_14.pdf";

// --- Command Execution ---
// This section constructs and runs the final print command.

// Construct the full command by joining the configured parts with spaces.
// This is similar to the f-string formatting used in the original Python script.
const commandToRun = `${command} ${printerName} ${layoutOptions} ${fileName}`;

// Log the command to the console. This is useful for debugging to see exactly what is being executed.
console.log(`Executing command: ${commandToRun}`);

// Execute the command using 'exec'.
// The callback function handles the results of the execution.
exec(commandToRun, (error, stdout, stderr) => {
  // If an error occurs during execution, log it to the console.
  if (error) {
    console.error(`Execution error: ${error.message}`);
    return;
  }

  // If there is any standard error output (warnings, etc.), log it.
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }

  // If the command executes successfully, print the standard output.
  // For 'lpr', stdout is often empty on success.
  console.log(`Stdout: ${stdout}`);
  console.log("Print command sent to the printer successfully.");
});
