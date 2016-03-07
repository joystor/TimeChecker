'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'bootbox',
  'text!views/admConfig.html'
], function($, _, Backbone, bs, bootbox, HtmlTemp) {

  var AdmCONFIG = Backbone.View.extend({
    tagName: 'div',
    initialize: function() {},
    render: function() {
      var htmlOutput = _.template(HtmlTemp);
      this.$el.html(htmlOutput);
      this.loadValues();
      return this;
    },
    events: {
      'change input': 'chgOption',
      'click #btnTestMail': 'TestMail'
    },
    loadValues: function() {
      window.DB.transaction(function(tx) {
        tx.executeSql('SELECT * FROM configuracion', [], function(tx, results) {
          var len = results.rows.length, i;
          for (i = 0; i < len; i++) {
            var r = results.rows.item(i);
            $('input[data-opt="' + r.opcion + '"]').val(r.valor);
          }
        });
      });
    },
    chgOption: function(evt) {
      var opcion = $(evt.currentTarget).data('opt');
      var valor = $(evt.currentTarget).val();
      window.DB.transaction(function(tx) {
        tx.executeSql("DELETE FROM configuracion WHERE opcion='" + opcion + "'");
        tx.executeSql("INSERT INTO configuracion VALUES('" + opcion + "','" + valor + "')");
      });
    },
    TestMail: function(){
      window.Mail.send({
        subject:$('#inBNom').val()+' prueba de envio de correo',
        html:'<h2>Prueba de envio de correo</h2>',
        onFinish: function(error, info){
          if(error && error.message){
            bootbox.alert(error.message||'');
          }else{
            bootbox.alert('Correo enviado, por favor verifica en tu bandeja de entrada');
          }
        }
      });
    }
  });
  return AdmCONFIG;
});
