'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'bootbox',
  'text!views/login.html'
], function($, _, Backbone, bootbox, LoginTemp) {

  var Login = Backbone.View.extend({
    id: 'contLogin',
    tagName: 'div',
    className: 'pt-page-CONTENT',
    initialize: function() {
      setInterval(function(){
        //npm install dateformat --prefix=app/main/
        var now = new Date();
        var date = window.dateFormat(now, "dd/mm/yy<br/>h:MM:ss TT");
        $('#secTime').html( date);
      }, 1000);
    },
    render: function() {
      var htmlOutput = _.template(LoginTemp);
      this.$el.html(htmlOutput);
      return this;
    },
    events: {
      'click #btnGoConfig': 'GoConfigMod',
      'click .btnLogS': 'LoginProccess',
      'change #usrID': 'LoginUser'
    },

    GoConfigMod: function() {
      globalEvents.trigger('RegisterEventsConfig');
      globalEvents.trigger('RefreshTBLUsers');

      window.DB.transaction(function(tx) {
        tx.executeSql("select * from usuarios",[],function(tx, res){
          window.ADMIN_USERS = [];
          var len = res.rows.length, i;
          for (i = 0; i < len; i++) {
            window.ADMIN_USERS.push(res.rows.item(i));
          }
          if(res.rows.length===0){
            openCONFIG();
          }else{
            bootbox.dialog({
              message: '<div class="form-group"><input type="password" class="inAdminPwd form-control"></div>',
              title: "Contraseña",
              buttons: {
                main:{
                  label: "Entrar",
                  className: "btn-primary",
                  callback: function() {
                    var id = $('.inAdminPwd').val().toLowerCase();
                    var adm = _.where(window.ADMIN_USERS,{passwd:id});
                    if(adm.length===1){
                      window.USR.esAdmin = adm[0].es_admin;
                      window.USR.ID = adm[0].id;
                      openCONFIG();
                    }else{
                      $('#msgLogin').show().html('<strong>Contraseña incorrecta</strong>');
                      setTimeout(function() {
                        $('#msgLogin').hide();
                      }, 5000);
                    }
                  }
                }
              }
            });
          }
        });
      });

    },

    LoginProccess: function(e) {
      //console.log(e);
      var $b = $(e.currentTarget);
      var evt = $b.data('tipevnt');
      $('#msgLogin').show().html('');
      window.DB.transaction(function(tx) {
        var now = new Date();
        var date = window.dateFormat(now,'yyyy-mm-dd HH:MM:ss');
        tx.executeSql("INSERT INTO control(id_usuario,evento, registro) VALUES ("+window.USR.ID+",'"+evt+"','"+date+"');",[],function(tx, res){
          if(res.insertId){
            tx.executeSql('SELECT * FROM control WHERE id='+res.insertId,[],function(tx,res){
              var r = res.rows.item(0);
              var msg = '';
              switch(evt){
                case 'in':
                  msg = 'Llegada registrada:<br/>'+r.registro;
                  break;
                case 'out':
                  msg = 'Salida:<br/>'+r.registro;
                  break;
                case 'rest':
                  msg = 'Descanso:<br/>'+r.registro;
                  break;
                case 'wc':
                  msg = 'Baño:<br/>'+r.registro;
                  break;
              }
              $('.btnLogS').hide();
              $('#usrID').val('');
              $('#msgLogin').show().html(msg);
              setTimeout(function() {
                $('#msgLogin').hide();
              }, 5000);
              window.Mail.send({
                subject:window.USR.NEG+' '+window.USR.NOM+' '+window.USR.APE+' '+msg.replace('<br/>','').replace(' registrada','') ,
                html:'<h2>Evento Registrado de:</h2>'+
                '<p>'+
                '<h3>'+window.USR.NOM+' '+window.USR.APE+'</h3>'+
                ' '+msg.replace('<br/>','').toUpperCase()+
                '</p>',
                onFinish: function(error, info){
                  if(error && error.message){
                    console.log('ERROR EN MAIL:');
                    console.log(error.message||'');
                  }
                }
              });
            });
          }
        });
      });


    },

    LoginUser: function() {
      var $id = $('#usrID');
      if($id.val().length >= window.MAX_ID){
        window.DB.transaction(function(tx) {
          var now = new Date();
          var date = window.dateFormat(now,'yyyy-mm-dd');
          tx.executeSql(
            "SELECT *, "+
            "  (select count(*) from control where id_usuario=U.id and date(registro)=date('"+date+"')) cntreg, "+
            "  (select evento from control where id_usuario=U.id and date(registro)=date('"+date+"') order by registro desc limit 1) evnt, "+
            "  (select valor from configuracion where opcion='nombre') nomneg"+
            " FROM usuarios U WHERE lower(passwd)='"+$id.val().toLowerCase()+"'", [],
          function(tx, results) {
            if(results.rows.length === 0){
              bootbox.alert('No se encontro el ID');
            }else{
              var r = results.rows.item(0);
              window.USR.ID = r.id;
              window.USR.NOM = r.nombre;
              window.USR.APE = r.apellidos;
              window.USR.NEG = r.nomneg || '';
              if(r.cntreg === 0){
                //Nuevo ingreso del dia
                $('#btnLogIn').show();
                $('#msgLogin').html('Bienvenido "'+r.nombre+' '+r.apellidos+'"');
              }else{
                if(r.evnt === 'in'){
                  $('.btnLogSOUT').show();
                  $('.btnLogSIN').hide();
                }else{
                  $('.btnLogSOUT').hide();
                  $('.btnLogSIN').show();
                }
              }
            }
          });
        });
      }else{
        bootbox.alert('ID no puede ser menor a '+window.MAX_ID+' digitos');
      }
    }
  });

  return Login;
});



function openCONFIG(){
  if(window.USR.esAdmin===0){
    $('#dpDTUser option').not('option[value=-1]').attr('disabled',true);
    $('#dpDTUser option[value='+window.USR.ID+']').attr('disabled',false);
    $('a[href="#tabUsuarios"]').hide();
    $('a[href="#tabTotal"]').hide();
    $('a[href="#tabConfig"]').hide();
    $('a[href="#tabDetalle"]').trigger('click');
  }else{
    $('#dpDTUser option').not('option[value=-1]').attr('disabled',false);
    $('a[href="#tabUsuarios"]').show();
    $('a[href="#tabTotal"]').show();
    $('a[href="#tabConfig"]').show();
    $('a[href="#tabUsuarios"]').trigger('click');
  }
  $('#contLogin').hide();
  $('#contAdmin').show();
  window.win.setResizable(true);
  window.win.resizeTo(800, 600);
  window.win.setPosition('center');
  window.win.setResizable(false);
}
