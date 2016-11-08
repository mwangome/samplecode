/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * ================  TabPanel with nested layouts  =======================
 */
// fake grid data used below in the tabsNestedLayouts config
var myData = [
    ['3m Co', 71.72, 0.02, 0.03, '9/1 12:00am'],
    ['Alcoa Inc', 29.01, 0.42, 1.47, '9/1 12:00am'],
    ['Altria Group Inc', 83.81, 0.28, 0.34, '9/1 12:00am'],
    ['American Express Company', 52.55, 0.01, 0.02, '9/1 12:00am'],
    ['American International Group, Inc.', 64.13, 0.31, 0.49, '9/1 12:00am'],
    ['AT&T Inc.', 31.61, -0.48, -1.54, '9/1 12:00am'],
    ['Boeing Co.', 75.43, 0.53, 0.71, '9/1 12:00am'],
    ['Caterpillar Inc.', 67.27, 0.92, 1.39, '9/1 12:00am'],
    ['Citigroup, Inc.', 49.37, 0.02, 0.04, '9/1 12:00am'],
    ['E.I. du Pont de Nemours and Company', 40.48, 0.51, 1.28, '9/1 12:00am'],
    ['Exxon Mobil Corp', 68.1, -0.43, -0.64, '9/1 12:00am'],
    ['General Electric Company', 34.14, -0.08, -0.23, '9/1 12:00am'],
    ['General Motors Corporation', 30.27, 1.09, 3.74, '9/1 12:00am'],
    ['Hewlett-Packard Co.', 36.53, -0.03, -0.08, '9/1 12:00am'],
    ['Honeywell Intl Inc', 38.77, 0.05, 0.13, '9/1 12:00am'],
    ['Intel Corporation', 19.88, 0.31, 1.58, '9/1 12:00am'],
    ['International Business Machines', 81.41, 0.44, 0.54, '9/1 12:00am'],
    ['Johnson & Johnson', 64.72, 0.06, 0.09, '9/1 12:00am'],
    ['JP Morgan & Chase & Co', 45.73, 0.07, 0.15, '9/1 12:00am'],
    ['McDonald\'s Corporation', 36.76, 0.86, 2.40, '9/1 12:00am'],
    ['Merck & Co., Inc.', 40.96, 0.41, 1.01, '9/1 12:00am'],
    ['Microsoft Corporation', 25.84, 0.14, 0.54, '9/1 12:00am'],
    ['Pfizer Inc', 27.96, 0.4, 1.45, '9/1 12:00am'],
    ['The Coca-Cola Company', 45.07, 0.26, 0.58, '9/1 12:00am'],
    ['The Home Depot, Inc.', 34.64, 0.35, 1.02, '9/1 12:00am'],
    ['The Procter & Gamble Company', 61.91, 0.01, 0.02, '9/1 12:00am'],
    ['United Technologies Corporation', 63.26, 0.55, 0.88, '9/1 12:00am'],
    ['Verizon Communications', 35.57, 0.39, 1.11, '9/1 12:00am'],
    ['Wal-Mart Stores, Inc.', 45.45, 0.73, 1.63, '9/1 12:00am']
];


var storeInsitute = new Ext.data.JsonStore({
    url: contextpath + '/form/getinstitute.action',
    root: 'data',
    baseParams: {
        _csrf: csrfToken
    },
    fields: ['id', 'name', 'town', 'email', 'postalAddress', 'website',
        'telephone']
});

var legalTypeStore2 = new Ext.data.JsonStore({
    id: 'legal-type-store-id2',
    storeId: 'legal-type-store-id2',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/legal/typeview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'accessName', 'createdAt', 'isActive']

});

var townCodeStore2 = new Ext.data.JsonStore({
    id: 'town-codes-store-id2',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/town/codeview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'townCode', 'townName']

});


var postalCodesStore2 = new Ext.data.JsonStore({
    id: 'postal-codes-store-id2',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/postal/codeview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'codeName', 'postCode', 'isActive', 'createdAt']

});

var msg = function (title, msg) {
    Ext.Msg.show({
        title: title,
        msg: msg,
        minWidth: 200,
        modal: true,
        icon: Ext.Msg.INFO,
        buttons: Ext.Msg.OK
    });
};


var fp = new Ext.FormPanel({
    fileUpload: true,
    width: 550,
    height: 150,
    frame: true,
    autoHeight: true,
    bodyStyle: 'padding: 10px 10px 0 10px;',
    labelWidth: 50,
    defaults: {
        anchor: '95%',
        allowBlank: false,
        msgTarget: 'side'
    },
    items: [{
            xtype: 'hidden',
            name: csrf,
            value: csrfToken,
            id: 'csrfToken'
        }, {
            xtype: 'textfield',
            fieldLabel: 'Upload Name',
            name: 'name'
        }, {
            xtype: 'datefield',
            fieldLabel: 'Upload Date',
            name: 'depositDate',
            id: 'depositDate',
            anchor: '95%'
        }, {
            xtype: 'fileuploadfield',
            id: 'form-file',
            emptyText: 'Select an xls file',
            fieldLabel: 'Excel File',
            name: 'file',
            anchor: '95%',
            buttonCfg: {
                iconCls: 'upload-icon'
            },
            buttonText: ''
        }],
    buttons: [{
            text: 'Save',
            handler: function () {
                if (fp.getForm().isValid()) {
                    fp.getForm().submit({
                        url: contextpath + '/savefile?&_csrf=' + csrfToken,
                        waitMsg: 'Uploading students...',
                        success: function (fp, o) {
                            msg('Success', 'Processed file "' + o.result.file + '" on the server');
                        }
                    });
                }
            }
        }, {
            text: 'Reset',
            handler: function () {
                fp.getForm().reset();
            }
        }]
});

var tabsNestedLayoutsLegacy = new Ext.FormPanel({
    // specify it
    fileUpload: true,
    id: 'tabs-nested-layouts-panelLegacy',
    labelWidth: 125,
    url: contextpath + '/entity/save.action?&_csrf=' + csrfToken,
    method: 'POST',
    title: 'SME details',
    bodyStyle: 'padding:5px 5px 0',
    width: 350,
    labelPad: 125,
    frame: true,
    items: [
        {
            layout: 'column',
            border: false,
            items: [
                {
                    autoHeight: true,
                    columnWidth: .5,
                    layout: 'form',
                    defaultType: 'textfield',
                    bodyStyle: 'padding:5px 5px 0',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Organization Details',
                            bodyStyle: 'padding:5px 5px 0',
                            height: 261,
                            defaults: {
                                anchor: '95%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Registered Name',
                                    name: 'registeredName'
                                }, {
                                    fieldLabel: 'Trading Name',
                                    name: 'tradingName'
                                }, {
                                    fieldLabel: 'Created On',
                                    name: 'createdAtDisplayed',
                                    format: 'd-m-Y',
                                    id: 'createdAtDisplayed',
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'Date Registered',
                                    name: 'regDateDisplayed',
                                    id: 'regDateDisplayed',
                                    format: 'd-m-Y',
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'Created On',
                                    name: 'createdAt',
                                    hidden: true,
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'ID',
                                    name: 'id',
                                    hidden: true
                                }, {
                                    fieldLabel: 'Date Registered',
                                    name: 'regDate',
                                    hidden: true,
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'Reg Number',
                                    name: 'regNumber'
                                }, new Ext.form.ComboBox({
                                    store: legalTypeStore2,
                                    fieldLabel: 'Legal Type',
                                    displayField: 'accessName',
                                    typeAhead: true,
                                    name: 'accessName',
                                    mode: 'local',
                                    width: 230,
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select Legal Type ...',
                                    selectOnFocus: true
                                }), {
                                    fieldLabel: 'Logo',
                                    xtype: 'fileuploadfield',
                                    id: 'file',
                                    emptyText: 'Select an image file',
                                    name: 'file',
                                    anchor: '95%',
                                    buttonCfg: {
                                        iconCls: 'upload-icon'
                                    },
                                    buttonText: ''
                                }, {
                                    checked: true,
                                    fieldLabel: 'Enabled',
                                    xtype: 'checkbox',
                                    labelSeparator: '',
                                    boxLabel: 'Entity',
                                    name: 'enabled'
                                }]
                        }]
                }, {
                    columnWidth: .5,
                    bodyStyle: 'padding:5px 5px 0',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Contact Information',
                            autoHeight: true,
                            bodyStyle: 'padding:5px 5px 0',
                            defaults: {
                                anchor: '95%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Physical Address',
                                    name: 'physicalAddress'
                                }, {
                                    fieldLabel: 'Building LR',
                                    name: 'buildingLr'
                                }, {
                                    fieldLabel: 'Floor Number',
                                    name: 'floorNumber'
                                }, {
                                    fieldLabel: 'Street Name',
                                    name: 'streetName'
                                }, new Ext.form.ComboBox({
                                    store: townCodeStore2,
                                    fieldLabel: 'Town Code',
                                    displayField: 'townCode',
                                    typeAhead: true,
                                    name: 'townCode',
                                    mode: 'local',
                                    width: 230,
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select Town Code ...',
                                    selectOnFocus: true
                                }), new Ext.form.ComboBox({
                                    store: postalCodesStore2,
                                    fieldLabel: 'Post Code',
                                    displayField: 'postCode',
                                    typeAhead: true,
                                    name: 'postCode',
                                    mode: 'local',
                                    width: 230,
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select a Post Code...',
                                    selectOnFocus: true
                                }), {
                                    fieldLabel: 'Post Number',
                                    name: 'postNumber'
                                }, {
                                    fieldLabel: 'Email Address',
                                    name: 'emailAddress',
                                    vtype: 'email'
                                }, {
                                    fieldLabel: 'Phone Number',
                                    name: 'phoneNumber'
                                }, {
                                    fieldLabel: 'Legal Type',
                                    hidden: true,
                                    name: 'legalType'
                                }]
                        }
                    ],
                    buttons: [{
                            text: 'Save/Update',
                            iconCls: 'silk-save',
                            handler: function () {
                                var form = Ext.getCmp('tabs-nested-layouts-panel').getForm();
                                form.findField('createdAt').setValue(form.findField('createdAtDisplayed').getValue().format('m-d-Y'));
                                form.findField('regDate').setValue(form.findField('regDateDisplayed').getValue().format('m-d-Y'));
                                form.findField('legalType').setValue(form.findField('accessName').getValue());
                                if (form.isValid()) {
                                    form.submit({
                                        success: function (response, obj) {
                                            var res = Ext.decode(obj.response.responseText);
                                            Ext.Msg.show({
                                                title: 'Success',
                                                msg: res.msg,
                                                icon: Ext.Msg.INFO,
                                                buttons: Ext.Msg.OK
                                            }


                                            );
                                        }, failure: function (response, obj) {
                                            console.log(obj);
                                            var res = obj.response.responseText;
                                            try {
                                                res = Ext.decode(obj.response.responseText);
                                            } catch (e) {
                                                console.log(e)
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
                                    }

                                    );
                                } else {
                                    Ext.Msg.alert(
                                            'Alert',
                                            'Fill in correct and complete information before you submit.'
                                            );
                                }
                            }
                        }, {
                            text: 'Cancel',
                            iconCls:'silk-application-delete'
                        }]
                }
            ]
        }
    ]

});







/*
 * ================  Absolute Layout Form  =======================
 */
var storeNssf = new Ext.data.ArrayStore({
    fields: ['nssf'],
    data: [
        ['NEW_NSSF'],
        ['OLD_NSSF']
    ] // from states.js
});

var comboNssf = new Ext.form.ComboBox({
    store: storeNssf,
    fieldLabel: 'Nssf',
    displayField: 'nssf',
    typeAhead: true,
    name: 'nssfType',
    mode: 'local',
    width: 230,
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select a nssf...',
    selectOnFocus: true
});
var absform = new Ext.form.FormPanel({
    baseCls: 'x-plain',
    layout: 'form',
    url: contextpath + '/fina/savetax.action',
    border: true,
    defaultType: 'textfield',
    id: 'tax-forms',
    items: [{
            fieldLabel: 'csrf',
            name: '_csrf',
            value: csrfToken,
            hidden: true,
            width: 230
        }, comboNssf, {
            fieldLabel: 'NSSF Charges',
            name: 'fees',
            width: 230
        }]
});

var absoluteForm = {
    title: 'Tax Settings',
    id: 'abs-form-panel',
    bodyStyle: 'padding:15px;',
    items: [
        {
            layout: 'form',
            defaultType: 'textfield',
            border: false,
            url: contextpath + '/fina/savetax.action',
            method: 'POST',
            labelPad: 100,
            labelWidth: 100,
            items: absform,
            buttonAlign: 'left',
            buttons: [
                {
                    text: 'Save',
                    handler: function () {
                        var form = Ext.getCmp('tax-forms').getForm();
                        console.log(form.getValues())
                        if (form.isValid()) {
                            form.submit({
                                success: function (opts, response) {
                                    var resp = response.response;
                                    var mes = Ext.decode(resp.responseText);
                                    Ext.Msg.show({
                                        title: 'Success',
                                        msg: mes.msg,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.Msg.INFO
                                    })
                                }, failure: function (opts, response) {
                                    console.log(response);
                                }
                            }


                            );
                        } else {
                            Ext.Msg.show({
                                title: 'Entries Incomplete',
                                msg: 'Fill in all details then try again!',
                                buttons: Ext.Msg.OK,
                                icons: Ext.msg.WARNING
                            })
                        }
                    }
                }
            ]
        }
    ]

};

var systemUsersStore = new Ext.data.JsonStore({
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



var rolesStore = new Ext.data.JsonStore({
    id: 'roles-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/user/individualroles.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'task', 'type']

});

systemUsersStore.load({
    params: {
        _csrf: csrfToken
    }
});

rolesStore.load({
    params: {
        _csrf: csrfToken
    }
});

legalTypeStore2.load({
    params: {
        _csrf: csrfToken
    }
});

townCodeStore2.load({
    params: {
        _csrf: csrfToken
    }
});

postalCodesStore2.load({
    params: {
        _csrf: csrfToken
    }
});

var comboLegalTypes = new Ext.form.ComboBox({
    store: legalTypeStore2,
    fieldLabel: 'Legal Type',
    displayField: 'accessName',
    typeAhead: true,
    name: 'accessName',
    mode: 'local',
    width: 230,
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select Legal Type ...',
    selectOnFocus: true
});

var systemUsersSelectModel = new Ext.grid.CheckboxSelectionModel();

var rolesSelectModel = new Ext.grid.CheckboxSelectionModel();

var userManagerLayout = new Ext.TabPanel({
    activeTab: 0,
    title: 'Users Operations',
    plain: true,
    id: 'manage-users-center-panel',
    defaults: {
        autoScroll: true
    },
    items: {
        title: 'Manage Users',
        layout: 'border',
        items: [{
                region: 'south',
                title: 'Roles',
                collapsible: true,
                split: true,
                width: 225, // give east and west regions a width
                minSize: 175,
                maxSize: 400,
                height: 200,
                margins: '0 5 0 0',
                layout: 'fit', // specify layout manager for items
                items: // this TabPanel is wrapped by another Panel so the title will be applied
                        new Ext.TabPanel({
                            border: false, // already wrapped so don't add another border
                            activeTab: 0, // second tab initially active
                            tabPosition: 'bottom',
                            items: [new Ext.grid.GridPanel({
                                    title: 'User Roles',
                                    store: rolesStore,
                                    id: 'roles-grid',
                                    closable: true,
                                    sm: rolesSelectModel,
                                    viewConfig: {
                                        forceFit: true
                                    },
                                    columns: [rolesSelectModel, {
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
                                            header: "Task",
                                            width: 70,
                                            sortable: true,
                                            dataIndex: 'task',
                                            editor: {
                                                xtype: 'textfield',
                                                allowBlank: false
                                            }
                                        }, {
                                            header: "Type",
                                            width: 70,
                                            sortable: true,
                                            dataIndex: 'type',
                                            editor: {
                                                xtype: 'textfield',
                                                allowBlank: false
                                            }
                                        }],
                                    stripeRows: true
                                })]
                        })
            }, new Ext.grid.GridPanel(
                    {
                        store: systemUsersStore,
                        region: 'center',
                        height: 200,
                        minSize: 75,
                        maxSize: 250,
                        id: 'system-users-grid',
                        sm: systemUsersSelectModel,
                        viewConfig: {
                            forceFit: true
                        }, listeners: {
                            cellclick: function (grd, rowIndex, colIndex, e) {
                                var record = grd.getStore().getAt(rowIndex);
                                console.log('Type::' + record.get('role'));
                                rolesStore.load({
                                    params: {
                                        _csrf: csrfToken,
                                        role: record.get('role')
                                    }
                                });
                            }
                        },
                        loadMask: true,
                        stripeRows: true,
                        // bbar : pagingBar,
                        tbar: [
                            {
                                xtype: 'button',
                                text: 'Add User',
                                iconCls: 'member',
                                handler: function () {
                                    requirejs(
                                            [contextpath
                                                        + '/static/ext/app/finance-main/layouts/add-user.js'],
                                            function () {
                                                addUserWindow();
                                            }

                                    )
                                }

                            }],
                        columns: [systemUsersSelectModel, {
                                header: "Id",
                                width: 150,
                                sortable: true,
                                dataIndex: 'id',
                                hidden: true,
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
                                header: "Role",
                                width: 70,
                                sortable: true,
                                dataIndex: 'role',
                                editor: {
                                    xtype: 'textfield',
                                    allowBlank: false
                                }
                            }, {
                                header: "Last Name",
                                width: 150,
                                sortable: true,
                                dataIndex: 'lastName',
                                editor: {
                                    xtype: 'textfield',
                                    allowBlank: false
                                }
                            }, {
                                header: "Email",
                                width: 150,
                                sortable: true,
                                dataIndex: 'email',
                                editor: {
                                    xtype: 'textfield',
                                    allowBlank: false
                                }
                            }, {
                                header: "State",
                                width: 150,
                                sortable: true,
                                dataIndex: 'state',
                                editor: {
                                    xtype: 'textfield',
                                    allowBlank: false
                                }
                            }

                        ],
                        bbar: new Ext.PagingToolbar({
                            pageSize: 25,
                            store: systemUsersStore,
                            method: 'get',
                            displayInfo: true,
                            displayMsg: 'Displaying user(s) {0} - {1} of {2}',
                            emptyMsg: "No user(s) found"
                        })
                    })]
    },
    autoDestroy: false
}

);


Ext.getCmp('system-users-grid').on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    requirejs(
            [contextpath
                        + '/static/ext/app/finance-main/layouts/add-user.js'],
            function () {
                addUserWindow(id);
            }

    );
});



function getSelectedUserRecord() {
    var recModel = Ext.getCmp('system-users-grid').getSelectionModel();
    if (recModel.hasSelection()) {
        return recModel.getSelected();
    } else {
        Ext.MessageBox.show({
            title: 'Select',
            msg: 'Select user record first.',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
    }

    return undefined;
}