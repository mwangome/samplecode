expensesStore.load({
    params: {
        _csrf: csrfToken
    }
});

var comboExpensesList = new Ext.form.ComboBox({
    fieldLabel: 'Expense',
    store: expensesStore,
    displayField: 'accountName',
    id: 'expenses-list-combo',
    typeAhead: true,
    hidden: true,
    mode: 'local',
    forceSelection: true,
    triggerAction: 'all',
    name: 'accountName',
    emptyText: 'Select an expense...',
    selectOnFocus: true
});

var storePaymentExpenseItem = new Ext.data.ArrayStore({
    fields: ['item'],
    data: [['Item'],
        ['Expense (Paid)'],
        ['Expense (Accrued)'],
        ['Expense (Prepaid)']] // from states.js
});
var comboPaymentExpenseItem = new Ext.form.ComboBox({
    fieldLabel: 'Type',
    store: storePaymentExpenseItem,
    id: 'combo-payment-expense-item',
    displayField: 'item',
    name: 'item',
    typeAhead: true,
    mode: 'local',
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select a type...',
    selectOnFocus: true,
    listeners: {
        select: function (combo, record, index) {
            var itemselected = record.get('item');

            formDisplay(itemselected);

        }
    }
});

var comboAccrualsExpenses = new Ext.form.ComboBox({
    fieldLabel: 'Accruals',
    store: accountsAccrualsStore,
    id: 'accruals-expense-combo',
    hidden: true,
    displayField: 'accountName',
    name: 'accruals',
    typeAhead: true,
    mode: 'local',
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select a accrual...',
    selectOnFocus: true
});


var comboPrepaidExpenses = new Ext.form.ComboBox({
    fieldLabel: 'Prepayments',
    store: accountsPrepaidStore,
    id: 'prepayments-expense-combo',
    displayField: 'accountName',
    name: 'prepayments',
    hidden: true,
    typeAhead: true,
    mode: 'local',
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select a prepayment ...',
    selectOnFocus: true
});

paymentsStore.load({
    params: {
        _csrf: csrfToken
    }
});

accountsAccrualsStore.load({
    params: {
        _csrf: csrfToken
    }
});

accountsPrepaidStore.load({
    params: {
        _csrf: csrfToken
    }
});

var paymentsSelectModel = new Ext.grid.CheckboxSelectionModel();

var paymentsGridPanel = new Ext.grid.GridPanel(
        {
            store: paymentsStore,
            title: 'Payment',
            sm: paymentsSelectModel,
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
                    text: 'Add Payment',
                    iconCls: 'silk-comment-add',
                    handler: function () {

                        addPaymentsWindow(-1, 'GENERAL');
                        formDisplay('Item');
                        Ext.getCmp('combo-payment-expense-item').setVisible(true);
                    }

                }],
            columns: [paymentsSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'id'
                }, {
                    header: 'Registered Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'registeredName'
                }, {
                    header: 'invoice Ref',
                    width: 75,
                    sortable: true,
                    dataIndex: 'invoiceRef'
                }, {
                    header: 'Payment Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'paymentDate'
                }, {
                    header: 'Payment Mode',
                    width: 75,
                    sortable: true,
                    dataIndex: 'payModeName'
                }, {
                    header: 'Payment Ref',
                    width: 75,
                    sortable: true,
                    dataIndex: 'paymentRef'
                }, {
                    header: 'Payment Amt',
                    width: 75,
                    sortable: true,
                    dataIndex: 'paymentAmt'
                }, {
                    header: 'Created On',
                    width: 75,
                    sortable: true,
                    dataIndex: 'createdAt'
                }, {
                    header: 'Is Active',
                    width: 75,
                    sortable: true,
                    dataIndex: 'isActive'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: paymentsStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying payment(s) {0} - {1} of {2}',
                emptyMsg: "No payment(s) found"
            })
        });



var paymentsAccrualsSelectModel = new Ext.grid.CheckboxSelectionModel();

var paymentsAccrualsGridPanel = new Ext.grid.GridPanel(
        {
            store: paymentsAccrualsStore,
            title: 'Expenses (Accrued)',
            sm: paymentsAccrualsSelectModel,
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
                    text: 'Record Accrual',
                    iconCls: 'silk-book',
                    handler: function () {
                        addPaymentsWindow(-1, 'ACCRUALS');
                        Ext.getCmp('combo-payment-expense-item').setValue('Expense (Accrued)');
                        formDisplay('Expense (Accrued)');
                        Ext.getCmp('payments-form').getForm().findField('transactionDescription').setValue('ACCRUALS');
                    }
                },{
                    xtype: 'button',
                    text: 'Payment for Accrual',
                    iconCls: 'silk-money',
                    handler: function () {
                        var sel = paymentsAccrualsGridPanel.getSelectionModel().hasSelection();
                        if (sel) {
                            var idSel = paymentsAccrualsGridPanel.getSelectionModel().getSelected().get('id');
                            addPaymentsWindow(idSel, 'ACCRUALS');
                        } else {
                            Ext.Msg.show({
                                title: "No selection",
                                msg: 'Select an accrual on the table and try again.',
                                icon: Ext.Msg.WARNING,
                                buttons: Ext.Msg.OK
                            });
                        }


                    }

                }],
            columns: [paymentsAccrualsSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Registered Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'registeredName'
                }, {
                    header: 'invoice Ref',
                    width: 75,
                    sortable: true,
                    dataIndex: 'invoiceRef'
                }, {
                    header: 'Payment Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'paymentDate'
                }, {
                    header: 'Payment Mode',
                    width: 75,
                    sortable: true,
                    dataIndex: 'payModeName'
                }, {
                    header: 'Payment Ref',
                    width: 75,
                    sortable: true,
                    dataIndex: 'paymentRef'
                }, {
                    header: 'Payment Amt',
                    width: 75,
                    sortable: true,
                    dataIndex: 'paymentAmt'
                }, {
                    header: 'Created On',
                    width: 75,
                    sortable: true,
                    dataIndex: 'createdAt'
                }, {
                    header: 'Is Active',
                    width: 75,
                    sortable: true,
                    dataIndex: 'isActive'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: paymentsAccrualsStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying payment(s) {0} - {1} of {2}',
                emptyMsg: "No payment(s) found"
            })
        });


var paymentsPrepaymentsSelectModel = new Ext.grid.CheckboxSelectionModel();
var paymentsPrepaymentsGridPanel = new Ext.grid.GridPanel(
        {
            store: paymentsPrepaymentsStore,
            title: 'Expenses (Prepayments)',
            sm: paymentsPrepaymentsSelectModel,
            viewConfig: {
                forceFit: true
            }, listeners: {
                cellclick: function (grd, rowIndex, colIndex, e) {

                }
            },
            loadMask: true,
            stripeRows: true,
            // bbar : pagingBar,
            tbar: [{
                    xtype: 'button',
                    text: 'Record Prepayment',
                    iconCls: 'silk-money',
                     handler: function () {
                         addPaymentsWindow(-1, 'PREPAYMENTS');
                        Ext.getCmp('combo-payment-expense-item').setValue('Expense (Prepaid)');
                        formDisplay('Expense (Prepaid)');
                        Ext.getCmp('payments-form').getForm().findField('transactionDescription').setValue('PREPAYMENTS');
                     }
                 },
                {
                    xtype: 'button',
                    text: 'Incur Expense',
                    iconCls: 'silk-book',
                    handler: function () {
                        var sel = paymentsPrepaymentsGridPanel.getSelectionModel().hasSelection();
                        if (sel) {
                            var idSel = paymentsPrepaymentsGridPanel.getSelectionModel().getSelected().get('id');
                            addPaymentsWindow(idSel, 'PREPAYMENTS');                            
                        } else {
                            Ext.Msg.show({
                                title: "No selection",
                                msg: 'Select an prepayment on the table and try again.',
                                icon: Ext.Msg.WARNING,
                                buttons: Ext.Msg.OK
                            });
                        }


                    }

                }],
            columns: [paymentsPrepaymentsSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Registered Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'registeredName'
                }, {
                    header: 'invoice Ref',
                    width: 75,
                    sortable: true,
                    dataIndex: 'invoiceRef'
                }, {
                    header: 'Payment Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'paymentDate'
                }, {
                    header: 'Payment Mode',
                    width: 75,
                    sortable: true,
                    dataIndex: 'payModeName'
                }, {
                    header: 'Payment Ref',
                    width: 75,
                    sortable: true,
                    dataIndex: 'paymentRef'
                }, {
                    header: 'Payment Amt',
                    width: 75,
                    sortable: true,
                    dataIndex: 'paymentAmt'
                }, {
                    header: 'Created On',
                    width: 75,
                    sortable: true,
                    dataIndex: 'createdAt'
                }, {
                    header: 'Is Active',
                    width: 75,
                    sortable: true,
                    dataIndex: 'isActive'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: paymentsPrepaymentsStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying payment(s) {0} - {1} of {2}',
                emptyMsg: "No payment(s) found"
            })
        });
        
paymentsGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addPaymentsWindow(id, 'GENERAL');

});


paymentsAccrualsGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addPaymentsWindow(id, 'ACCRUALS');
    Ext.getCmp('payments-form').getForm().findField('transactionDescription').setValue('ACCRUALS');
    

});

paymentsPrepaymentsGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addPaymentsWindow(id, 'PREPAYMENTS');
    Ext.getCmp('payments-form').getForm().findField('transactionDescription').setValue('PREPAYMENTS'); 

});



var paymentsForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/payment/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'payments-form',
    items: [{
            xtype: 'fieldset',
            title: 'Payment',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [comboPaymentExpenseItem, comboExpensesList, comboAccrualsExpenses, comboPrepaidExpenses, new Ext.form.ComboBox({
                    store: purchasesStore,
                    fieldLabel: 'Invoice Ref',
                    id: 'invoice-payments-combo',
                    displayField: 'invoiceNumber',
                    typeAhead: true,
                    name: 'invoiceNumber',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Invoice...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'Id',
                    name: 'id',
                    hidden: true
                }, {
                    fieldLabel: 'Payment Date',
                    xtype: 'datefield',
                    name: 'paymentDate'
                }, new Ext.form.ComboBox({
                    store: payModesStore,
                    fieldLabel: 'Payment Mode',
                    id: 'paymentmode-payments-combo',
                    displayField: 'payModeName',
                    typeAhead: true,
                    name: 'payModeName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Mode...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'Payment Ref',
                    name: 'paymentRef'
                }, {
                    fieldLabel: 'Payment Amt',
                    name: 'paymentAmt'
                }, {
                    fieldLabel: 'Created On',
                    xtype: 'datefield',
                    name: 'createdAt'
                }, {
                    checked: true,
                    fieldLabel: 'Enabled',
                    xtype: 'checkbox',
                    labelSeparator: '',
                    boxLabel: 'Is Active',
                    name: 'isActive'
                }, {
                    name: 'transactionDescription',
                    id: 'transactionDescription',
                    hidden: true
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('payments-form').getForm();
                if (form.findField('payModeName').getValue() === 'Select a Mode...') {
                    form.findField('payModeName').setValue('');
                }
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
                            paymentsStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winPayment.hide();
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
                winPayment.hide();
            }
        }]
});

var winPayment;
function addPaymentsWindow(storeid, transDesc) {
    if (!winPayment) {
        winPayment = new Ext.Window({
            title: 'Add Payment',
            layout: 'fit',
            width: 510,
            height: 370,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: paymentsForm
        });
    }
    winPayment.show(this);

    Ext.getCmp('payments-form').getForm().reset();
    Ext.getCmp('payments-form').getForm().load({
        url: contextpath + '/payment/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading',
        success: function (obj, resp) {
            console.log(resp.response.responseText);
            var json = JSON.parse(resp.response.responseText);
            //console.log('form load::' + json.data.item)
            formDisplay(json.data.item);
            if (transDesc === 'GENERAL') {
                Ext.getCmp('combo-payment-expense-item').setVisible(true);
                Ext.getCmp('payments-form').getForm().findField('transactionDescription').setValue('GENERAL');
            } if (transDesc === 'ACCRUALS'){
                Ext.getCmp('combo-payment-expense-item').setVisible(false);
                Ext.getCmp('payments-form').getForm().findField('transactionDescription').setValue('ACCRUALS');
                Ext.getCmp('prepayments-expense-combo').setVisible(false);
                Ext.getCmp('paymentmode-payments-combo').setVisible(true);
                
                Ext.getCmp('prepayments-expense-combo').setValue('');
                Ext.getCmp('combo-payment-expense-item').setValue('');
            }
            if(transDesc === 'PREPAYMENTS'){
                Ext.getCmp('payments-form').getForm().findField('transactionDescription').setValue('PREPAYMENTS');
                Ext.getCmp('combo-payment-expense-item').setValue('Expense (Paid)');
                Ext.getCmp('prepayments-expense-combo').setValue('');
                Ext.getCmp('expenses-list-combo').setVisible(true);
                Ext.getCmp('prepayments-expense-combo').setVisible(false);
            }
            
        }
    });
}

var expensesPanel = new Ext.TabPanel({
    activeTab: 0,
    plain: true,
    id: 'payments-grid-panel',
    defaults: {
        autoScroll: true
    },
    items: [paymentsAccrualsGridPanel, paymentsPrepaymentsGridPanel, paymentsGridPanel  ],
    autoDestroy: false
}

);


function formDisplay(itemselected) {

    if (itemselected === 'Item') {
        Ext.getCmp('invoice-payments-combo').setVisible(true);
        Ext.getCmp('paymentmode-payments-combo').setVisible(true);

        Ext.getCmp('expenses-list-combo').setValue('');
        Ext.getCmp('expenses-list-combo').setVisible(false);
        Ext.getCmp('accruals-expense-combo').setVisible(false);
        Ext.getCmp('accruals-expense-combo').setValue('');
        Ext.getCmp('prepayments-expense-combo').setVisible(false);
    }
    if (itemselected === 'Expense (Accrued)') {
        Ext.getCmp('accruals-expense-combo').setVisible(true);

        Ext.getCmp('invoice-payments-combo').setVisible(false);
        Ext.getCmp('expenses-list-combo').setVisible(false);
        Ext.getCmp('paymentmode-payments-combo').setVisible(false);
        Ext.getCmp('expenses-list-combo').setValue('');
        Ext.getCmp('invoice-payments-combo').setValue('');
        Ext.getCmp('paymentmode-payments-combo').setValue('');
    }
    if (itemselected === 'Expense (Prepaid)') {
        Ext.getCmp('prepayments-expense-combo').setVisible(true);
        Ext.getCmp('paymentmode-payments-combo').setVisible(true);
        Ext.getCmp('accruals-expense-combo').setVisible(false);
        Ext.getCmp('expenses-list-combo').setVisible(false);
        Ext.getCmp('invoice-payments-combo').setVisible(false);
        Ext.getCmp('accruals-expense-combo').setValue('');
        Ext.getCmp('invoice-payments-combo').setValue('');
        Ext.getCmp('expenses-list-combo').setValue('');
    }
    if (itemselected === 'Expense (Paid)') {
        Ext.getCmp('expenses-list-combo').setVisible(true);
        Ext.getCmp('paymentmode-payments-combo').setVisible(true);

        Ext.getCmp('prepayments-expense-combo').setVisible(false);
        Ext.getCmp('accruals-expense-combo').setVisible(false);
        Ext.getCmp('invoice-payments-combo').setVisible(false);
        Ext.getCmp('accruals-expense-combo').setValue('');
        Ext.getCmp('invoice-payments-combo').setValue('');
    }
}