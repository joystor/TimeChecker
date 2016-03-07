'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'bootstrap',
  'bootbox',
  'text!views/admReportTotal.html'
], function($, _, Backbone, bs, bootbox, HtmlTemp) {
  var AdmRepTotal = Backbone.View.extend({
    tagName: 'div',
    initialize: function() {},
    render: function() {
      var htmlOutput = _.template(HtmlTemp);
      this.$el.html(htmlOutput);
      return this;
    },
    events: {
      "change #dpTOTUser":"selUser",
      'change input':'genReport'
    },
    selUser:function(e){
      window.EvtData={
        id: 'dpTOTUser',
        dF:'dpTOTFrom',
        dT:'dpTOTTo'
      };
      globalEvents.trigger('setDatesRanges');
    },
    genReport:function(){
      window.EvtData = {
        data:[],
        id: 'dpTOTUser',
        dF:'dpTOTFrom',
        dT:'dpTOTTo',
        tblB:'tblRepTOTB',
        tblH:'tblRepTOTH',
        isTotal: true,
        callback:function(data){
          if(data.length ===0){
            return;
          }
          window.EvtData.data = data;
          var dates = [];
          _.each(_.pluck(data,'registro'),function(o){
            dates.push(window.dateFormat(o,'dd/mm/yyyy'));
          });
          dates = (_.unique(dates)).sort();
          var idsUsrs = _.unique(_.pluck(window.EvtData.data,'id_usuario'));
          var cols = dates.length-1;
          var headhtml = '<tr><th>VENDEDOR</th>';
          for(var c=0;c<=cols;c++){
            headhtml += '<th>'+dates[c]+'</th>';
          }
          headhtml += '</tr>';

          var rowhtml = '';
          _.each(idsUsrs,function(user){
            var usr = _.where(window.ALLUSERS,{id:user})[0];
            rowhtml += '<tr><td><div style="width: 115px;">'+usr.nombre+' '+usr.apellidos+'</div></td>';
            for(var c=0;c<=cols;c++){
              var regs = _.filter(data, function(o){
                return window.dateFormat(o.registro,'dd/mm/yyyy')===dates[c] && o.id_usuario===user;
              });
              rowhtml += '<td><div style="width: 115px;">';
              var totTime = 0;
              var lastIn;
              var e ={wc:0,rest:0,out:0};
              _.each(regs,function(r,i){
                var f = window.dateFormat(r.registro,'HH:MM:ss');
                var m = r.evento;
                var isSum = true;
                switch(m){
                  case 'in': m=i===0?'Llegada:':'Regreso:'; isSum = false; break;
                  case 'wc': m='Baño:'; e.wc++; break;
                  case 'rest': m='Descanso:'; e.rest++; break;
                  case 'out': m='Salida:'; e.out++; break;
                }
                if(!isSum){
                  lastIn = f;
                }else{
                  var ms = window.moment( f ,"HH:mm:ss").diff( window.moment( lastIn ,"HH:mm:ss"));
                  totTime = totTime + ms;
                }
              });
              var d = window.moment.duration(totTime);
              var s = Math.floor(d.asHours()) + window.moment.utc(totTime).format(":mm:ss");
              rowhtml += ''+s+' hrs.'/*+
                  '<br>Idas al baño: '+e.wc+
                  '<br>Descansos: '+e.wc+
                  '<br>Salida: '+e.out
                  */;
              rowhtml += '</div></td>';
            }
            rowhtml += '</tr>';
          });
          $('#tblRepTOTH').html(headhtml);
          $('#tblRepTOTB').html(rowhtml);
        }
      };
      globalEvents.trigger('getData2Report');
    }
  });
  return AdmRepTotal;
});
