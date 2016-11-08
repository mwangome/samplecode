var modulesUsersStore = new Ext.data.JsonStore({
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/user/getusers.action',
        method: 'GET'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'firstName', 'lastName', 'email', 'role', 'userName', 'state']

});

modulesUsersStore.load();

var userModuleSelectModel = new Ext.grid.CheckboxSelectionModel();

var modulesAddUserPanel = new Ext.TabPanel({
    activeTab: 0,
    plain: true,
    id: 'modules-add-user-panel',
    defaults: {
        autoScroll: true
    },
    items: [{
            layout: 'border',
            title: 'Users',
            items: [{
                    // lazily created panel (xtype:'panel' is default)
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Module Settings',
                    margins: '0 5 0 0'
                }, new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 200,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Add Users',
                    margins: '0 5 0 0',
                    store: modulesUsersStore,
                    id: 'module-users-grid',
                    closable: true,
                    sm: userModuleSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [userModuleSelectModel, {
                            header: "Id",
                            width: 150,
                            sortable: true,
                            hidden: true,
                            dataIndex: 'id',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "First Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'firstName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Last Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'lastName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Email",
                            width: 70,
                            sortable: true,
                            dataIndex: 'email',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Role",
                            width: 70,
                            sortable: true,
                            dataIndex: 'role',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "User Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'userName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }), new Ext.FormPanel({
                    labelWidth: 100, // label settings here cascade unless overridden
                    url: contextpath + '/moduleuser/save.action?_csrf=' + csrfToken,
                    method: 'POST',
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    id: 'module-user-form-panel',
                    region: 'center',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Site Info',
                            collapsible: true,
                            autoHeight: true,
                            defaults: {
                                anchor: '75%',
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Id',
                                    name: 'id',
                                    hidden: true
                                }, {
                                    fieldLabel: 'Module Name',
                                    name: 'moduleName'
                                },{
                                    fieldLabel: 'Module Code',
                                    name: 'moduleCode'
                                },{
                                    fieldLabel: 'Effective Date',
                                    name: 'effectiveDate',
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'Module link',
                                    name: 'path'
                                }, {
                                    fieldLabel: 'Data',
                                    name: 'data',
                                    hidden: true
                                }, new Ext.form.ComboBox({
                                    store: smeEntitySiteStore,
                                    fieldLabel: 'Entity Name',
                                    displayField: 'registeredName',
                                    typeAhead: true,
                                    name: 'registeredName',
                                    mode: 'local',
                                    anchor: '75%',
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select a Entity...',
                                    selectOnFocus: true
                                }), {
                                    checked: true,
                                    fieldLabel: 'Enabled',
                                    xtype: 'checkbox',
                                    labelSeparator: '',
                                    boxLabel: 'Is Active',
                                    name: 'enabled'
                                }],
                            buttons: [{
                                    text: 'Save',
                                    iconCls: 'silk-save',
                                    handler: function () {
                                        var form = Ext.getCmp('module-user-form-panel').getForm();
                                        console.log('getting form ...')
                                        if (form.isValid()) {
                                            var size = Ext.getCmp('module-users-grid').getSelectionModel().selections.items.length;
                                            var obj = [];
                                            for (var i = 0; i < size; i++) {
                                                obj.push(Ext.getCmp('module-users-grid').getSelectionModel().selections.items[i].id);

                                            }
                                            form.findField('data').setValue(obj)
                                            form.submit({
                                                success: function (obj, resp) {
                                                    var json = JSON.parse(resp.response.responseText);
                                                    Ext.Msg.show({
                                                        title: 'Server Message',
                                                        msg: json.msg,
                                                        icon: Ext.Msg.INFO,
                                                        buttons: Ext.Msg.OK
                                                    }
                                                    );
                                                    winModuleUserSettings.hide();
                                                }, failure: function (obj, resp) {
                                                    var json = JSON.parse(resp.response.responseText);
                                                    Ext.Msg.show({
                                                        title: 'Server Message',
                                                        msg: json.msg,
                                                        icon: Ext.Msg.INFO,
                                                        buttons: Ext.Msg.ERROR
                                                    }
                                                    )
                                                }
                                            });
                                        }
                                    }
                                }, {
                                    text: 'Cancel',
                                    iconCls: 'silk-application-delete',
                                    handler: function(){
                                        winModuleUserSettings.hide();
                                    }
                                }]
                        }]
                })]
        }],
    autoDestroy: false
}

);



var winModuleUserSettings;
function showModuleSettingsWindow(moduleName) {
    if (!winModuleUserSettings) {
        winModuleUserSettings = new Ext.Window({
            title: 'Module Settings',
            layout: 'fit',
            frame: true,
            width: 650,
            height: 500,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: modulesAddUserPanel
        });
    }
    winModuleUserSettings.show(this);

    //Ext.getCmp('module-user-form-panel').getForm().reset();
    Ext.getCmp('module-user-form-panel').getForm().load({
        url: contextpath + '/module/formview.action',
        params: {
            moduleName: moduleName,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
    moduleName == 'Loan Center' ? Ext.getCmp('module-user-form-panel').getForm().findField('path').setVisible(true) :
            Ext.getCmp('module-user-form-panel').getForm().findField('path').setVisible(false)
    Ext.getCmp('module-user-form-panel').getForm().findField('moduleName').setValue(moduleName);
}