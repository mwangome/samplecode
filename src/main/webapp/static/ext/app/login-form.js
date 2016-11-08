Ext.QuickTips.init();

// turn on validation errors beside the field globally
Ext.form.Field.prototype.msgTarget = 'side';

Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() !== start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
            }
        } else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() !== end.minValue.getTime())) {
                end.setMinValue(date);
                end.validate();
            }
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },
    password: function (val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val === pwd.getValue());
        }
        return true;
    },
    passwordText: 'Passwords do not match'
});




Ext.onReady(function() {
    var fsf = new Ext.FormPanel({
    labelWidth: 75, // label settings here cascade unless overridden
    id: 'login-form',
    title: 'Login',
    renderTo: 'lp-pom-text-23',
    url: contextpath + '/login',
    method: 'POST',
    frame: true,
    bodyStyle: 'padding:5px 5px 0',
    items: [
//        {
//            xtype: 'box',
//            autoEl: {
//                tag: 'div',
//                html: '<div class="app-msg"><img src="' + contextpath + '/static/images/metrologo1-300x129.png" class="app-img"  width="410" height="100" /></div>'
//
//            }
//        }, 
        {
            xtype: 'fieldset',
            title: 'Login Credentials',
            collapsible: true,
            autoHeight: true,
            defaults: {
                width: 270
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'Username',
                    name: 'username',
                    id: 'ssoId',
                    listeners: {
                        specialkey: function (frm, evt) {
                            if (evt.getKey() == evt.ENTER) {
                                comeOnIn();
                            }
                        }
                    }
                }, {
                    xtype: 'hidden',
                    name: csrf,
                    value: csrfToken,
                    id: 'csrfToken',
                    allowBlank: false,
                    emptyText: 'Enter your username'
                }, {
                    inputType: 'password',
                    fieldLabel: 'Password',
                    name: 'password',
                    id: 'password',
                    listeners: {
                        specialkey: function (frm, evt) {
                            if (evt.getKey() === evt.ENTER) {
                                comeOnIn();
                            }
                        }
                    }
                }, {
                    fieldLabel: 'New Pwd',
                    inputType: 'password',
                    name: 'newPassword',
                    hidden: true,
                    id: 'pass'
                }, {
                    fieldLabel: 'Confirm Pwd',
                    inputType: 'password',
                    name: 'pass-cfm',
                    hidden: true,
                    id: 'pass-cfm',
                    vtype: 'password',
                    initialPassField: 'pass' // id of the initial password field
                }]
        }],
    buttons: [{
            text: 'Login',
            handler: function () {
                var form = Ext.getCmp('login-form').getForm();
                form.standardSubmit = true;
                if (form.isValid()) {
                    var passFld = Ext.getCmp('pass').isVisible();
                    var passCfm = Ext.getCmp('pass-cfm').isVisible();
                    if (passFld && passCfm&&Ext.getCmp('pass').getValue().length > 0) {
                        if (Ext.getCmp('pass').getValue() === Ext.getCmp('pass-cfm').getValue()) {
                            Ext.Ajax.request({
                                url: contextpath + '/user/resetpassword.action',
                                method: 'POST',
                                params: {
                                    _csrf: csrfToken,
                                    password: Ext.getCmp('password').getValue(),
                                    username: Ext.getCmp('ssoId').getValue(),
                                    newPassword: Ext.getCmp('pass').getValue()
                                },
                                success: function (obj, resp) {
                                    var json = JSON.parse(obj.responseText);
                                    Ext.Msg.show({
                                        title: "Server Response",
                                        msg: json.msg,
                                        icon: Ext.Msg.INFO,
                                        buttons: Ext.Msg.OK
                                    });
                                    Ext.getCmp('password').setValue(json.password);
                                    form.submit();
                                }, failure: function () {
                                    Ext.Msg.show({
                                        title: "Credentials Incorrect",
                                        msg: 'You have been denied permission!',
                                        icon: Ext.Msg.WARNING,
                                        buttons: Ext.Msg.OK
                                    });
                                }
                            });
                        }
                    } if(!passFld && !passCfm) {
                        form.submit();
                    }
                }


            }
        }, {
            text: 'Cancel'
        }]
});


})

function comeOnIn() {
    var form = Ext.getCmp('login-form').getForm();
    form.standardSubmit = true;
    if (form.isValid()) {
        form.submit();
    }
}

//var win = new Ext.Window({
//    layout: 'fit',
//    id: 'login-window',
//    title: 'Administrator',
//    width: 450,
//    height: 300,
//    closeAction: 'hide',
//    plain: true,
//    items: fsf,
//    fbar: ['->', {
//            xtype: 'box',
//            autoEl: {
//                html: '<font color="blue"><u>&copy; ' + new Date().format('Y') + ' | <b>Metropol Technologies</b></u></font>'
//            }
//        }
//    ]
//});
//win.show();

//Ext.getCmp('password').focus(false, 1000);


Ext.Ajax.request({
    url: contextpath + '/user/ispasswordreset.action',
    method: 'POST',
    params: {
        _csrf: csrfToken,
        username: getParameter('username')
    },
    success: function (obj, resp) {
        var json = JSON.parse(obj.responseText);
        var ispasswordreset = json.ispasswordreset;
        if (!ispasswordreset&&getParameter('username') !== undefined) {//||!getParameter('username') === undefined
            Ext.getCmp('login-window').setHeight(360);
            Ext.getCmp('pass').setVisible(true);
            Ext.getCmp('pass-cfm').setVisible(true);
        }else{
            
        }
    }, failure: function () {

    }
});


function getParameter(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}
;