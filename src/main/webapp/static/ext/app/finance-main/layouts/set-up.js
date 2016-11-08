/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var postalCodesStore = new Ext.data.JsonStore({
    id: 'postal-codes-store-id',
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


var townCodesStore = new Ext.data.JsonStore({
    id: 'town-codes-store-id',
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

var legalTypeStore = new Ext.data.JsonStore({
    id: 'legal-type-store-id',
    storeId: 'legal-type-store-id',
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


var sitesStore = new Ext.data.JsonStore({
    id: 'sites-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/site/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'registeredName', 'occupationType', 'accessType', 'dateOccupied', 'structureType']

});


postalCodesStore.load({
    params: {
        _csrf: csrfToken
    }
});

townCodesStore.load({
    params: {
        _csrf: csrfToken
    }
});

legalTypeStore.load({
    params: {
        _csrf: csrfToken
    }
});


smeEntitySiteStore.load({
    params: {
        _csrf: csrfToken
    }
});

sitesStore.load({
    params: {
        _csrf: csrfToken
    }
});

branchesStore.load({
    params: {
        _csrf: csrfToken,
        entityId: entityId
    }
});


leaseTypeStore.load();

var postalCodesSelectModel = new Ext.grid.CheckboxSelectionModel();
var townCodesSelectModel = new Ext.grid.CheckboxSelectionModel();
var legalTypeSelectModel = new Ext.grid.CheckboxSelectionModel();

var setupLayout = new Ext.TabPanel({
    activeTab: 0,
    plain: true,
    id: 'setup-center-panel',
    defaults: {
        autoScroll: true
    },
    items: [{
            layout: 'border',
            title: 'Postal Codes setup',
            items: [{
                    // lazily created panel (xtype:'panel' is default)
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Postal codes',
                    margins: '0 5 0 0'
                }, new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Postal codes',
                    margins: '0 5 0 0',
                    store: postalCodesStore,
                    id: 'postal-codes-grid',
                    closable: true,
                    sm: postalCodesSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [postalCodesSelectModel, {
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
                            header: "Post Code",
                            width: 70,
                            sortable: true,
                            dataIndex: 'postCode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Code Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'codeName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Created On",
                            width: 70,
                            sortable: true,
                            dataIndex: 'createdAt',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Is Active",
                            width: 70,
                            sortable: true,
                            dataIndex: 'isActive',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }), new Ext.FormPanel({
                    labelWidth: 75, // label settings here cascade unless overridden
                    url: contextpath + '/postal/code-save.action?_csrf=' + csrfToken,
                    frame: true,
                    id: 'postal-codes-form',
                    bodyStyle: 'padding:5px 5px 0',
                    defaults: {
                        width: 300
                    },
                    defaultType: 'textfield',
                    region: 'center',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Codes',
                            collapsible: true,
                            width: '95%',
                            autoHeight: true,
                            defaults: {
                                anchor: '60%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Post Code',
                                    name: 'postCode'
                                }, {
                                    fieldLabel: 'Code Name',
                                    name: 'codeName'
                                }, {
                                    fieldLabel: 'Created On',
                                    name: 'createdAt',
                                    xtype: 'datefield'
                                }, {
                                    checked: true,
                                    fieldLabel: 'Enabled',
                                    xtype: 'checkbox',
                                    labelSeparator: '',
                                    boxLabel: 'Is Active',
                                    name: 'isActive'
                                }]
                        }],
                    buttons: [{
                            text: 'Save',
                            iconCls: 'silk-save',
                            handler: function () {
                                var form = Ext.getCmp('postal-codes-form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        success: function (obj, resp) {
                                            var json = JSON.parse(resp.response.responseText);
                                            Ext.Msg.alert('Server Response', json.msg);
                                            postalCodesStore.load({
                                                params: {
                                                    _csrf: csrfToken
                                                }
                                            });
                                        }, failure: function (obj, resp) {

                                        }
                                    });
                                }
                            }
                        }, {
                            text: 'Cancel',
                            iconCls: 'silk-application-delete',
                        }]
                })]
        }, {
            layout: 'border',
            title: 'Town Codes setup',
            items: [new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Town codes',
                    margins: '0 5 0 0',
                    store: townCodesStore,
                    id: 'town-codes-grid',
                    closable: true,
                    sm: townCodesSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [townCodesSelectModel, {
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
                            header: "Town Code",
                            width: 70,
                            sortable: true,
                            dataIndex: 'townCode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Town Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'townName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }), new Ext.FormPanel({
                    labelWidth: 75, // label settings here cascade unless overridden
                    url: contextpath + '/town/code-save.action?_csrf=' + csrfToken,
                    frame: true,
                    id: 'town-codes-form',
                    method: 'POST',
                    bodyStyle: 'padding:5px 5px 0',
                    defaults: {
                        width: 300
                    },
                    defaultType: 'textfield',
                    region: 'center',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Codes',
                            collapsible: true,
                            width: '95%',
                            autoHeight: true,
                            defaults: {
                                anchor: '60%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Town Code',
                                    name: 'townCode'
                                }, {
                                    fieldLabel: 'Town Name',
                                    name: 'townName'
                                }]
                        }],
                    buttons: [{
                            text: 'Save',
                            iconCls: 'silk-save',
                            handler: function () {
                                var form = Ext.getCmp('town-codes-form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        success: function (obj, resp) {
                                            var json = JSON.parse(resp.response.responseText);

                                            Ext.MessageBox.show({
                                                title: 'Server Response',
                                                msg: json.msg,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO
                                            });

                                            townCodesStore.load({
                                                params: {
                                                    _csrf: csrfToken
                                                }
                                            });
                                        }, failure: function (obj, resp) {

                                        }
                                    });
                                }
                            }
                        }, {
                            text: 'Cancel',
                            iconCls: 'silk-application-delete'
                        }]
                })]
        }, {
            layout: 'border',
            title: 'Legal Types setup',
            items: [new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Legal Types',
                    margins: '0 5 0 0',
                    store: legalTypeStore,
                    id: 'legal-types-grid',
                    closable: true,
                    sm: legalTypeSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [legalTypeSelectModel, {
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
                            header: "Access Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'accessName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Created On",
                            width: 70,
                            sortable: true,
                            dataIndex: 'createdAt',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Is Active",
                            width: 70,
                            sortable: true,
                            dataIndex: 'isActive',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }), new Ext.FormPanel({
                    labelWidth: 75, // label settings here cascade unless overridden
                    url: contextpath + '/legal/type-save.action?_csrf=' + csrfToken,
                    frame: true,
                    id: 'legal-types-form',
                    method: 'POST',
                    bodyStyle: 'padding:5px 5px 0',
                    defaults: {
                        width: 300
                    },
                    defaultType: 'textfield',
                    region: 'center',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Types',
                            collapsible: true,
                            width: '95%',
                            autoHeight: true,
                            defaults: {
                                anchor: '60%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Access Name',
                                    name: 'accessName'
                                }, {
                                    fieldLabel: 'Created On',
                                    name: 'createdAt',
                                    xtype: 'datefield'
                                }, {
                                    checked: true,
                                    fieldLabel: 'Enabled',
                                    xtype: 'checkbox',
                                    labelSeparator: '',
                                    boxLabel: 'Is Active',
                                    name: 'isActive'
                                }]
                        }],
                    buttons: [{
                            text: 'Save',
                            iconCls: 'silk-save',
                            handler: function () {
                                var form = Ext.getCmp('legal-types-form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        success: function (obj, resp) {
                                            var json = JSON.parse(resp.response.responseText);

                                            Ext.MessageBox.show({
                                                title: 'Server Response',
                                                msg: json.msg,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO
                                            });

                                            legalTypeStore.load({
                                                params: {
                                                    _csrf: csrfToken
                                                }
                                            });
                                        }, failure: function (obj, resp) {

                                        }
                                    });
                                }
                            }
                        }, {
                            text: 'Cancel',
                            iconCls: 'silk-application-delete'
                        }]
                })]
        }],
    autoDestroy: false
}

);


var sitesSelectModel = new Ext.grid.CheckboxSelectionModel();

var sitePanel = new Ext.TabPanel({
    activeTab: 0,
    plain: true,
    id: 'site-panel',
    defaults: {
        autoScroll: true
    },
    items: [{
            layout: 'border',
            title: 'Site setup',
            items: [{
                    // lazily created panel (xtype:'panel' is default)
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Site setup',
                    margins: '0 5 0 0'
                }, new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 200,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'SME Site',
                    margins: '0 5 0 0',
                    store: sitesStore,
                    id: 'sites-grid',
                    closable: true,
                    sm: sitesSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [sitesSelectModel, {
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
                            header: "Registered Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'registeredName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Access Type",
                            width: 70,
                            sortable: true,
                            dataIndex: 'accessType',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Date Occupied",
                            width: 70,
                            sortable: true,
                            dataIndex: 'dateOccupied',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Structure Type",
                            width: 70,
                            sortable: true,
                            dataIndex: 'structureType',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Phone Number",
                            width: 70,
                            sortable: true,
                            dataIndex: 'phoneNumber',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }), new Ext.FormPanel({
                    labelWidth: 100, // label settings here cascade unless overridden
                    url: contextpath + '/site/save.action?_csrf=' + csrfToken,
                    method: 'POST',
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    id: 'site2-panel',
                    region: 'center',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Site Info',
                            collapsible: true,
                            autoHeight: true,
                            defaults: {
                                anchor: '50%',
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Structure Type',
                                    name: 'structureType'
                                }, {
                                    fieldLabel: 'Access Type',
                                    name: 'accessType'
                                }, {
                                    fieldLabel: 'Date Occupied',
                                    name: 'dateOccupied',
                                    anchor: '50%',
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'Occupation Type',
                                    name: 'occupationType'
                                }, {
                                    fieldLabel: 'Floor Size',
                                    name: 'floorSize'
                                }, new Ext.form.ComboBox({
                                    store: postalCodesStore,
                                    fieldLabel: 'Post Code',
                                    displayField: 'postCode',
                                    typeAhead: true,
                                    name: 'postCode',
                                    mode: 'local',
                                    anchor: '50%',
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select a Post Code...',
                                    selectOnFocus: true
                                }), new Ext.form.ComboBox({
                                    store: townCodesStore,
                                    fieldLabel: 'Town Code',
                                    displayField: 'townCode',
                                    typeAhead: true,
                                    name: 'townCode',
                                    mode: 'local',
                                    anchor: '50%',
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select Town Code ...',
                                    selectOnFocus: true
                                }), {
                                    fieldLabel: 'Post Number',
                                    name: 'postNumber'
                                }, {
                                    fieldLabel: 'ID',
                                    name: 'id',
                                    hidden: true
                                }, {
                                    fieldLabel: 'Phone Number',
                                    name: 'phoneNumber'
                                }, {
                                    fieldLabel: 'Email Address',
                                    name: 'emailAddress'
                                }, new Ext.form.ComboBox({
                                    store: smeEntitySiteStore,
                                    fieldLabel: 'Entity Name',
                                    displayField: 'registeredName',
                                    typeAhead: true,
                                    name: 'registeredName',
                                    mode: 'local',
                                    anchor: '50%',
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select a Entity...',
                                    selectOnFocus: true
                                })],
                            buttons: [{
                                    text: 'Save',
                                    iconCls: 'silk-save',
                                    handler: function () {
                                        var form = Ext.getCmp('site2-panel').getForm();
                                        console.log('getting form ...')
                                        if (form.isValid()) {
                                            console.log('form valid ...')
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
                                                    sitesStore.load({
                                                        params: {
                                                            _csrf: csrfToken
                                                        }
                                                    });
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
                                }]
                        }]
                })]
        }],
    autoDestroy: false
}

);




var branchesSelectModel = new Ext.grid.CheckboxSelectionModel();

var branchPanel = new Ext.TabPanel({
    activeTab: 0,
    plain: true,
    id: 'branch-panel',
    defaults: {
        autoScroll: true
    },
    items: [{
            layout: 'border',
            title: 'Branch setup',
            items: [{
                    // lazily created panel (xtype:'panel' is default)
                    region: 'south',
                    split: true,
                    height: 300,
                    minSize: 200,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Branch setup',
                    margins: '0 5 0 0'
                }, new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 300,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'SME Branch',
                    margins: '0 5 0 0',
                    store: branchesStore,
                    id: 'branches-grid',
                    closable: true,
                    sm: branchesSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [branchesSelectModel, {
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
                            header: "Branch Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'branchName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Access Type",
                            width: 70,
                            sortable: true,
                            dataIndex: 'accessType',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Access Type",
                            width: 70,
                            sortable: true,
                            dataIndex: 'accessType',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Branch Code",
                            width: 70,
                            sortable: true,
                            dataIndex: 'branchCode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Email Address",
                            width: 70,
                            sortable: true,
                            dataIndex: 'emailAddress',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Created On",
                            width: 70,
                            sortable: true,
                            dataIndex: 'createdAt',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }), new Ext.FormPanel({
                    // specify it
                    fileUpload: true,
                    id: 'branch-form-panel',
                    labelWidth: 100,
                    url: contextpath + '/branch/save.action?_csrf=' + csrfToken,
                    method: 'POST',
                    bodyStyle: 'padding:5px 5px 0',
                    width: 350,
                    region: 'center',
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
                                            title: 'Branch Information',
                                            autoHeight: true,
                                            bodyStyle: 'padding:5px 5px 0',
                                            defaults: {
                                                anchor: '95%'
                                            },
                                            defaultType: 'textfield',
                                            items: [
                                                {
                                                    fieldLabel: 'Id',
                                                    name: 'id',
                                                    hidden: true
                                                },{
                                                    fieldLabel: 'Branch Name',
                                                    name: 'branchName'
                                                }, {
                                                    fieldLabel: 'Branch Code',
                                                    name: 'branchCode'
                                                }, {
                                                    fieldLabel: 'Structure Type',
                                                    name: 'structureType'
                                                }, {
                                                    fieldLabel: 'Access Type',
                                                    name: 'accessType'
                                                }, {
                                                    fieldLabel: 'Created On',
                                                    name: 'createdAt',
                                                    xtype: 'datefield'
                                                }, new Ext.form.ComboBox({
                                                    store: leaseTypeStore,
                                                    fieldLabel: 'Lease Name',
                                                    id: 'leasetype-branches-combo',
                                                    displayField: 'leaseTypeName',
                                                    typeAhead: true,
                                                    name: 'leaseTypeName',
                                                    mode: 'local',
                                                    anchor: '50%',
                                                    forceSelection: true,
                                                    triggerAction: 'all',
                                                    emptyText: 'Select a Lease...',
                                                    selectOnFocus: true
                                                }), {
                                                    fieldLabel: 'Street Name',
                                                    name: 'streetName'
                                                }, {
                                                    fieldLabel: 'Store Number',
                                                    name: 'storeNumber'
                                                }
                                            ]
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
                                                    fieldLabel: 'Building LR',
                                                    name: 'buildingLrNumber'
                                                }, {
                                                    fieldLabel: 'Floor Size',
                                                    name: 'floorSize'
                                                }, new Ext.form.ComboBox({
                                                    store: postalCodesStore,
                                                    fieldLabel: 'Post Code',
                                                    displayField: 'postCode',
                                                    typeAhead: true,
                                                    name: 'postCode',
                                                    mode: 'local',
                                                    anchor: '50%',
                                                    forceSelection: true,
                                                    triggerAction: 'all',
                                                    emptyText: 'Select a Post Code...',
                                                    selectOnFocus: true
                                                }), new Ext.form.ComboBox({
                                                    store: townCodesStore,
                                                    fieldLabel: 'Town Code',
                                                    displayField: 'townCode',
                                                    typeAhead: true,
                                                    name: 'townCode',
                                                    mode: 'local',
                                                    anchor: '50%',
                                                    forceSelection: true,
                                                    triggerAction: 'all',
                                                    emptyText: 'Select Town Code ...',
                                                    selectOnFocus: true
                                                }), {
                                                    fieldLabel: 'Postal Number',
                                                    name: 'postalNumber'
                                                }, {
                                                    fieldLabel: 'Email Address',
                                                    name: 'emailAddress'
                                                }, new Ext.form.ComboBox({
                                                    store: smeEntitySiteStore,
                                                    fieldLabel: 'Entity Name',
                                                    displayField: 'registeredName',
                                                    typeAhead: true,
                                                    name: 'registeredName',
                                                    mode: 'local',
                                                    anchor: '50%',
                                                    forceSelection: true,
                                                    triggerAction: 'all',
                                                    emptyText: 'Select a Entity...',
                                                    selectOnFocus: true
                                                })]}], buttons: [{
                                            text: 'Save',
                                            handler: function () {
                                                var form = Ext.getCmp('branch-form-panel').getForm();
                                                console.log('getting form ...')
                                                if (form.isValid()) {
                                                    console.log('form valid ...')
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
                                                            branchesStore.load({
                                                                params: {
                                                                    _csrf: csrfToken
                                                                }
                                                            });
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
                                            text: 'Cancel'
                                        }]

                                }
                            ]
                        }
                    ]
                }
                )]
        }],
    autoDestroy: false
}

);



Ext.getCmp('branches-grid').on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    Ext.getCmp('branch-form-panel').getForm().load({
        url: contextpath + '/branch/formview.action',
        params: {
            id: id,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });

});


Ext.getCmp('sites-grid').on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    Ext.getCmp('site2-panel').getForm().load({
        url: contextpath + '/site/formview.action',
        params: {
            id: id,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });

});