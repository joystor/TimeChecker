'use strict';

window.DEBUG = false;
window.MAX_ID = 4;
window.MAIL_CONFIG = {
  user: 'MAIL@gmail.com',
  pass: 'PASSWORD'
};
window.USR = {
  ID:'',
  isMaxMinDate: false
};
window.EvtData = {};

function openDebug() {
  if (window.DEBUG) {
    setTimeout(function() {
      window.win.showDevTools();
      window.win.on('devtools-opened', function(url) {
        console.log('Debug: ' + url);
      });
    }, 3000);
  }
}

function loadAPPREQ() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'libs/require.js';
  var dataMain = document.createAttribute('data-main');
  dataMain.value = 'app/main';
  script.setAttributeNode(dataMain);
  document.getElementsByTagName('head')[0].appendChild(script);
  openDebug();
}


function loadNWKapp() {
  window.requireNode = window.require;
  delete window.require;
  window.requireNode.version = process.versions.node;
  delete process.versions.node;
  window.navigator.language = 'es_ES';
  loadAPPREQ();
}

window.toDate = function(dateStr) {
    var parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

window.DB = openDatabase('aReg', '1.0', 'Database TimeChecker', 2 * 1024 * 1024);
window.DB.transaction(function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id integer primary key, nombre text, apellidos text, es_admin boolean, passwd text);');
  tx.executeSql('CREATE TABLE IF NOT EXISTS configuracion (opcion text, valor text);');
  tx.executeSql('CREATE TABLE IF NOT EXISTS control (id integer primary key, id_usuario integer, evento text, registro DATETIME DEFAULT CURRENT_TIMESTAMP);');
});

/*Email*/
//npm install dateformat --prefix=./app/main/
//npm install moment --prefix=./app/main/
//rm -fR app/main/etc
window.nodemailer = require('./node_modules/nodemailer');
window.moment = require('./node_modules/moment');
window.Mail = require('./system/mail');


window.dateFormat = require('./node_modules/dateformat');

window.gui = require('nw.gui');
window.win = window.gui.Window.get();
window.win.setResizable(false);
window.win.isMaximized = false;

window.win.on('maximize', function() {
  window.win.resizeTo(800, 600);
  window.win.setPosition('center');
});

//Cachar errores
window.win.on('error', function(err) {
  console.error('ERROR_BROWSER:');
  console.error(err);
});
process.setMaxListeners(0);
process.on('uncaughtException', function(err) {
  console.log('ERROR_NODE:');
  console.log(err);
});

loadNWKapp();
