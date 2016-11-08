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

var banksStore = new Ext.data.JsonStore({
    id: 'banks-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/banks/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'bankCode', 'bankName', 'bankTownId', 'postalCode', 'postalNumber', 'createdAt', 'createdBy']

});


var bankBranchesStore = new Ext.data.JsonStore({
    id: 'bank-branches-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/bank-branches/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'branchCode', 'branchkName', 'bankTownId', 'postalCode', 'postalNumber', 'createdAt', 'building', 'street']

});

var currenciesStore = new Ext.data.JsonStore({
    id: 'currencies-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/currencies/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'currencyCode', 'currencyName', 'createdAt', 'isActive']

});


banksStore.load({
    params: {
        _csrf: csrfToken
    }
});

currenciesStore.load({
    params: {
        _csrf: csrfToken
    }
});

bankBranchesStore.load({
    params: {
        _csrf: csrfToken
    }
});

var banksSelectModel = new Ext.grid.CheckboxSelectionModel();

var bankBranchesSelectModel = new Ext.grid.CheckboxSelectionModel();

var currenciesSelectModel = new Ext.grid.CheckboxSelectionModel();

var bankCurrencyPanel = new Ext.TabPanel({
    activeTab: 0,
    plain: true,
    id: 'bank-currency-panel',
    defaults: {
        autoScroll: true
    },
    items: [{
            layout: 'border',
            title: 'Banks setup',
            items: [{
                    // lazily created panel (xtype:'panel' is default)
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Banks setup',
                    margins: '0 5 0 0'
                }, new Ext.grid.GridPanel({
                    region: 'center',
                    split: true,
                    height: 330,
                    minSize: 100,
                    maxSize: 400,
                    collapsible: true,
                    title: 'Banks',
                    tools: tools,
                    margins: '0 5 0 0',
                    store: banksStore,
                    id: 'banks-grid',
                    closable: true,
                    sm: banksSelectModel,
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Add Bank',
                            iconCls: 'silk-comment-add',
                            handler: function () {
                                //addLineOfBusinessWindow();
                                addBanksWindow();
                            }

                        }],
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [banksSelectModel, {
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
                            header: "Bank Code",
                            width: 70,
                            sortable: true,
                            dataIndex: 'bankCode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Bank Town ID",
                            width: 70,
                            sortable: true,
                            dataIndex: 'bankTownId',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Postal Code",
                            width: 70,
                            sortable: true,
                            dataIndex: 'postalCode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Postal Number",
                            width: 70,
                            sortable: true,
                            dataIndex: 'postalNumber',
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
                            header: "Created By",
                            width: 70,
                            sortable: true,
                            dataIndex: 'createdBy',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }), new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 280,
                    minSize: 100,
                    maxSize: 400,
                    collapsible: true,
                    title: 'Banks',
                    tools: tools,
                    margins: '0 5 0 0',
                    store: bankBranchesStore,
                    id: 'bank-branches-grid',
                    closable: true,
                    sm: bankBranchesSelectModel,
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'Add Bank Branch',
                            iconCls: 'silk-comment-add',
                            handler: function () {
                                //addLineOfBusinessWindow();
                                addBankBranchWindow();
                            }

                        }],
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [bankBranchesSelectModel, {
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
                            header: "Branch Code",
                            width: 70,
                            sortable: true,
                            dataIndex: 'branchCode',
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
                            header: "Branch Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'branchName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Postal Code",
                            width: 70,
                            sortable: true,
                            dataIndex: 'postalCode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Postal Number",
                            width: 70,
                            sortable: true,
                            dataIndex: 'postalNumber',
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
                            header: "Building",
                            width: 70,
                            sortable: true,
                            dataIndex: 'building',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Street",
                            width: 70,
                            sortable: true,
                            dataIndex: 'street',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Bank Town ID",
                            width: 70,
                            sortable: true,
                            dataIndex: 'bankTownId',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                })]
        }, {
            layout: 'border',
            title: 'Currency setup',
            items: [{
                    // lazily created panel (xtype:'panel' is default)
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Currency setup',
                    margins: '0 5 0 0'
                }, new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 330,
                    minSize: 100,
                    maxSize: 400,
                    collapsible: true,
                    title: 'Currency',
                    margins: '0 5 0 0',
                    store: currenciesStore,
                    id: 'currencies-grid',
                    closable: true,
                    sm: currenciesSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [currenciesSelectModel, {
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
                            header: "Currency Code",
                            width: 70,
                            sortable: true,
                            dataIndex: 'currencyCode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Currency Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'currencyName',
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
                    labelWidth: 100, // label settings here cascade unless overridden
                    url: contextpath + '/currency/save.action?_csrf=' + csrfToken,
                    method: 'POST',
                    frame: true,
                    bodyStyle: 'padding:5px 5px 0',
                    id: 'currencies-panel',
                    region: 'center',
                    tools: [{
                            type: 'help',
                            handler: function () {
                                // show help here
                            }
                        }, {
                            itemId: 'refresh',
                            type: 'refresh',
                            hidden: true,
                            handler: function () {
                                // do refresh
                            }
                        }, {
                            type: 'search',
                            handler: function (event, target, owner, tool) {
                                // do search
                                owner.child('#refresh').show();
                            }
                        }],
                    items: [{
                            xtype: 'fieldset',
                            title: 'Currency',
                            collapsible: true,
                            autoHeight: true,
                            defaults: {
                                anchor: '50%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Currency Code',
                                    name: 'currencyCode'
                                }, {
                                    fieldLabel: 'Currency Name',
                                    name: 'currencyName'
                                }, {
                                    fieldLabel: 'Created On',
                                    name: 'createdAt',
                                    xtype: 'datefield',
                                    anchor: '50%'
                                }, {
                                    checked: true,
                                    fieldLabel: 'Enabled',
                                    xtype: 'checkbox',
                                    labelSeparator: '',
                                    boxLabel: 'Is Active',
                                    name: 'isActive'
                                }],
                            buttons: [{
                                    text: 'Save',
                                    iconCls: 'silk-save',
                                    handler: function () {
                                        var form = Ext.getCmp('currencies-panel').getForm();
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
                                                    currenciesStore.load({
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








var addBankForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/save/bank.action?_csrf=' + csrfToken,
    method: 'POST',
    frame: true,
    bodyStyle: 'padding:5px 5px 0',
    id: 'banks-form-panel',
    //region: 'center',

    items: [{
            xtype: 'fieldset',
            title: 'Bank',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'Bank Code',
                    name: 'bankCode'
                }, {
                    fieldLabel: 'Bank Name',
                    name: 'bankName'
                }, {
                    fieldLabel: 'Bank Town ID',
                    name: 'bankTownId'
                }, {
                    fieldLabel: 'Postal Code',
                    name: 'postalCode'
                }, {
                    fieldLabel: 'Postal Number',
                    name: 'postalNumber'
                }, {
                    fieldLabel: 'Created On',
                    name: 'createdAt',
                    xtype: 'datefield',
                    anchor: '95%'
                }, {
                    fieldLabel: 'Created By',
                    name: 'createdBy'
                }],
            buttons: [{
                    text: 'Save',
                    iconCls: 'silk-save',
                    handler: function () {
                        var form = Ext.getCmp('banks-form-panel').getForm();
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
                                    banksStore.load({
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
                    handler: function () {
                        winBank.hide();
                    }
                }]
        }]
});




var addBankBranchForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/save/bank-branch.action?_csrf=' + csrfToken,
    method: 'POST',
    frame: true,
    bodyStyle: 'padding:5px 5px 0',
    id: 'bank-branch-form-panel',
    //region: 'center',

    items: [{
            xtype: 'fieldset',
            title: 'Bank',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'Branch Code',
                    name: 'branchCode'
                }, {
                    fieldLabel: 'Branch Name',
                    name: 'branchName'
                }, {
                    fieldLabel: 'Bank ID',
                    name: 'bankId',
                    hidden: true
                }, {
                    fieldLabel: 'Branch Town ID',
                    name: 'branchTownId'
                }, {
                    fieldLabel: 'Postal Code',
                    name: 'postalCode'
                }, {
                    fieldLabel: 'Postal Number',
                    name: 'postalNumber'
                }, {
                    fieldLabel: 'Building',
                    name: 'building'
                }, {
                    fieldLabel: 'Street',
                    name: 'street'
                }, {
                    fieldLabel: 'Created On',
                    name: 'createdAt',
                    xtype: 'datefield',
                    anchor: '95%'
                }],
            buttons: [{
                    text: 'Save',
                    iconCls: 'silk-save',
                    handler: function () {
                        var form = Ext.getCmp('bank-branch-form-panel').getForm();
                        console.log('getting form ...');
                        var bankId = null;
                        try {
                            bankId = Ext.getCmp('banks-grid').getSelectionModel().getSelected().get('id');
                            form.findField('bankId').setValue(bankId);
                        } catch (e) {
                            Ext.Msg.show({
                                title: 'Message',
                                msg: 'Select bank first then try again!',
                                icon: Ext.Msg.WARNING,
                                buttons: Ext.Msg.OK
                            })
                        }
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
                                    bankBranchesStore.load({
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
                    handler: function () {
                        winBankBranch.hide();
                    }
                }]
        }]
});




var winBank;
function addBanksWindow(lineOfBusinessId) {
    if (!winBank) {
        winBank = new Ext.Window({
            title: 'Add Bank',
            layout: 'fit',
            width: 480,
            height: 320,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: addBankForm
        });
    }
    winBank.show(this);

    Ext.getCmp('banks-form-panel').getForm().reset();
    Ext.getCmp('banks-form-panel').getForm().load({
        url: contextpath + '/getuser-in-form.action',
        params: {
            id: lineOfBusinessId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}



var winBankBranch;
function addBankBranchWindow(lineOfBusinessId) {
    if (!winBankBranch) {
        winBankBranch = new Ext.Window({
            title: 'Add Bank Branch',
            layout: 'fit',
            width: 480,
            height: 340,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: addBankBranchForm
        });
    }
    winBankBranch.show(this);

    Ext.getCmp('bank-branch-form-panel').getForm().reset();
    Ext.getCmp('bank-branch-form-panel').getForm().load({
        url: contextpath + '/getuser-in-form.action',
        params: {
            id: lineOfBusinessId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}