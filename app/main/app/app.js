'use strict';

define([
    'jquery',
    'controllers/login',
    'controllers/admin'
], function($, Login, Admin){
    var APP = {
        oDOM: $('#APP'),
        start : function(){

            var login = new Login();
            login.render();
            this.oDOM.append(login.$el);

            var admin = new Admin();
            admin.render();
            this.oDOM.append(admin.$el);

            this.oDOM.show();
        }
    };
    return APP;
});
