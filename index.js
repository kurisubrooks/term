const { app, BrowserWindow, webContents, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const child_process = require("child_process");
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800, height: 600,
        title: "Term"
    });

    win.loadURL(`file://${path.join(__dirname, "index.html")}`);
    // win.webContents.openDevTools();

    const shell = child_process.spawn("bash");

    win.webContents.on("did-finish-load", () => {
        ipcMain.on("shStdin", (evt, data) => {
            shell.stdin.write(data + "\n");
        });

        shell.stdout.on("data", data => {
            win.webContents.send("shStdout", Buffer.from(data).toString());
        });
    });

    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (win === null) createWindow();
});
