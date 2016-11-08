
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var tools = [{
        id: 'maximize',
        handler: function () {
        }
    }];

var modulesSetupStore = new Ext.data.JsonStore({
    id: 'modules-manager-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/modules/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'moduleCode', 'moduleName']

});




var moduleUsersStore = new Ext.data.JsonStore({
    id: 'moduleusers-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/moduleusers/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'userName', 'firstName', 'lastName', 'email', 'role']

});


modulesSetupStore.load({
    params: {
        _csrf: csrfToken
    }
});

moduleUsersStore.load({
    params: {
        _csrf: csrfToken
    }
});



var modulesSetupSelectModel = new Ext.grid.CheckboxSelectionModel();

var moduleUsersSelectModel = new Ext.grid.CheckboxSelectionModel();


var modulesManagerPanel = new Ext.TabPanel({
    activeTab: 0,
    plain: true,
    id: 'modules-manager-panel',
    defaults: {
        autoScroll: true
    },
    items: [{
            layout: 'border',
            title: 'Modules Management',
            items: [{
                    // lazily created panel (xtype:'panel' is default)
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Modules setup',
                    margins: '0 5 0 0'
                }, new Ext.grid.GridPanel({
                    region: 'center',
                    split: true,
                    height: 330,
                    minSize: 100,
                    maxSize: 400,
                    collapsible: true,
                    title: 'Modules Management',
                    tools: tools,
                    margins: '0 5 0 0',
                    store: modulesSetupStore,
                    id: 'modules-setup-grid',
                    closable: true,
                    sm: modulesSetupSelectModel,
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'View Module',
                            iconCls: 'silk-comment-add',
                            handler: function () {
                                requirejs([contextpath + "/static/ext/app/finance-main/layouts/modules-manager-window.js"], function () {
                                    var isSelected = Ext.getCmp('modules-setup-grid').getSelectionModel().hasSelection();
                                    var moduleName = '';
                                    if (isSelected) {
                                        moduleName = Ext.getCmp('modules-setup-grid').getSelectionModel().getSelected().get('moduleName');
                                        showModuleSettingsWindow(moduleName);
                                    } else {
                                        Ext.MessageBox.show({
                                            title: 'Select',
                                            msg: 'Select module record first.',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.WARNING
                                        });
                                    }


                                });
                            }

                        }],
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [modulesSetupSelectModel, {
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
                            header: "Module Code",
                            width: 70,
                            sortable: true,
                            dataIndex: 'moduleCode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Module Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'moduleName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }], listeners: {
                        cellclick: function (grd, rowIndex, colIndex, e) {
                            var record = grd.getStore().getAt(rowIndex);
                            console.log('Type::' + record.get('moduleName'));
                            moduleUsersStore.load({
                                params: {
                                    _csrf: csrfToken,
                                    moduleName: record.get('moduleName')
                                }
                            });
                        }
                    },
                    stripeRows: true
                }), new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 280,
                    minSize: 100,
                    maxSize: 400,
                    collapsible: true,
                    title: 'Users',
                    tools: tools,
                    margins: '0 5 0 0',
                    store: moduleUsersStore,
                    id: 'modules-users-grid',
                    closable: true,
                    sm: moduleUsersSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [moduleUsersSelectModel, {
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
                            header: "Username",
                            width: 70,
                            sortable: true,
                            dataIndex: 'userName',
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
                            header: "E-mail",
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
                        }],
                    stripeRows: true
                })]
        }],
    autoDestroy: false
}

);



Ext.getCmp('modules-setup-grid').on('celldblclick', function (grid, rindx, cindx, e) {
    var moduleName = grid.getStore().getAt(rindx).get('moduleName');
    requirejs([contextpath + "/static/ext/app/finance-main/layouts/modules-manager-window.js"], function () {
        showModuleSettingsWindow(moduleName);
    });
});


