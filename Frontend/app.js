import { app, BrowserWindow, Tray, Menu, ipcMain, session } from 'electron';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let mainWindow;
let tray = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 800,
        minWidth: 700,
        minHeight: 600,
        frame: false,
        icon: path.join(__dirname, "dist", 'icon.ico'),
        // transparent: true,
        // vibrancy: 'fullscreen-ui',    // on MacOS
        // backgroundMaterial: 'acrylic', // on Windows 11
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: true,
            webSecurity: true,
            // nodeIntegration: false,
            // enableBlinkFeatures: 'Autofill',
            // partition: 'persist:my-app-session'
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

// Обработка событий от preload.js
ipcMain.on('minimize-window', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
        window.minimize();
    }
});

ipcMain.on('maximize-window', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
        if (window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    }
});

ipcMain.on('close-window', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
        window.hide();
    }
});

app.whenReady().then(() => {
    createWindow();

    // Проверка куки после загрузки окна
    const ses = session.fromPartition('persist:my-app-session');
    ses.cookies.get({ url: 'http://localhost:3000' })
        .then(cookies => console.log(cookies))
        .catch(err => console.error(err));

    // Создаём иконку в трее
    tray = new Tray(path.join(__dirname, 'dist', 'icon.png'));  // Укажи путь к иконке

    // Создаём контекстное меню для трея
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Показать приложение', click: () => {
            mainWindow.show();
        } },
        { label: 'Выйти', click: () => {
            mainWindow.removeAllListeners('close');
            app.quit();
        }}
    ]);

    // Устанавливаем меню и текст для иконки
    tray.setToolTip('Vice');  // Название приложения
    tray.setContextMenu(contextMenu);

    // Скрываем окно при закрытии, но оставляем приложение в трее
    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });

    tray.on('double-click', () => {
        mainWindow.show();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
