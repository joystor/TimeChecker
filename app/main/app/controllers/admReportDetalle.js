'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'bootbox',
  'text!views/admReportDetalle.html'
], function($, _, Backbone, bs, bootbox, HtmlTemp) {

  var AdmRepDetalle = Backbone.View.extend({
    tagName: 'div',
    initialize: function() {},
    render: function() {
      var htmlOutput = _.template(HtmlTemp);
      this.$el.html(htmlOutput);
      return this;
    },
    events: {
      "change #dpDTUser":"selUser",
      'change input':'genReport'
    },
    selUser:function(e){
      window.EvtData={
        id: 'dpDTUser',
        dF:'dpDTFrom',
        dT:'dpDTTo'
      };
      globalEvents.trigger('setDatesRanges');
    },
    genReport:function(){
      window.EvtData = {
        data:[],
        id: 'dpDTUser',
        dF:'dpDTFrom',
        dT:'dpDTTo',
        tblH:'tblRepDTH',
        tblB:'tblRepDTB',
        callback:function(data){
          if(data.length ===0){
            return;
          }
          var dates = [];
          _.each(_.pluck(data,'registro'),function(o){
            dates.push(window.dateFormat(o,'dd/mm/yyyy'));
          });
          dates = (_.unique(dates)).sort();
          var cols = dates.length-1;
          var headhtml = '<tr>';
          var rowhtml = '<tr>';
          for(var c=0;c<=cols;c++){
            headhtml += '<th>'+dates[c]+'</th>';
            var regs = _.filter(data, function(o){
              return window.dateFormat(o.registro,'dd/mm/yyyy')===dates[c];
            });
            rowhtml += '<td><table class="table table-striped table-hover" style="width: 140px;">';
            var totTime = 0;
            var lastIn;
            _.each(regs,function(r,i){
              var f = window.dateFormat(r.registro,'HH:MM:ss');
              var m = r.evento;
              var isSum = true;
              switch(m){
                case 'in': m=i===0?'Llegada:':'Regreso:'; isSum = false; break;
                case 'wc': m='Baño:'; break;
                case 'rest': m='Descanso:'; break;
                case 'out': m='Salida:'; break;
              }
              if(!isSum){
                lastIn = f;
              }else{
                var ms = window.moment( f ,"HH:mm:ss").diff( window.moment( lastIn ,"HH:mm:ss"));
                totTime = totTime + ms;
              }
              rowhtml += '<tr>';
              rowhtml += '<td>'+m+'</td>';
              rowhtml += '<td>'+f+'</td>';
              rowhtml += '</tr>';
            });
            var d = window.moment.duration(totTime);
            var s = Math.floor(d.asHours()) + window.moment.utc(totTime).format(":mm:ss");
            rowhtml += '<tr class="success"><td>Total:</td><td>'+s+'</td></tr>';
            rowhtml += '</table></td>';
          }
          headhtml += '</tr>';
          rowhtml += '</tr>';
          $('#tblRepDTH').html(headhtml);
          $('#tblRepDTB').html(rowhtml);
        }
      };
      globalEvents.trigger('getData2Report');
    }
  });
  return AdmRepDetalle;
});
