'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'bootbox',
  'text!views/admin.html',
  'controllers/admUser',
  'controllers/admConfig',
  'controllers/admReportDetalle',
  'controllers/admReportTotal'
], function($, _, Backbone, bs, bootbox, HtmlTemp, AdmUSR, AdmConfig, AdmRepDetalle, AdmReportTotal) {

  var Admin = Backbone.View.extend({
    id: 'contAdmin',
    tagName: 'div',
    className: 'pt-page-CONTENT',
    initialize: function() {
      globalEvents.on('RegisterEventsConfig', this.fRegisterEventsConfig);
      globalEvents.on('getData2Report', _.bind(this.getData2Report, this));
      globalEvents.on('setDatesRanges', _.bind(this.setDatesRanges, this));
    },
    render: function() {
      var admUser = new AdmUSR();
      var admConfig = new AdmConfig();
      var admRepDetalle = new AdmRepDetalle();
      var admReportTotal = new AdmReportTotal();
      var htmlOutput = _.template(HtmlTemp);
      this.$el.html(htmlOutput);
      this.$el.css('display', 'none');
      this.$('#secAdmUser').append(admUser.render().el);
      this.$('#secAdmConfig').append(admConfig.render().el);
      this.$('#secAdmRepDetalle').append(admRepDetalle.render().el);
      this.$('#secAdmRepTotal').append(admReportTotal.render().el);
      return this;
    },
    events: {
      'click #btnExitConfig': 'exitConfig'
    },

    exitConfig: function() {
      $('#contAdmin').hide();
      $('#contLogin').show();
      window.win.setResizable(true);
      window.win.resizeTo(350, 600);
      window.win.setPosition('center');
      window.win.setResizable(false);
    },

    fRegisterEventsConfig: function() {
      $('.date-picker').datepicker({
        format: 'dd/mm/yyyy'
      }).on('changeDate', function(e) {
        $(e.target).datepicker('hide');
      });
      $('.pwd-show span').mousedown(function() {
        $(this).parent().parent().find('input.pwd-show').attr('type', 'text');
      });
      $('.pwd-show span').mouseup(function() {
        $(this).parent().parent().find('input.pwd-show').attr('type', 'password');
      });
      if(!window.USR.isMaxMinDate){
        window.USR.isMaxMinDate = true;
        window.DB.transaction(function(tx) {
          tx.executeSql("select strftime('%d/%m/%Y',min(date(registro))) mind, strftime('%d/%m/%Y',max(date(registro))) maxd from control;",[],function(tx, res){
            var r = res.rows.item(0);
            $('#dpTOTFrom').datepicker('setStartDate',r.mind);
            $('#dpTOTTo').datepicker('setStartDate',r.mind);
            $('#dpTOTFrom').datepicker('setEndDate',r.maxd);
            $('#dpTOTTo').datepicker('setEndDate',r.maxd);
            $('#dpTOTFrom').prop('disabled',false);
            $('#dpTOTTo').prop('disabled',false);
          });
        });
      }
    },

    setDatesRanges:function(){
      var idUser = $('#'+window.EvtData.id+' option:selected').val();
      $('#'+window.EvtData.dF+'').prop('disabled',true);
      $('#'+window.EvtData.dT+'').prop('disabled',true);
      if(idUser!=='-1'){
        window.DB.transaction(function(tx) {
          tx.executeSql("select strftime('%d/%m/%Y', min(date(registro))) min from control where id_usuario="+idUser,[],function(tx, res){
            if(res.rows.length > 0){
              var r = res.rows.item(0);
              $('#'+window.EvtData.dF).prop('disabled',false);
              $('#'+window.EvtData.dT).prop('disabled',false);
              $('#'+window.EvtData.dF).datepicker('setStartDate',r.min);
              $('#'+window.EvtData.dT).datepicker('setStartDate',r.min);
            }
          });
        });
      }
    },

    getData2Report: function(){
      var id = $('#'+window.EvtData.id+' option:selected').val();
      var dF = $('#'+window.EvtData.dF).val();
      var dT = $('#'+window.EvtData.dT).val();
      if(dF==='' || dT===''){
        return;
      }
      $('#'+window.EvtData.tblH).html('');
      $('#'+window.EvtData.tblB).html('');
      dF = window.dateFormat(window.toDate(dF),'yyyy-mm-dd');
      dT = window.dateFormat(window.toDate(dT),'yyyy-mm-dd');
      window.DB.transaction(function(tx) {
        var whereByID = "id_usuario="+id+" and";
        if(window.EvtData.isTotal){
          whereByID = '';
        }
        tx.executeSql("select * from control where "+whereByID+" date(registro)>='"+dF+"' and date(registro)<='"+dT+"'",[],function(tx, res){
          var data = [];
          var len = res.rows.length, i;
          for (i = 0; i < len; i++) {
            data.push(res.rows.item(i));
          }
          window.EvtData.callback(data);
        });
      });
    }

  });

  return Admin;
});
