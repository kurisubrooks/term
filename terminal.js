const { remote } = require("electron");
const spawn = require("child_process").spawn;
const Terminal = require("xterm");
const $ = require("jquery");

const term = new Terminal();
const shell = spawn(process.env.SHELL, ["--login"], {
    cwd: process.cwd(),
    env: process.env,
    shell: true
});

// term.fit();
term.open(document.getElementById("display"));

const PS1 = "\033[38;5;11m~\033[38;5;15m \033[38;5;10m$\033[38;5;15m";

term.prompt = () => {
    term.write(`${PS1} `);
};

term.prompt();

term.on("key", (key, event) => {
    var printable = !event.altKey && !event.altGraphKey && !event.ctrlKey && !event.metaKey;

    if (event.keyCode === 13) {
        term.prompt();
    }

    if (event.keyCode === 8) {
     // Do not delete the prompt
        if (term.x > 2) {
            term.write("\b \b");
        }
    }

    if (printable) {
        term.write(key);
    }
});

term.on("data", data => shell.stdin.write(data));
term.on("paste", data => term.write(data));

shell.stdout.on("data", data => {
    console.log(Buffer.from(data).toString());
    term.write(data);
});

shell.stderr.on("data", data => {
    console.log(Buffer.from(data).toString());
    term.write(data);
});

// Window Controls
$("#window_close").on("click", () => remote.getCurrentWindow().close());
$("#window_minimize").on("click", () => remote.getCurrentWindow().minimize());
$("#window_maximize").on("click", () => {
    const window = remote.getCurrentWindow();

    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
});
