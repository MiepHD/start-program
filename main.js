const electron = require('electron');
const url = require('url');
const path = require('path');
const { ipcRenderer } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.sqlite3');
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

//Tabelle erstellen
db.run("CREATE TABLE IF NOT EXISTS tabelle (name TEXT NOT NULL, imageurl TEXT NOT NULL, id TEXT NOT NULL, platform TEXT NOT NULL, gameurl TEXT NOT NULL, developer TEXT NOT NULL)");

// Beim Starten ausf�hren
app.on('ready', function(){
	//Hauptfenster erstellen
	console.log("Erstelle Hauptfenster")
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});
	//HTML laden
	console.log("Lade HTML")
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'main.html'),
		protocol: 'file:',
		slashes: true
	}));
	//Schlie�en
	mainWindow.on('closed', function(){
		app.quit();
	});
	//Men�
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

//Men� erstellen
const mainMenuTemplate = [
	{
		label:'Objekte',
		submenu:[
			{
				label: 'Objekt hinzuf�gen',
				accelerator: process.platform == 'darwin' ? 'Command+N' :
				'Ctrl+N',
				click(){
					mainWindow.send('item:add');
					console.log('Objekt hinzufügen');
				}
			},
			{
				label: 'Alle Objekte l�schen',
				click(){
					mainWindow.send('item:clear');
				}
			},
			{
				label: 'Verlassen',
				accelerator: process.platform == 'darwin' ? 'Command+Q' :
				'Ctrl+Q',
				click(){
					app.quit();
					console.log('Anwendung geschlossen')
				}
			}
		]
	},
	{
		label:'Werkzeuge',
		submenu:[
			{
				label: "Entwicklertools",
				accelerator: process.platform == 'darwin' ? 'Command+I' :
				'Ctrl+I',
				click(itme, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				label: "Hauptseite",
				accelerator: process.platform == 'darwin' ? 'Command+H' :
				'Ctrl+H',
				click(){
					mainWindow.send('item:home')
				}
			}
		]
	}
];

//fix f�r Mac
if(process.platform == 'darwin'){
	mainMenuTemplate.unshift({});
};