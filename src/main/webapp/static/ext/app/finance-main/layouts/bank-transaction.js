
Ext.override(Ext.form.Field, {
    // Add functionality to Field's initComponent to enable the change event to
    // bubble
    initComponent: Ext.form.Field.prototype.initComponent
            .createSequence(function () {
                this.enableBubble('change');
            }),
    // We know that we want Field's events to bubble directly to the FormPanel.
    getBubbleTarget: function () {
        if (!this.formPanel) {
            this.formPanel = this.findParentByType('form');
        }
        return this.formPanel;
    }
});

var financialTransactionsStore = new Ext.data.JsonStore({
    id: 'financialtransactions-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/financialtransactions/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'referenceNumber', 'amount', 'personWithdrawing', 'description', 'transactionDate']

});

var descriptionStore = new Ext.data.JsonStore({
    id: 'description-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/financialtransaction/type.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        filter: 'Bank',
        start: 0
    },
    root: 'data',
    fields: ['description']

});

financialTransactionsStore.load();

descriptionStore.load();

var financialTransactionsForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/banktransaction/save.action?_csrf=' + csrfToken,
    method: 'POST',
    title: 'Financial Transactions',
    frame: true,
    id: 'financialtransations-bank-form',
    bodyStyle: 'padding:5px 5px 0',
    width: 350,
    items: [{
            xtype: 'fieldset',
            title: 'Transactions',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%',
            },
            defaultType: 'textfield',
            items: [new Ext.form.ComboBox({
                    store: descriptionStore,
                    fieldLabel: 'Mode',
                    id: 'transactiontype-bank-combo',
                    displayField: 'description',
                    typeAhead: true,
                    name: 'description',
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Type',
                    selectOnFocus: true,
                    listeners: {
                        select: function (combo, record, index) {
                            //write cool code here
                            var descr = record.get('description');
                            if (descr === 'Mobile Deposit' || descr === 'Mobile Withdrawal') {

                                Ext.getCmp('financialtransations-bank-form').form.url =
                                        contextpath + '/mobiletransaction/save.action?_csrf=' + csrfToken;

                                Ext.getCmp('mobileOperator').setVisible(true);
                                Ext.getCmp('phoneNumber').setVisible(true);

                                Ext.getCmp('chequeNumber').setValue('');
                                Ext.getCmp('chequeNumber').setVisible(false);

                                Ext.getCmp('bankBranch').setValue('');
                                Ext.getCmp('bankBranch').setVisible(false);

                                Ext.getCmp('drawer').setValue('');
                                Ext.getCmp('drawer').setVisible(false);
                            }
                            if (descr === 'Bank Deposit' || descr === 'Bank Withdrawal') {
                                Ext.getCmp('financialtransations-bank-form').form.url =
                                        contextpath + '/banktransaction/save.action?_csrf=' + csrfToken;
                                Ext.getCmp('mobileOperator').setValue('');
                                Ext.getCmp('phoneNumber').setValue('');
                                Ext.getCmp('mobileOperator').setVisible(false);
                                Ext.getCmp('phoneNumber').setVisible(false);

                                Ext.getCmp('bankBranch').setVisible(true);

                                Ext.getCmp('chequeNumber').setVisible(true);
                            }
                            if (descr === 'Cash Deposit' || descr === 'Cash Withdrawal') {
                                Ext.getCmp('financialtransations-bank-form').form.url =
                                        contextpath + '/cashtransaction/save.action?_csrf=' + csrfToken;
                                Ext.getCmp('mobileOperator').setValue('');
                                Ext.getCmp('phoneNumber').setValue('');
                                Ext.getCmp('mobileOperator').setVisible(false);
                                Ext.getCmp('phoneNumber').setVisible(false);

                                Ext.getCmp('chequeNumber').setValue('');
                                Ext.getCmp('chequeNumber').setVisible(false);

                                Ext.getCmp('bankBranch').setValue('');
                                Ext.getCmp('bankBranch').setVisible(false);

                                Ext.getCmp('drawer').setValue('');
                                Ext.getCmp('drawer').setVisible(false);
                            }

                            if (descr === 'Mobile Withdrawal' || descr === 'Bank Withdrawal' || descr === 'Cash Withdrawal') {
                                Ext.getCmp('supplier-name-combo-bank').setVisible(true);

                                Ext.getCmp('customer-name-combo-bank').setVisible(false);
                                Ext.getCmp('customer-name-combo-bank').setValue('');
                            } else {
                                Ext.getCmp('supplier-name-combo-bank').setValue('');
                                Ext.getCmp('supplier-name-combo-bank').setVisible(false);

                                Ext.getCmp('customer-name-combo-bank').setVisible(true);
                            }
                        }
                    }
                }), {
                    fieldLabel: 'Bank Branch',
                    name: 'bankBranch',
                    id: 'bankBranch'
                }, {
                    fieldLabel: 'Person',
                    name: 'personWithdrawing',
                    id: 'personWithdrawing'
                }, new Ext.form.ComboBox({
                    store: suppliersStore,
                    fieldLabel: 'Supplier',
                    displayField: 'supplierName',
                    id: 'supplier-name-combo-bank',
                    typeAhead: true,
                    name: 'supplierName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Creditor...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: customersStore,
                    fieldLabel: 'Customer',
                    displayField: 'customerName',
                    id: 'customer-name-combo-bank',
                    typeAhead: true,
                    name: 'customerName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Customer...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'Mobile Operator',
                    name: 'mobileOperator',
                    id: 'mobileOperator',
                    hidden: true
                }, {
                    fieldLabel: 'Phone Number',
                    name: 'phoneNumber',
                    id: 'phoneNumber',
                    hidden: true
                }, {
                    fieldLabel: 'Cheque No',
                    name: 'chequeNumber',
                    id: 'chequeNumber'
                }, {
                    fieldLabel: 'Transaction Type',
                    name: 'transactionType',
                    hidden: true
                }, {
                    fieldLabel: 'Drawer',
                    name: 'drawer',
                    id: 'drawer'
                }, {
                    fieldLabel: 'Ref Number',
                    name: 'referenceNumber'
                }, {
                    fieldLabel: 'Trans Date',
                    name: 'transactionDate',
                    xtype: 'datefield',
                    id: 'transactionDate'
                }, {
                    fieldLabel: 'Amount',
                    name: 'amount'
                }, {
                    fieldLabel: 'Id',
                    hidden: true,
                    name: 'id'
                }]
        }], listeners: {
        change: function () {


        }
    },
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('financialtransations-bank-form').getForm();
                form.findField('transactionType').setValue(form.findField('description').getValue());
                if (form.isValid()) {
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
                            financialTransactionsStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winBankTransactions.hide();
                        }, failure: function (response, obj) {
                            console.log(obj);
                            var res = obj.response.responseText;
                            try {
                                res = Ext.decode(obj.response.responseText);
                            } catch (e) {
                                console.log(e);
                            }
                            if ((res.msg).includes('Access is denied')) {
                                Ext.Msg.show({
                                    title: 'Server Alert',
                                    msg: 'Sorry, you do not have access rights for this action!',
                                    icon: Ext.Msg.WARNING,
                                    buttons: Ext.Msg.OK
                                });
                            } else {
                                Ext.Msg.show({
                                    title: 'Server Alert',
                                    msg: res.msg,
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
                winBankTransactions.hide();
            }
        }]
});





var financialTransactionsSelectModel = new Ext.grid.CheckboxSelectionModel();

var financialTransactionsGridPanel2 = new Ext.grid.GridPanel(
        {
            store: financialTransactionsStore,
            height: 200,
            title: 'Record Transaction',
            minSize: 75,
            maxSize: 250,
            id: 'financialtransactions2-grid-panel',
            sm: financialTransactionsSelectModel,
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
                    text: 'Record Transaction',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addBankTransactionsWindow();

                    }

                }],
            columns: [financialTransactionsSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'id'
                }, {
                    header: 'Reference Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'referenceNumber'
                }, {
                    header: 'Person',
                    width: 75,
                    sortable: true,
                    dataIndex: 'personWithdrawing'
                }, {
                    header: 'Transaction',
                    width: 75,
                    sortable: true,
                    dataIndex: 'description'
                }, {
                    header: 'Transaction Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'transactionDate'
                }, {
                    header: 'Amount',
                    width: 75,
                    sortable: true,
                    dataIndex: 'amount'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: financialTransactionsStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying transactions(s) {0} - {1} of {2}',
                emptyMsg: "No transactions(s) found"
            })
        });

financialTransactionsGridPanel2.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addBankTransactionsWindow(id);
});

var winBankTransactions;
function addBankTransactionsWindow(id) {
    if (!winBankTransactions) {
        winBankTransactions = new Ext.Window({
            title: 'Record Bank Transaction',
            layout: 'fit',
            width: 600,
            height: 400,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: [new Ext.TabPanel({
                    autoTabs: true,
                    activeTab: 0,
                    deferredRender: false,
                    border: false,
                    items: [financialTransactionsForm]
                })]
        });
    }
    winBankTransactions.show(this);

    Ext.getCmp('financialtransations-bank-form').getForm().reset();
    Ext.getCmp('financialtransations-bank-form').getForm().load({
        url: contextpath + '/financialtransaction/formview.action',
        params: {
            id: id,
            _csrf: csrfToken
        },
        waitMsg: 'Loading',
        success: function () {
            updateFormFields();
        }
    });
}

function updateFormFields() {
    //
    var descr = Ext.getCmp('financialtransations-bank-form').getForm().findField('description').getValue();
    if (descr === 'Mobile Deposit' || descr === 'Mobile Withdrawal') {

        Ext.getCmp('financialtransations-bank-form').form.url =
                contextpath + '/mobiletransaction/save.action?_csrf=' + csrfToken;

        Ext.getCmp('mobileOperator').setVisible(true);
        Ext.getCmp('phoneNumber').setVisible(true);

        Ext.getCmp('chequeNumber').setValue('');
        Ext.getCmp('chequeNumber').setVisible(false);

        Ext.getCmp('bankBranch').setValue('');
        Ext.getCmp('bankBranch').setVisible(false);

        Ext.getCmp('drawer').setValue('');
        Ext.getCmp('drawer').setVisible(false);
    }
    if (descr === 'Bank Deposit' || descr === 'Bank Withdrawal') {
        Ext.getCmp('financialtransations-bank-form').form.url =
                contextpath + '/banktransaction/save.action?_csrf=' + csrfToken;
        Ext.getCmp('mobileOperator').setValue('');
        Ext.getCmp('phoneNumber').setValue('');
        Ext.getCmp('mobileOperator').setVisible(false);
        Ext.getCmp('phoneNumber').setVisible(false);

        Ext.getCmp('bankBranch').setVisible(true);

        Ext.getCmp('chequeNumber').setVisible(true);
    }
    if (descr === 'Cash Deposit' || descr === 'Cash Withdrawal') {
        Ext.getCmp('financialtransations-bank-form').form.url =
                contextpath + '/cashtransaction/save.action?_csrf=' + csrfToken;
        Ext.getCmp('mobileOperator').setValue('');
        Ext.getCmp('phoneNumber').setValue('');
        Ext.getCmp('mobileOperator').setVisible(false);
        Ext.getCmp('phoneNumber').setVisible(false);

        Ext.getCmp('chequeNumber').setValue('');
        Ext.getCmp('chequeNumber').setVisible(false);

        Ext.getCmp('bankBranch').setValue('');
        Ext.getCmp('bankBranch').setVisible(false);

        Ext.getCmp('drawer').setValue('');
        Ext.getCmp('drawer').setVisible(false);
    }

    if (descr === 'Mobile Withdrawal' || descr === 'Bank Withdrawal' || descr === 'Cash Withdrawal') {
        Ext.getCmp('supplier-name-combo-bank').setVisible(true);

        Ext.getCmp('customer-name-combo-bank').setVisible(false);
        Ext.getCmp('customer-name-combo-bank').setValue('');
    } else {
        Ext.getCmp('supplier-name-combo-bank').setValue('');
        Ext.getCmp('supplier-name-combo-bank').setVisible(false);

        Ext.getCmp('customer-name-combo-bank').setVisible(true);
    }
}

var financialTransactionsGridPanel = new Ext.TabPanel({
    activeTab: 0,
    id: 'financialtransactions-grid-panel',
    frame: true,
    items: [financialTransactionsGridPanel2]
});