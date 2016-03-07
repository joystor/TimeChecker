'use strict';

var Mail = {

  send: function(options) {
    window.DB.transaction(function(tx) {  //,'mail_pass'
      tx.executeSql("SELECT * FROM configuracion WHERE opcion in ('mail')", [], function(tx, results) {
        var len = results.rows.length,
          i;
        var auth = {
          mail: '',
          pass: ''
        };
        for (i = 0; i < len; i++) {
          var r = results.rows.item(i);
          if (r.opcion === 'mail') {
            auth.mail = r.valor;
          }
          /*if (r.opcion === 'mail_pass') {
            auth.pass = r.valor;
          }*/
        }
        if (auth.mail !== '' /*&& auth.pass !== ''*/) {
          //console.log('user:"'+auth.mail+':'+auth.pass+'"');
          var transporter = window.nodemailer.createTransport({
            host: "smtp.gmail.com",
            secure: true,
            port: 465,
            auth: {
              user: window.MAIL_CONFIG.user, //auth.mail,
              pass: window.MAIL_CONFIG.pass //auth.pass
            }
          });
          var mailOptions = {
            from: window.MAIL_CONFIG.user,
            to: auth.mail,
            subject: options.subject,
            generateTextFromHTML: true,
            html: options.html
          };
          transporter.sendMail(mailOptions, function(error, info) {
            options.onFinish(error, info);
          });
        } else {
          console.error('Not mail configured');
        }
      });
    });
  }

};


module.exports = Mail;
