/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
            }
        } else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
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
            return (val == pwd.getValue());
        }
        return true;
    },
    passwordText: 'Passwords do not match'
});


var rolesUserStore = new Ext.data.JsonStore({
    id: 'users-roles-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/user/roles.action',
        method: 'GET'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['role', 'code', 'enabled']

});

var storeStates = new Ext.data.GroupingStore({
    url: contextpath + '/user/getuserstatuses.action',
    autoLoad: true,
    remoteGroup: true,
    groupField: 'state',
    storeId: 'storeState',
    sortInfo: {
        field: 'state',
        direction: 'ASC'
    },
    baseParams: {
        _csrf: csrfToken
    },
    reader: new Ext.data.JsonReader({
        totalProperty: 'totalCount',
        root: 'data',
        idProperty: 'state',
        fields: ['state']
    })
});

storeStates.load({
    params: {
        start: 0,
        limit: 25,
        _csrf: csrfToken
    }
});

rolesUserStore.load({
    params: {
        start: 0,
        limit: 25,
        _csrf: csrfToken
    }
});

branchesStore.load({
    params: {
        start: 0,
        limit: 25,
        _csrf: csrfToken,
        entityId: entityId
    }
});

var comboStates = new Ext.form.ComboBox({
    fieldLabel: 'State',
    name: 'state',
    id: 'state-form',
    anchor: "95%",
    allowBlank: false,
    emptyText: "Select action",
    triggerAction: 'all',
    lazyRender: true,
    mode: 'remote',
    store: storeStates,
    valueField: 'state',
    displayField: 'state'
});

var userRolesCombo = new Ext.form.ComboBox({
    fieldLabel: 'Roles',
    name: 'role',
    id: 'user-roles-combo',
    anchor: "95%",
    allowBlank: false,
    emptyText: "Select action",
    triggerAction: 'all',
    lazyRender: true,
    mode: 'remote',
    store: rolesUserStore,
    valueField: 'role',
    displayField: 'role'
});

var fsf = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/user/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'system-user-form',
    items: [{
            xtype: 'fieldset',
            title: 'User Details',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    fieldLabel: 'Entity Name',
                    id: 'smeentity-store-useradd-combo',
                    displayField: 'registeredName',
                    typeAhead: true,
                    name: 'registeredName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Entity...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: branchesStore,
                    fieldLabel: 'Branch Name',
                    id: 'branches-useradd-combo',
                    displayField: 'branchName',
                    typeAhead: true,
                    name: 'branchName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Branch...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'First Name',
                    name: 'firstName',
                    allowBlank: false
                }, {
                    fieldLabel: 'Last Name',
                    name: 'lastName',
                    allowBlank: false
                }, {
                    fieldLabel: 'Id',
                    name: 'id',
                    hidden: true
                }, {
                    fieldLabel: 'Checker',
                    name: 'passwordChecker',
                    hidden: true
                }, {
                    fieldLabel: 'Email',
                    name: 'email',
                    allowBlank: false,
                    vtype: 'email'
                }, {
                    fieldLabel: 'Username',
                    name: 'username',
                    allowBlank: false,
                    vtype: 'email'
                }, userRolesCombo, comboStates, {
                    fieldLabel: 'Status Date',
                    name: 'statusDate',
                    format: 'd/m/Y',
                    xtype: 'datefield'
                }, {
                    fieldLabel: 'Password',
                    inputType: 'password',
                    name: 'password',
                    allowBlank: false,
                    id: 'pass'
                }, {
                    fieldLabel: 'Confirm Pwd',
                    inputType: 'password',
                    name: 'pass-cfm',
                    vtype: 'password',
                    allowBlank: false,
                    initialPassField: 'pass' // id of the initial password field
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('system-user-form').getForm();
                form.findField('passwordChecker').setValue(form.findField('password').getValue());
                if (form.isValid()) {
                    form.submit({
                        waitMsg : 'Please Wait...',
                        success: function (obj, resp) {
                            console.log(resp.response.responseText);
                            var json = JSON.parse(resp.response.responseText);
                            Ext.Msg.show({
                                title: "Server Response",
                                msg: json.msg,
                                icon: Ext.Msg.INFO,
                                buttons: Ext.Msg.OK
                            });
                            winSystemUser.hide();
                        }, failure: function (response, obj) {
                            console.log(obj);
                            var res = obj.response.responseText;
                            try {
                                res = Ext.decode(obj.response.responseText);
                            } catch (e) {
                                console.log(e);
                            }
                            if (res.includes('Access is denied')) {
                                Ext.Msg.show({
                                    title: 'Server Alert',
                                    msg: 'Sorry, you do not have access rights for this action!',
                                    icon: Ext.Msg.WARNING,
                                    buttons: Ext.Msg.OK
                                });
                            } else {
                                Ext.Msg.show({
                                    title: 'Server Alert',
                                    msg: 'Save attempt failed!',
                                    icon: Ext.Msg.WARNING,
                                    buttons: Ext.Msg.OK
                                });
                            }

                        }
                    });
                }
            }
        }, {
            text: 'Cancel',
            iconCls: 'silk-application-delete',
            handler: function () {
                winSystemUser.hide();
            }
        }]
});

var winSystemUser;
function addUserWindow(userId) {
    if (!winSystemUser) {
        winSystemUser = new Ext.Window({
            title: 'Add User',
            layout: 'fit',
            width: 500,
            height: 420,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: fsf
        });
    }
    winSystemUser.show(this);

    Ext.getCmp('system-user-form').getForm().reset();
    Ext.getCmp('system-user-form').getForm().load({
        url: contextpath + '/getuser-in-form.action',
        params: {
            id: userId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

