var readerFramework = new Ext.data.JsonReader({
    root: 'data',
    totalProperty: 'totalProperty',
    fields: ['accountCode', 'description', 'identity']
});

// Create Grouping Store to group records by a given value
var accountsFrameworkStore = new Ext.data.GroupingStore({
    id: 'accountsframework-store',
    reader: readerFramework,
    remoteSort: true,
    groupField: 'code',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/accounts/get-parents?_csrf=' + csrfToken,
        autoAbort: true,
        disableCaching: true,
        timeout: 180000,
        method: 'GET'
    }),
    sortInfo: {
        field: 'code',
        direction: "ASC"
    }, listeners: {
        load: function (sender, node, records) {
            console.log('data loaded!');
        }
    }
});

accountsFrameworkStore.load();


var mnuContext = new Ext.menu.Menu({
    items: [{
            id: 'do-something',
            text: 'Do something'
        }],
    listeners: {
        itemclick: function (item) {
            switch (item.id) {
                case 'do-something':
                    break;
            }
        }
    }
});

var someMenu = new Ext.menu.Menu({
    items: [{
            text: "Add Account",
            handler: function () {
                var selected = Ext.getCmp('accountsframework-grid-panel').getSelectionModel().isSelected();
                if (!selected) {
                    var codeSelected = Ext.getCmp('accountsframework-grid-panel').getSelectionModel().getSelectedNode().attributes.identity;
                    console.log('Selected::' + codeSelected);
                    addFrameworkAccountWindow();
                } else {
                    Ext.MessageBox.show({
                        title: 'Alert',
                        msg: 'Please, Select one of the main accounts then try again!',
                        icon: Ext.MessageBox.WARNING,
                        buttons: Ext.MessageBox.OK
                    })

                }
            }
        }, {
            text: "View Account Transactions"
        }]
});
var accountsFrameworkPanel = new Ext.ux.tree.TreeGrid({
    title: 'Chart of Accounts',
    id: 'accountsframework-grid-panel',
    enableDD: true,
    expand: false,
    tbar: [{
            text: 'Add Account',
            iconCls: 'silk-book',
            handler: function () {
                var selected = Ext.getCmp('accountsframework-grid-panel').getSelectionModel().isSelected();
                if (!selected) {
                    var codeSelected = Ext.getCmp('accountsframework-grid-panel').getSelectionModel().getSelectedNode().attributes.identity;
                    console.log('Selected::' + codeSelected);
                    addFrameworkAccountWindow();
                } else {
                    Ext.MessageBox.show({
                        title: 'Alert',
                        msg: 'Please, Select one of the main accounts then try again!',
                        icon: Ext.MessageBox.WARNING,
                        buttons: Ext.MessageBox.OK
                    })

                }
            }
        }],
    columns: [{
            header: 'Account Code',
            width: 280,
            sortType: 'asFloat',
            dataIndex: 'accountCode'
        }, {
            header: 'Description',
            dataIndex: 'description',
            width: 280
        }, {
            header: 'Identity',
            dataIndex: 'identity',
            hidden: true,
            width: 230
        }],
    listeners: {
        contextmenu: function (node, eventObj) {
            eventObj.stopEvent();
            console.log('ContextMenu');
            console.log(node.id);
            console.log(this);
            someMenu.showAt(eventObj.getXY());
        },
        rowcontextmenu: function () {
            console.log('rowcontextmenu');
        }
    },
    viewConfig: {
        forceFit: true
    },
    loader: new Ext.ux.tree.TreeGridLoader({
        dataUrl: contextpath + '/accounts/get-parents?_csrf=' + csrfToken,
        requestMethod: 'GET',
        sortInfo: {
            field: 'code',
            direction: 'ASC'
        }
    }),
    bbar: new Ext.PagingToolbar({
        pageSize: 25,
        store: accountsFrameworkStore,
        method: 'GET',
        displayInfo: true,
        displayMsg: 'Displaying account(s) {0} - {1} of {2}',
        emptyMsg: "No account(s) found"
    })


});


var accountsFrameworkCombo = new Ext.form.ComboBox({
    fieldLabel: 'Account Class',
    store: accountsClassStore,
    displayField: 'accountClass',
    id: 'comboaccountsframework',
    name: 'accountClass',
    typeAhead: true,
    mode: 'local',
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select a class ...',
    defaults: {
        anchor: '95%'
    },
    selectOnFocus: true
});


var accountsFrameworkForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/accounts/saveaccount.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'accountsframework-form',
    items: [{
            xtype: 'fieldset',
            title: 'Account Details',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'parentId',
                    name: 'parentId',
                    hidden: true
                }, {
                    fieldLabel: 'Account Name',
                    name: 'accountName'
                }, {
                    fieldLabel: 'Code',
                    name: 'accountCode'
                }, {
                    fieldLabel: 'Id',
                    name: 'id',
                    hidden: true,
                }, accountsFrameworkCombo]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('accountsframework-form').getForm();
                console.log('form picked ...');
                if (form.isValid()) {
                    console.log('form valid ...');
                    var parentId = Ext.getCmp('accountsframework-grid-panel').getSelectionModel().getSelectedNode().attributes.identity;
                    form.findField('parentId').setValue(parentId);
                    form.submit({
                        success: function (obj, resp) {
                            console.log(resp.response.responseText);
                            var json = JSON.parse(resp.response.responseText);
                            Ext.Msg.show({
                                title: "Server Response",
                                msg: json.msg,
                                icon: Ext.Msg.INFO,
                                buttons: Ext.Msg.OK
                            });
                            accountsFrameworkPanel.getLoader().load(accountsFrameworkPanel.getRootNode());
                            winAccountFramework.hide();
                        }, failure: function (response, obj) {
                            console.log(obj);
                            var res = obj.response.responseText;
                            var message = '';
                            try {
                                res = Ext.decode(obj.response.responseText);
                                message = res.msg;
                            } catch (e) {
                                console.log(e)
                            }
                            if (message.includes('Access is denied')) {
                                Ext.Msg.show({
                                    title: 'Server Alert',
                                    msg: 'Sorry, you do not have access rights for this action!',
                                    icon: Ext.Msg.WARNING,
                                    buttons: Ext.Msg.OK
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Server Alert',
                                    msg: message,
                                    icon: Ext.MessageBox.WARNING,
                                    buttons: Ext.MessageBox.OK
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
                winAccountFramework.hide();
            }
        }]
});



var winAccountFramework;
function addFrameworkAccountWindow(parentId) {
    if (!winAccountFramework) {
        winAccountFramework = new Ext.Window({
            title: 'Add Account',
            layout: 'fit',
            iconCls: 'silk-book',
            width: 460,
            height: 230,
            closeAction: 'hide',
            plain: true,
            items: accountsFrameworkForm
        });
    }
    winAccountFramework.show(this);

    Ext.getCmp('accountsframework-form').getForm().reset();
    Ext.getCmp('accountsframework-form').getForm().findField('parentId').setValue(parentId);
    Ext.getCmp('accountsframework-form').getForm().load({
        url: contextpath + '/account/fillform.action',
        params: {
            parentId: parentId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}



Ext.getCmp('accountsframework-grid-panel').on('dblclick', function (node) {

    var codeSelected = Ext.getCmp('accountsframework-grid-panel').getSelectionModel().getSelectedNode().attributes.identity;

    addFrameworkAccountWindow(codeSelected);

});

Ext.getCmp('accountsframework-grid-panel').on('rowcontextmenu', function (node) {
    console.log('event detected::::');
    e.stopEvent();
    mnuContext.rowIndex = rowIndex;
    mnuContext.showAt(e.getXY());

});


var accountTransactionsStore = new Ext.data.JsonStore({
    id: 'accounttransactions-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/accounttransactions/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'transRef', 'accountName', 'transDate', 'debit', 'credit'],
    sortInfo: {
        field: 'id',
        direction: 'DESC'
    }

});


var trialbalanceStore = new Ext.data.JsonStore({
    id: 'trialbalance-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/balances/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'transRef', 'accountName', 'debit', 'credit']

});

var incomeStatementStore = new Ext.data.JsonStore({
    id: 'incomestatement-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/incomestatement/gridview.action',
        method: 'GET'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'name', 'value']

});

var sofpStore = new Ext.data.JsonStore({
    id: 'sofp-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/sofp/gridview.action',
        method: 'GET'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'name', 'value']

});

incomeStatementStore.load();

sofpStore.load();

accountTransactionsStore.load();

trialbalanceStore.load();

var accountTransactionsSelectModel = new Ext.grid.CheckboxSelectionModel();

var trialbalanceSelectModel = new Ext.grid.CheckboxSelectionModel();

var incomeStatementSelectModel = new Ext.grid.CheckboxSelectionModel();

var sofpSelectModel = new Ext.grid.CheckboxSelectionModel();

var accountsTransactions = new Ext.TabPanel({
    autoTabs: true,
    id: 'accountstransactions-panel',
    activeTab: 0,
    deferredRender: false,
    border: false,
    items: [accountsFrameworkPanel,
        new Ext.grid.GridPanel(
                {
                    store: accountTransactionsStore,
                    height: 200,
                    title: 'Transactions',
                    minSize: 75,
                    maxSize: 250,
                    id: 'accountstrans-grid-panel',
                    sm: accountTransactionsSelectModel,
                    viewConfig: {
                        forceFit: true
                    }, listeners: {
                        cellclick: function (grd, rowIndex, colIndex, e) {

                        }
                    },
                    loadMask: true,
                    stripeRows: true,
                    // bbar : pagingBar,
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'View Transactions',
                            iconCls: 'silk-comment-add',
                            handler: function () {
                                var encoded = entityName.replace(/ /g, "_")
                                Ext.getCmp('accountstransactions-panel').add(
                                        new Ext.BoxComponent(
                                                {
                                                    id: 'jasperreport',
                                                    title: 'Accounts Entries',
                                                    closable: true,
                                                    autoEl: {
                                                        tag: 'iframe',
                                                        closable: true,
                                                        frameborder: '0',
                                                        width: screen.width
                                                                * (90 / 100),
                                                        height: screen.height
                                                                * (70 / 100),
                                                        src: jasperserver + 'jasperserver/flow.html?_flowId=viewReportFlow&decorate=no' +
                                                                '&standAlone=true&_flowId=viewReportFlow&ParentFolderUri=%2Freports%2Fsamples' +
                                                                '&reportUnit=%2Freports%2Fsamples%2FJson_Report' +
                                                                '&j_username=jasperadmin&j_password=jasperadmin&testParam=' + baseUrl +
                                                                '&_registeredName=' + entityId +
                                                                '&endDate=' + endDate

                                                    },
                                                    listeners: {
                                                        afterrender: function () {
                                                            console.log('rendered');

                                                            this.getEl().on('load', function () {
                                                                console.log('loaded');
                                                            });
                                                        }
                                                    }
                                                })).show()

                            }

                        }],
                    columns: [accountTransactionsSelectModel, {
                            header: 'Id',
                            width: 160,
                            sortable: true,
                            hidden: true,
                            dataIndex: 'id'
                        }, {
                            header: 'Transaction Ref',
                            width: 75,
                            sortable: true,
                            dataIndex: 'transRef'
                        }, {
                            header: 'Transaction Date',
                            width: 75,
                            sortable: true,
                            dataIndex: 'transDate'
                        }, {
                            header: 'Account',
                            width: 75,
                            sortable: true,
                            dataIndex: 'accountName'
                        }, {
                            header: 'Debit',
                            width: 75,
                            align: 'right',
                            sortable: true,
                            tdAttrs: {style: 'padding: 10px;'},
                            dataIndex: 'debit'
                        }, {
                            header: 'Credit',
                            width: 75,
                            tdAttrs: {style: 'padding: 10px;'},
                            align: 'right',
                            sortable: true,
                            dataIndex: 'credit'
                        }],
                    bbar: new Ext.PagingToolbar({
                        pageSize: 25,
                        store: accountTransactionsStore,
                        method: 'get',
                        displayInfo: true,
                        displayMsg: 'Displaying transaction(s) {0} - {1} of {2}',
                        emptyMsg: "No transaction(s) found"
                    })
                }), new Ext.grid.GridPanel(
                {
                    store: trialbalanceStore,
                    height: 200,
                    title: 'Balances',
                    minSize: 75,
                    maxSize: 250,
                    id: 'accountsbalances-grid-panel',
                    sm: trialbalanceSelectModel,
                    viewConfig: {
                        forceFit: true
                    }, listeners: {
                        cellclick: function (grd, rowIndex, colIndex, e) {

                        }
                    },
                    loadMask: true,
                    stripeRows: true,
                    // bbar : pagingBar,
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'View Balances',
                            iconCls: 'silk-comment-add',
                            handler: function () {
                                var url = jasperserver + 'jasperserver/flow.html?_flowId=viewReportFlow&decorate=no' +
                                                                '&standAlone=true&_flowId=viewReportFlow&ParentFolderUri=%2Freports%2Fsamples' +
                                                                '&reportUnit=%2Freports%2Fsamples%2FtrialBalance' +
                                                                '&j_username=jasperadmin&j_password=jasperadmin&baseUrl=' + baseUrl +
                                                                '&entityId=' + entityId +
                                                                '&endDate=' + endDate;
                                Ext.getCmp('accountstransactions-panel').add(
                                        new Ext.BoxComponent(
                                                {
                                                    id: 'jasperreport-trialbalance',
                                                    title: 'Accounts Balances',
                                                    closable: true,
                                                    autoEl: {
                                                        tag: 'iframe',
                                                        closable: true,
                                                        frameborder: '0',
                                                        width: screen.width
                                                                * (90 / 100),
                                                        height: screen.height
                                                                * (70 / 100),
                                                        src: url

                                                    },
                                                    listeners: {
                                                        afterrender: function () {
                                                            console.log('rendered');

                                                            this.getEl().on('load', function () {
                                                                console.log('loaded');
                                                            });
                                                        }
                                                    }
                                                })).show()

                            }

                        }],
                    columns: [trialbalanceSelectModel, {
                            header: 'Id',
                            width: 160,
                            sortable: true,
                            hidden: true,
                            dataIndex: 'id'
                        }, {
                            header: 'Account',
                            width: 75,
                            sortable: true,
                            dataIndex: 'accountName'
                        }, {
                            header: 'Debit',
                            width: 75,
                            sortable: true,
                            padding: '10',
                            align: 'right',
                            dataIndex: 'debit'
                        }, {
                            header: 'Credit',
                            width: 75,
                            sortable: true,
                            padding: '10',
                            align: 'right',
                            dataIndex: 'credit'
                        }],
                    bbar: new Ext.PagingToolbar({
                        pageSize: 25,
                        store: trialbalanceStore,
                        method: 'get',
                        displayInfo: true,
                        displayMsg: 'Displaying balance(s) {0} - {1} of {2}',
                        emptyMsg: "No balance(s) found"
                    })
                }), new Ext.grid.GridPanel(
                {
                    store: incomeStatementStore,
                    height: 200,
                    title: 'Income Statement',
                    minSize: 75,
                    maxSize: 250,
                    id: 'incomestatement-grid-panel',
                    sm: incomeStatementSelectModel,
                    viewConfig: {
                        forceFit: true
                    }, listeners: {
                        cellclick: function (grd, rowIndex, colIndex, e) {

                        }
                    },
                    loadMask: true,
                    stripeRows: true,
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'View Income Statement',
                            iconCls: 'silk-comment-add',
                            handler: function () {
                               
                                Ext.Ajax.request({
                                    url: contextpath + '/incomestatementhtmltable/gridview.action',
                                    method: 'GET',
                                    params: {
                                        _csrf: csrfToken,
                                        entityId: entityId
                                    },
                                    success: function (obj, resp) {
                                        
                                        var url = jasperserver + 'jasperserver/flow.html?_flowId=viewReportFlow&decorate=no' +
                                                                '&standAlone=true&_flowId=viewReportFlow&ParentFolderUri=%2Freports%2Fsamples' +
                                                                '&reportUnit=%2Freports%2Fsamples%2FincomeStatement' +
                                                                '&j_username=jasperadmin&j_password=jasperadmin&baseUrl=' + baseUrl +
                                                                '&entityId=' + entityId +
                                                                '&endDate=' + endDate;
                                        console.log(url);
                                        Ext.getCmp('accountstransactions-panel').add(
                                        new Ext.BoxComponent(
                                                {
                                                    id: 'jasperreport-incomestatement',
                                                    title: 'Income Statement',
                                                    closable: true,
                                                    autoEl: {
                                                        tag: 'iframe',
                                                        closable: true,
                                                        frameborder: '0',
                                                        width: screen.width
                                                                * (90 / 100),
                                                        height: screen.height
                                                                * (70 / 100),
                                                        src: url

                                                    },
                                                    listeners: {
                                                        afterrender: function () {
                                                            console.log('rendered');
                                                            this.getEl().on('load', function () {
                                                                console.log('loaded');
                                                            });
                                                        }
                                                    }
                                                })).show()
                                    }, failure: function () {

                                    }
                                });
                                
                            }

                        }],
                    columns: [incomeStatementSelectModel, {
                            header: 'Id',
                            width: 160,
                            sortable: true,
                            hidden: true,
                            dataIndex: 'id'
                        }, {
                            header: 'Account',
                            width: 75,
                            sortable: true,
                            dataIndex: 'name'
                        }, {
                            align: 'right',
                            header: 'Amount',
                            width: 75,
                            sortable: true,
                            dataIndex: 'value'
                        }],
                    bbar: new Ext.PagingToolbar({
                        pageSize: 25,
                        store: incomeStatementStore,
                        method: 'get',
                        displayInfo: true,
                        displayMsg: 'Displaying statement(s) {0} - {1} of {2}',
                        emptyMsg: "No statement(s) found"
                    })
                }), new Ext.grid.GridPanel(
                {
                    store: sofpStore,
                    height: 200,
                    title: 'Statement of Financial Position',
                    minSize: 75,
                    maxSize: 250,
                    id: 'sofp-grid-panel',
                    sm: sofpSelectModel,
                    viewConfig: {
                        forceFit: true
                    }, listeners: {
                        cellclick: function (grd, rowIndex, colIndex, e) {

                        }
                    },
                    loadMask: true,
                    stripeRows: true,
                    tbar: [
                        {
                            xtype: 'button',
                            text: 'View Balance Sheet',
                            iconCls: 'silk-comment-add',
                            handler: function () {
                                var url = jasperserver + 'jasperserver/flow.html?_flowId=viewReportFlow&decorate=no' +
                                                                '&standAlone=true&_flowId=viewReportFlow&ParentFolderUri=%2Freports%2Fsamples' +
                                                                '&reportUnit=%2Freports%2Fsamples%2FbalanceSheet' +
                                                                '&j_username=jasperadmin&j_password=jasperadmin&baseUrl=' + baseUrl +
                                                                '&entityId=' + entityId +
                                                                '&endDate=' + endDate;
                                                        Ext.getCmp('accountstransactions-panel').add(
                                new Ext.BoxComponent(
                                                {
                                                    id: 'jasperreport-balancesheet',
                                                    title: 'Statement of Financial Position',
                                                    closable: true,
                                                    autoEl: {
                                                        tag: 'iframe',
                                                        closable: true,
                                                        frameborder: '0',
                                                        width: screen.width
                                                                * (90 / 100),
                                                        height: screen.height
                                                                * (70 / 100),
                                                        src: url

                                                    },
                                                    listeners: {
                                                        afterrender: function () {
                                                            console.log('rendered');
                                                            this.getEl().on('load', function () {
                                                                console.log('loaded');
                                                            });
                                                        }
                                                    }
                                                })).show()
                            }

                        }],
                    columns: [sofpSelectModel, {
                            header: 'Id',
                            width: 160,
                            sortable: true,
                            hidden: true,
                            dataIndex: 'id'
                        }, {
                            header: 'Account',
                            width: 75,
                            sortable: true,
                            dataIndex: 'name'
                        }, {
                            header: 'Amount',
                            align: 'right',
                            width: 75,
                            sortable: true,
                            dataIndex: 'value'
                        }],
                    bbar: new Ext.PagingToolbar({
                        pageSize: 25,
                        store: sofpStore,
                        method: 'get',
                        displayInfo: true,
                        displayMsg: 'Displaying statement(s) {0} - {1} of {2}',
                        emptyMsg: "No statement(s) found"
                    })
                })
    ]
});