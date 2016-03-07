'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'bootbox',
  'text!views/admUser.html',
  'text!views/newUser.html'
], function($, _, Backbone, bs, bootbox, HtmlTemp, newUserTmpl) {

  var AdmUSR = Backbone.View.extend({
    tagName: 'div',
    initialize: function() {
      globalEvents.on('RefreshTBLUsers', function() {
        fRefreshTBLUsers();
      });
    },
    render: function() {
      var htmlOutput = _.template(HtmlTemp);
      this.$el.html(htmlOutput);
      return this;
    },
    events: {
      'click #btnAddUsr': 'addUser',
      'click #btnEditUsr': 'editUser',
      'click #btnRMUsr': 'rmUser',
      'click .rowUser': 'clickRowUser'
    },

    clickRowUser: function(event) {
      $('#btnEditUsr').prop('disabled', true);
      $('#btnRMUsr').prop('disabled', true);
      if (event.target.localName === 'td') {
        if ($(event.target.parentNode).hasClass('success')) {
          $(event.target.parentNode).removeClass('success');
        } else {
          $('#tbodUserData').find('tr.success').removeClass('success');
          $(event.target.parentNode).addClass('success');
          $('#btnEditUsr').prop('disabled', false);
          $('#btnRMUsr').prop('disabled', false);
        }
      }
    },

    dialogUser: function(opc) {
      bootbox.dialog({
        message: _.template(newUserTmpl),
        title: opc.title,
        buttons: {
          success: {
            label: opc.label + '!',
            className: 'btn-success',
            callback: function(e) {
              if (opc.onClickOk) {
                var id = $('#inNewUserID').val();
                var nom = $('#inNewUserNombre').val();
                var ape = $('#inNewUserApellido').val();
                var pwd = $('#inNewUserPWD').val().toLowerCase();
                var esadmin = $('#chkNewEsAdmin').is(':checked') ? 1 : 0;
                opc.onClickOk(id, nom, ape, pwd, esadmin);
              }
            }
          },
          cancel: {
            label: 'Cancelar!',
            className: 'btn-danger',
            callback: function() {}
          }
        }
      });
      if (opc.onShow) {
        opc.onShow();
      }
    },

    addUser: function() {
      this.dialogUser({
        title: 'Nuevo Vendedor',
        label: 'Agregar',
        onShow: function() {
        },
        onClickOk: function(id, nom, ape, pwd, esadmin) {
          window.DB.transaction(function(tx) {
            var sql = "INSERT INTO usuarios( nombre, apellidos, es_admin, passwd) " +
              "VALUES('" + nom + "', '" + ape + "', " + esadmin + ", '" + pwd + "');";
            tx.executeSql(sql);
            globalEvents.trigger('RefreshTBLUsers');
          });
        }
      });
    },

    editUser: function() {
      this.dialogUser({
        title: 'Nuevo Vendedor',
        label: 'Guardar cambios',
        onShow: function() {
          var $row = $($('#tbodUserData').find('tr.success')[0]);
          $('#inNewUserID').prop('disabled', true).val($row.data('id'));
          $('#inNewUserNombre').val($row.data('nom'));
          $('#inNewUserApellido').val($row.data('ape'));
          $('#inNewUserPWD').val($row.data('pwd'));
          $('#chkNewEsAdmin').prop('checked', $row.data('es_admin'));
        },
        onClickOk: function(id, nom, ape, pwd, esadmin) {
          window.DB.transaction(function(tx) {
            var sql = "UPDATE usuarios SET " +
              " nombre='" + nom + "', apellidos='" + ape + "', es_admin=" + esadmin + ", passwd='" + pwd + "' " +
              " WHERE id=" + id;
            tx.executeSql(sql, [], function(tx, results) {
              //console.log(tx);
            });
            globalEvents.trigger('RefreshTBLUsers');
          });
        }
      });
    },

    rmUser: function() {
      var $row = $($('#tbodUserData').find('tr.success')[0]);
      bootbox.dialog({
        message: 'Seguro que desea eliminar "' + $row.data('nom') + ' ' + $row.data('ape') + '""',
        title: 'Eliminar',
        buttons: {
          success: {
            label: 'Si',
            className: 'btn-danger',
            callback: function(e) {

              window.DB.transaction(function(tx) {
                var sql = 'DELETE FROM usuarios WHERE id=' + $row.data('id');
                tx.executeSql(sql);
                globalEvents.trigger('RefreshTBLUsers');
              });
            }
          },
          cancel: {
            label: 'Cancelar!',
            className: 'btn-success',
            callback: function() {}
          }
        }
      });
    }
  });

  return AdmUSR;
});




function fRefreshTBLUsers() {
  window.DB.transaction(function(tx) {
    tx.executeSql('SELECT * FROM usuarios', [], function(tx, results) {
      window.ALLUSERS = [];
      $('#tbodUserData').html('');
      var len = results.rows.length, i;
      var html = '';
      var options = '<option value="-1" selected="selected">Seleccione</option>';
      for (i = 0; i < len; i++) {
        var r = results.rows.item(i);
        window.ALLUSERS.push(r);
        var data = ' data-id="' + r.id + '" data-nom="' + r.nombre + '" data-ape="' + r.apellidos + '" data-esad="' + r.es_admin + '" data-pwd="' + r.passwd + '" ';
        html += '<tr class="rowUser" ' + data + '>';
        html += '<th scope="row">' + r.id + '</th>';
        html += '<td>' + r.nombre + '</td>';
        html += '<td>' + r.apellidos + '</td>';
        html += '<td>' + r.es_admin + '</td>';
        html += '<td><div class="shwTblPWD" data-pwd="'+r.passwd+'"><span>****</span></div></td>';
        html += '</tr>';
        if(r.es_admin!==1){
          options += '<option value="' + r.id + '">' + r.nombre + ' '+r.apellidos+'</option>';
        }
      }
      $('#tbodUserData').html(html);
      $('#btnEditUsr').prop('disabled', true);
      $('#btnRMUsr').prop('disabled', true);
      $('#dpTOTUser').html(options);
      $('#dpDTUser').html(options);
    });
  });
}
