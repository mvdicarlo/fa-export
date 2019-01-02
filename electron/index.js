const fs = require('fs');
const path = require('path');
const {
    app,
    BrowserWindow,
} = require('electron');
const windowStateKeeper = require('electron-window-state');

let win;

const hasLock = app.requestSingleInstanceLock();
if (!hasLock) {
    app.quit();
    return;
}
app.on('second-instance', () => {
    win = profileWindows[PRIMARY_WINDOW_NAME];
    if (win) {
        if (win.isMinimized()) {
            win.restore();
        }

        win.focus();
    } else if (tray) {
        win.show();
    }
});

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('auto-detect', 'false');
app.commandLine.appendSwitch('no-proxy-server');

app.on('ready', () => {
    const mainWindowState = windowStateKeeper({
        defaultWidth: 992,
        defaultHeight: 800,
    });

    win = new BrowserWindow({
        show: true,
        width: mainWindowState.width,
        minWidth: 500,
        height: mainWindowState.height,
        minHeight: 500,
        autoHideMenuBar: true,
        title: 'Fur Affinity Export',
        webPreferences: {
            devTools: true,
            allowRunningInsecureContent: false,
            nodeIntegration: false,
            webviewTag: true,
            partition: 'persist:9387f550-0e8c-11e9-ab14-d663bd873d93'
        },
    });

    win.loadURL(`file://${__dirname}/dist/index.html`);

    win.on('page-title-updated', (e) => {
        e.preventDefault();
    });

    win.webContents.on('did-fail-load', () => {
        win.loadURL(`file://${__dirname}/dist/index.html`);
    });

    win.webContents.once('did-frame-finish-load', () => {
        this.clearCacheInterval = setInterval(() => {
            win.webContents.session.getCacheSize((size) => {
                if (size > 0) {
                    win.webContents.session.clearCache(() => {});
                }
            });
        }, 10000);
    });
});

app.on('uncaughtException', (err) => {
    console.log(err);
});

process.on('uncaughtException', (err) => {
  console.log(err);
});

app.on('window-all-closed', () => {
    app.quit();
});
