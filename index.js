const { app, BrowserWindow, ipcMain } = require("electron");
const spawn = require("child_process").spawn;
let window = null;

const start = () => {
    const shell = spawn("bash", ["--login"]);

    const options = {
        minWidth: 700,
        minHeight: 460,
        width: 900,
        height: 550,
        frame: false,
        show: false
    };

    window = new BrowserWindow(options);
    window.loadURL(`file://${__dirname}/index.html`);
    window.once("ready-to-show", () => window.show());
    window.on("closed", () => {
        window = null;
    });

    ipcMain.on("shell_stdin", (evt, data) => {
        shell.stdin.write(`${data}\n`);
    });

    shell.stdout.on("data", data => {
        window.webContents.send("shell_stdout", Buffer.from(data).toString());
    });

    shell.stderr.on("data", data => {
        window.webContents.send("shell_stderr", Buffer.from(data).toString());
    });
};

app.once("ready", start);
