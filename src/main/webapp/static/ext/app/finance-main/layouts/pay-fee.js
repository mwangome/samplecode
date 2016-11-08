Ext.override(Ext.form.Field, {
    // Add functionality to Field's initComponent to enable the change event to
    // bubble
    initComponent : Ext.form.Field.prototype.initComponent
            .createSequence(function() {
                this.enableBubble('change');
            }),

    // We know that we want Field's events to bubble directly to the FormPanel.
    getBubbleTarget : function() {
        if (!this.formPanel) {
            this.formPanel = this.findParentByType('form');
        }
        return this.formPanel;
    }
});

var storeBalance = new Ext.data.GroupingStore({
    url : contextpath + '/fina/studentbalance.action',
    autoLoad : true,
    storeId : 'student-bal-store',
    baseParams : {
        _csrf : csrfToken,
        id : '',
        session : '',
        year : ''

    },
    reader : new Ext.data.JsonReader({
        root : 'data',
        fields : [ 'balance' ]
    }),
    listeners : {
        load : function(store, records, successful, eOpts) {
            if (successful) {
                console.log(records[0].data);
                Ext.getCmp("propsGrid").getSource().Balance = records[0].data.balance;
                Ext.getCmp("propsGrid").setSource(Ext.getCmp("propsGrid")
                        .getSource())
            }
        }
    }
});

var payFeePaneHidden = undefined;

var storeVoteheadsPay = new Ext.data.JsonStore({
    url : contextpath + '/fina/sessionvotehead.action',
    root : 'data',
    baseParams : {
        _csrf : csrfToken,
        id : getSelectedStudentRecord() == undefined ? '' : getSelectedStudentRecord()
                .get('id')
    },
    fields : [ 'id', 'className', 'votehead', 'year', 'category', 'amount',
            'session', 'balance', 'paid' ],
    listeners : {
        load : function(store, records, successful, eOpts) {

        }
    }
});

var cashbookStoreFR = new Ext.data.JsonStore({
    storeId : 'cashbooks-fr',
    proxy : new Ext.data.HttpProxy({
        url : contextpath + '/cash/getcashbooks.action',
        method : 'POST'
    }),
    baseParams : {
        _csrf : csrfToken,
        start : 0,
    },
    root : 'data',
    fields : [ 'id', 'cashbookName' ]

});

var receiptDetailsStore = new Ext.data.JsonStore({
    url : contextpath + '/fina/fetchreceiptdetails',
    id : 'receipt-details-store',
    root : 'data',
    baseParams : {
        _csrf : csrfToken
    },
    fields : [ 'id', 'description', 'year', 'mode', 'amount', 'session' ]
});

var receiptsStore = new Ext.data.JsonStore({
    id : 'receipts-store',
    url : contextpath + '/fina/fetchreceipts',
    root : 'data',
    baseParams : {
        _csrf : csrfToken,
        partNumber : getSelectedStudentRecord() == undefined ? '' : getSelectedStudentRecord()
                .get('partNumber')
    },
    fields : [ 'id', 'amount', 'session', 'receiptNumber', 'description',
            'mode', 'year' ]
});

receiptsStore
        .on('beforeload', function(store, operation) {
            operation.params = operation.params || {};
            operation.params.partNumber = getSelectedStudentRecord() == undefined ? '' : getSelectedStudentRecord()
                    .get('partNumber');
            operation.params._csrf = csrfToken;
        });

var payfeeEditor = new Ext.ux.grid.RowEditor({
    saveText : 'Update'
});
var genReceiptId = undefined;

var smNormalGridPay = new Ext.grid.CheckboxSelectionModel();

var normalGridPay = new Ext.grid.GridPanel({
    store : storeVoteheadsPay,
    region : 'south',
    plugins : [ payfeeEditor ],
    aggregator : 'sum',
    measure : 'amount',
    height : 500,
    id : 'normal-grid-pay',
    multiSelect : true,
    stripeRows : true,
    emptyText : 'No voteheads to display',
    reserveScrollOffset : true,
    selModel : smNormalGridPay,
    autoExpandColumn : 'paid',
    tbar : [
            {
                text : 'Spread Payment',
                iconCls : 'silk-table-refresh',
                handler : function() {
                    spreadPayment();

                }
            },
            {
                text : 'Refresh',
                iconCls : 'silk-table-refresh',
                handler : function() {
                    fillVoteheads();

                }
            },
            {
                text : 'Save',
                iconCls : 'icon-save',
                handler : function() {
                    payfeeEditor.stopEditing();
                    // Ext.getCmp('normal-grid-pay').getStore().commitChanges();
                    var size = Ext.getCmp('normal-grid-pay').getStore().data.items.length;
                    var myArray = [];
                    for (var i = 0; i < size; i++) {
                        myArray
                                .push(Ext.getCmp('normal-grid-pay').getStore().data.items[i].data);
                    }
                    Ext.getCmp('student-fee-form').getForm()
                            .findField('partNumber')
                            .setValue(getSelectedStudentRecord()
                                    .get('partNumber'));
                    Ext.getCmp('student-fee-form').getForm()
                            .findField('transactionDate').setValue((Ext
                                    .getCmp('student-fee-form').getForm()
                                    .findField('date').getValue())
                                    .format('Y-m-d'));
                    var form = Ext.getCmp('student-fee-form').getForm();
                    var objectParams = form.getValues();
                    objectParams._csrf = csrfToken;
                    objectParams.data = JSON.stringify(myArray);
                    objectParams.chequeNumber = Ext.getCmp('chequeNumber').getValue();
                    objectParams.transactionId = Ext.getCmp('transactionId').getValue();
                    objectParams.description = Ext.getCmp('description').getValue();
                    if (Ext.getCmp('student-fee-form').getForm().isValid() && checkAmounts()) {
                        Ext.Ajax
                                .request({
                                    url : contextpath + '/fina/savereceipt',
                                    method : 'POST',
                                    params : objectParams,
                                    success : function(response, opts) {
                                        var obj = Ext
                                                .decode(response.responseText);
                                        console.dir(obj);
                                        Ext.getCmp('student-fee-form').header
                                                .setStyle('color', 'green');
                                        console.log(Ext
                                                .getCmp('student-fee-form')
                                                .getForm().getValues());
                                        Ext.Msg
                                                .alert('Success', obj.msg + '[' + obj.id + ']');
                                        setReceiptId(obj.id);
                                        setStudentbalance();

                                    },
                                    failure : function(response, opts) {
                                        console
                                                .log('server-side failure with status code ' + response.status);
                                    }
                                })
                    } else {

                        Ext.Msg
                                .show({
                                    title : 'Notification',
                                    msg : 'Fill all required fields before saving!\nAnd total of amounts on the table should match the paid amount.',
                                    buttons : Ext.Msg.OK,
                                    icon : Ext.Msg.WARNING
                                });
                    }
                    try {
                        Ext.getCmp('receipt-list-grid').getSelectionModel()
                                .clearSelections();
                    } catch (e) {

                    }

                }

            },
            {
                text : 'Print Receipt',
                iconCls : 'silk-printer',
                handler : function() {
                    selectCurrentRow();
                    // do what you need here
                    var holder = Ext.getCmp('absolute-panel');
                    var form = Ext.getCmp('student-fee-form');
                    var session = form.getForm().findField('session')
                            .getValue();
                    var year = form.getForm().findField('year').getValue();

                    var receiptId = Ext.getCmp('receipt-list-grid')
                            .getSelectionModel().getSelected() == undefined ? getReceiptId() : getSelectedReceiptId();
                    console.log('got it::>' + receiptId)
                    var contentReceptPrinter = getReceiptContainer('Students Payments', 'student-receipt-component', 'student-receipt-iframe', contextpath + '/viewer?&reload=true&reportName=payments&connectionType=BEAN&receiptNumber=' + receiptId + '&id=' + getSelectedStudentRecord()
                            .get('id') + '&year=' + year + '&session=' + session);
                    try {
                        Ext.getCmp('absolute-panel').remove(Ext
                                .getCmp('ext-gen2'));
                    } catch (e) {
                        console.log('error closing::' + e);
                    }

                    addTab(Ext.getCmp('absolute-panel'), contentReceptPrinter, 'Students Payments');

                }
            } ],
    columns : [ smNormalGridPay, {
        header : 'ID',
        width : 75,
        hidden : true,
        dataIndex : 'id',
        editor : {
            xtype : 'textfield',
            allowBlank : false
        }
    }, {
        header : 'Votehead',
        width : 75,
        dataIndex : 'votehead',
        editor : {
            xtype : 'textfield',
            allowBlank : false
        }
    }, {
        header : 'Session',
        width : 75,
        dataIndex : 'session',
        editor : {
            xtype : 'textfield',
            allowBlank : false
        }
    }, {
        header : 'Class',
        width : 75,
        dataIndex : 'className',
        editor : {
            xtype : 'textfield',
            allowBlank : false
        }
    }, {
        header : 'Year',
        dataIndex : 'year',
        align : 'right',
        cls : 'listview-filesize',
        editor : {
            xtype : 'textfield',
            allowBlank : false
        }
    }, {
        header : 'Category',
        dataIndex : 'category',
        align : 'right',
        cls : 'listview-filesize',
        editor : {
            xtype : 'textfield',
            allowBlank : false
        }
    }, {
        header : 'Amount',
        width : 75,
        dataIndex : 'amount',
        editor : {
            xtype : 'textfield',
            allowBlank : false
        }
    }, {
        header : 'Collected',
        dataIndex : 'balance',
        align : 'right',
        editor : {
            xtype : 'textfield',
            allowBlank : false
        }
    }, {
        header : 'Paid',
        dataIndex : 'paid',
        align : 'right',
        editor : {
            xtype : 'textfield',
            allowBlank : false
        }
    } ],
    viewConfig : {
        forceFit : true
    },
    bbar : new Ext.PagingToolbar({
        pageSize : 20,
        store : storeVoteheadsPay,
        method : 'get',
        displayInfo : true,
        displayMsg : 'Displaying markets {0} - {1} of {2}',
        emptyMsg : "No markets found"
    })
});

normalGridPay.on('cellclick', function(grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('paid');
});

var studentName;

var storeModes = new Ext.data.GroupingStore({
    url : contextpath + '/fina/viewmodes.action',
    autoLoad : true,
    method : 'POST',
    remoteGroup : true,
    groupField : 'modes',
    storeId : 'storeModes',
    sortInfo : {
        field : 'modes',
        direction : 'ASC'
    },
    baseParams : {
        _csrf : csrfToken
    },
    reader : new Ext.data.JsonReader({
        totalProperty : 'totalCount',
        root : 'data',
        idProperty : 'modes',
        fields : [ 'modes' ]
    })
});

var storeSessions = new Ext.data.GroupingStore({
    url : contextpath + '/form/sessions.action',
    autoLoad : true,
    method : 'POST',
    remoteGroup : true,
    groupField : 'session',
    storeId : 'storeSession',
    sortInfo : {
        field : 'session',
        direction : 'ASC'
    },
    baseParams : {
        _csrf : csrfToken
    },
    reader : new Ext.data.JsonReader({
        totalProperty : 'totalCount',
        root : 'data',
        idProperty : 'session',
        fields : [ 'session' ]
    })
});

storeModes.load({
    params : {
        start : 0,
        limit : 25,
        _csrf : csrfToken
    }
});

storeSessions.load({
    params : {
        start : 0,
        limit : 25,
        _csrf : csrfToken
    }
});

cashbookStoreFR.load({
    params : {
        _csrf : csrfToken
    }
});

var comboSession = new Ext.form.ComboBox({
    fieldLabel : 'Session',
    name : 'session',
    id : 'sessionPayfee',
    anchor : '95%',
    allowBlank : false,
    emptyText : "Select action",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : this.storeSessions,
    valueField : 'session',
    displayField : 'session'
});

var comboCashbooksFR = new Ext.form.ComboBox({
    fieldLabel : 'Cashbook',
    name : 'cashbookName',
    id : 'cashbook-combo-fr',
    anchor : '95%',
    emptyText : "Cashbook",
    triggerAction : 'all',
    lazyRender : true,
    allowBlank : false,
    mode : 'remote',
    store : this.cashbookStoreFR,
    valueField : 'cashbookName',
    displayField : 'cashbookName'
});

var comboModes = new Ext.form.ComboBox({
    fieldLabel : 'Modes',
    name : 'mode',
    id : 'modes',
    anchor : '95%',
    allowBlank : false,
    emptyText : "Select action",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : this.storeModes,
    valueField : 'modes',
    displayField : 'modes',
    allowBlank : false,
    listeners : {
        select : function(combo, record, index) {
        }
    }
});

var selModelReceiptDetails = new Ext.grid.CheckboxSelectionModel();
var receiptDetailsGrid = new Ext.grid.GridPanel(

{

    // layout : 'fit',
    id : 'receipt-list-grid',
    frame : true,
    selModel : selModelReceiptDetails,
    store : receiptsStore,
    viewConfig : {
        forceFit : true
    },
    tbar : [ {
        text : 'Cancel',
        iconCls : 'silk-cancel',
        handler : function() {
            Ext.Ajax.request({
                url : contextpath + '/form/deletereceipt.action',
                params : {
                    _csrf : csrfToken,
                    id : Ext.getCmp('receipt-list-grid').getSelectionModel()
                            .getSelected().get('id')
                },
                success : function(response, obj) {
                    var resp = Ext.decode(response.responseText);
                    console.log(resp.msg);
                    Ext.Msg
                            .alert('Deleted', 'Receipt ' + Ext
                                    .getCmp('receipt-list-grid')
                                    .getSelectionModel().getSelected()
                                    .get('id') + ' deleted successfully!');
                },
                failure : function(response, obj) {

                }
            })
        }
    } ],
    columns : [ selModelReceiptDetails, {
        header : 'ID',
        width : 100,
        sortable : true,
        dataIndex : 'id'
    }, {
        header : 'Receipt Number',
        width : 100,
        sortable : true,
        dataIndex : 'receiptNumber'
    }, {
        header : 'Mode of Pay.',
        width : 150,
        sortable : true,
        dataIndex : 'mode'
    }, {
        header : 'Session',
        width : 100,
        sortable : true,
        dataIndex : 'session'
    }, {
        header : 'Year',
        width : 100,
        sortable : true,
        dataIndex : 'year'
    }, {
        header : 'Amount',
        width : 100,
        sortable : true,
        dataIndex : 'amount'
    } ],
    stripeRows : true,
    listeners : {
        render : function(grid) {

        }
    },
    bbar : new Ext.PagingToolbar({
        pageSize : 25,
        store : receiptsStore,
        method : 'get',
        displayInfo : true,
        displayMsg : 'Displaying Receipts {0} - {1} of {2}',
        emptyMsg : "No Receipts found"
    })
});

var receiptNumber;
receiptDetailsGrid
        .on('cellclick', function(grid, rindx, cindx, e) {
            var id = grid.getStore().getAt(rindx).get('id');
            setReceiptNumber(id);
            Ext
                    .getCmp('student-fee-form')
                    .getForm()
                    .load({
                        url : contextpath + '/fina/fetchreceiptdetails',
                        method : 'POST',
                        params : {
                            id : id,
                            _csrf : csrfToken
                        },
                        success : function(obj, response) {
                            Ext.Msg
                                    .alert('success::', 'Receipt Details loaded.<BR>Check Receipt Items.');
                            var jObject = JSON.parse(response.response.responseText);
                            console.log('desc=>' + jObject.data.description);
                            Ext.getCmp('description').setValue(jObject.data.description);
                            fillVoteheads();
                        },
                        waitMsg : 'Loading ...'
                    });

        });

var payFeePanel = {
    xtype : 'tabpanel',
    id : 'pay-fee-panel',
    title : 'Fee Payments',
    closable : true,
    listeners : {
        'close' : function(tab, eOpts) {
            console.log('will hide this:');
            payFeePaneHidden = true;
            Ext.getCmp('pay-fee-panel').hide();

        }
    },
    activeTab : 0,
    // maxSize : 350,
    items : [
            {
                title : 'Amount',
                layout : 'border',
                id : 'fee-form-holder',
                items : [
                        new Ext.FormPanel({
                            labelAlign : 'top',
                            id : 'student-fee-form',
                            title : 'init title',
                            region : 'north',
                            autoDestroy : false,
                            split : true,

                            bodyStyle : 'padding:5px',
                            autoDestroy : false,
                            frame : true,
                            items : [ {
                                layout : 'column',
                                border : false,
                                items : [
                                        {
                                            columnWidth : .5,
                                            layout : 'form',
                                            border : false,
                                            items : [
                                                    {
                                                        xtype : 'textfield',
                                                        fieldLabel : 'Reg No',
                                                        name : 'partNumber',
                                                        hidden : true,
                                                        value : getSelectedStudentRecord() == undefined ? '' : getSelectedStudentRecord()
                                                                .get('partNumber'),
                                                        anchor : '95%'
                                                    }, {
                                                        xtype : 'textfield',
                                                        fieldLabel : 'Amount',
                                                        name : 'amount',
                                                        allowBlank : false,
                                                        anchor : '95%'
                                                    }, comboSession, {
                                                        xtype : 'textfield',
                                                        fieldLabel : 'Year',
                                                        id : 'year-fee',
                                                        allowBlank : false,
                                                        name : 'year',
                                                        anchor : '95%'
                                                    } ]
                                        },
                                        {
                                            columnWidth : .5,
                                            layout : 'form',
                                            border : false,
                                            items : [
                                                    {
                                                        xtype : 'compositefield',
                                                        fieldLabel : 'Payment Method',
                                                        msgTarget : 'side',
                                                        anchor : '-20',
                                                        defaults : {
                                                            flex : 1
                                                        },
                                                        items : [ comboModes,
                                                                comboCashbooksFR ]
                                                    },
                                                    {
                                                        xtype : 'compositefield',
                                                        fieldLabel : 'Transaction Details',
                                                        msgTarget : 'side',
                                                        anchor : '-20',
                                                        defaults : {
                                                            flex : 1
                                                        },
                                                        items : [ {
                                                            xtype : 'textfield',
                                                            emptyText : 'Transaction ID',
                                                            name : 'transactionId',
                                                            id : 'transactionId',
                                                            anchor : '95%'
                                                        },
                                                        {
                                                            xtype : 'textfield',
                                                            emptyText : 'Cheque No',
                                                            name : 'chequeNumber',
                                                            id : 'chequeNumber',
                                                            anchor : '95%'
                                                        } ]
                                                    },
                                                    {
                                                        xtype : 'datefield',
                                                        format : 'd/m/Y',
                                                        fieldLabel : 'Date of Transaction',
                                                        value : new Date(),
                                                        name : 'date',
                                                        anchor : '95%'
                                                    },
                                                    {
                                                        xtype : 'datefield',
                                                        hidden : true,
                                                        fieldLabel : 'Date of Transaction',
                                                        name : 'transactionDate',
                                                        anchor : '95%'
                                                    }

                                            ]
                                        } ]
                            } ],
                            listeners : {
                                change : function() {
                                    // Title goes red if form has been modified.
                                    fillVoteheads();
                                    Ext.getCmp('student-fee-form').header
                                            .setStyle('color', 'red');

                                }
                            }
                        })

                        ,
                        {
                            xtype : 'tabpanel',
                            plain : true,
                            region : 'center',
                            autoDestroy : false,
                            margins : '0 5 5 5',
                            width : 500,
                            minSize : 500,
                            activeTab : 0,
                            items : [ {
                                title : 'Voteheads',
                                cls : 'inner-tab-custom', // custom styles in
                                // layout-browser.css
                                layout : 'border',
                                // Make sure IE can still calculate dimensions
                                // after a
                                // resize when the tab is not active.
                                // With display mode, if the tab is rendered but
                                // hidden,
                                // IE will mess up the layout on show:
                                hideMode : Ext.isIE ? 'offsets' : 'display',
                                items : [
                                        {
                                            title : 'Details',
                                            region : 'west',
                                            collapsible : true,
                                            collapsed : true,
                                            width : 150,
                                            // minSize : 200,
                                            // maxSize : 350,
                                            margins : '5 0 5 5',
                                            cmargins : '5 5 5 5',
                                            html : 'Details',
                                            bodyStyle : 'padding:10px;',
                                            split : true
                                        },
                                        {
                                            xtype : 'tabpanel',
                                            region : 'center',
                                            margins : '5 5 5 0',
                                            width : 500,
                                            tabPosition : 'bottom',
                                            id : 'receipts-details-panel',
                                            activeTab : 0,
                                            autoDestroy : false,
                                            items : [
                                                    {
                                                        title : 'Receipt Items',
                                                        layout : 'fit',
                                                        items : normalGridPay
                                                    },
                                                    {
                                                        title : 'Receipts',
                                                        layout : 'fit',
                                                        items : receiptDetailsGrid,
                                                        listeners : {
                                                            activate : function() {
                                                                var me = this;
                                                                Ext
                                                                        .fly(this.ownerCt
                                                                                .getTabEl(this))
                                                                        .on({
                                                                            click : function() {
                                                                                loadReceipts();
                                                                            }
                                                                        });
                                                            },
                                                            single : true
                                                        }
                                                    } ]
                                        } ]
                            } ]
                        } ]
            }, {
                title : 'Other Details',
                layout : 'form',
                bodyStyle : 'padding:5px',
                frame : true,
                items : [ {
                    xtype      : 'textarea',
                    name : 'description',
                    id : 'description',
                    fieldLabel : 'Description',
                    anchor : '95%'
                  } ]
            } ]
};

function loadReceipts() {
    // Ext.getCmp('receipts-details-panel').setActiveTab(1);
    var hasSel = Ext.getCmp('receipt-list-grid').getSelectionModel()
            .hasSelection();
    receiptsStore.on('load', function(store, records, opt) {

        if (hasSel == false) {
            Ext.getCmp('receipt-list-grid').selModel
                    .selectRow(records.length - 1);

        }
    }, this);

    if (hasSel == false)
        receiptsStore
                .load({
                    params : {
                        _csrf : csrfToken,
                        partNumber : getSelectedStudentRecord() == undefined ? '' : getSelectedStudentRecord()
                                .get('partNumber')
                    }
                });
}

function getPaymentForm(id, name) {
    this.studentName = name;

    var compo = undefined;
    try {
        compo = Ext.getCmp('absolute-panel').getComponent(Ext
                .getCmp('pay-fee-panel'));
    } catch (e) {
        console.log(e);
    }
    if (!compo || compo) {
        console.log('creating new tab');
        addTab(Ext.getCmp('absolute-panel'), Ext.getCmp('pay-fee-panel') ? Ext
                .getCmp('pay-fee-panel') : payFeePanel, 'Fee Payments');
    } else {
        console.log('showing hidden tab');
        if (payFeePaneHidden) {
            var foo = Ext.getCmp('pay-fee-panel');

            foo.ensureAttachedToBody();
            Ext.getCmp('absolute-panel').insert(Ext.getCmp('pay-fee-panel'));
            Ext.getCmp('fee-form-holder').add(Ext.getCmp('student-fee-form'));
        } else {
            Ext.getCmp('absolute-panel').setActiveTab(Ext
                    .getCmp('pay-fee-panel'));
        }

    }
    Ext.getCmp('student-fee-form')
            .setTitle('Amount Paid::' + getSelectedStudentRecord()
                    .get('firstName'));
    Ext.getCmp('student-fee-form').getForm().reset();
    Ext.getCmp('description').setValue('');
    fillVoteheads();
    comboSession.clearValue();
    storeSessions.reload();
    console.log('store size::' + storeSessions.getCount())
    comboSession.bindStore(storeSessions);
}

function fillVoteheads() {
    var form = Ext.getCmp('student-fee-form').getForm();
    if (form.isValid) {
        console.log('now valid::');
        storeVoteheadsPay.load({
            params : {
                _csrf : csrfToken,
                session : form.findField('session').getValue(),
                year : form.findField('year').getValue(),
                id : getSelectedStudentRecord().get('id'),
                receiptNumber : getReceiptNumber()
            }
        });
        try {
            normalGridPay.getView().refresh();
        } catch (e) {
            console.log('error::refreshing');
        }
        setReceiptNumber('');
        setStudentbalance();
    }

}

function setReceiptNumber(receiptNumber) {
    this.receiptNumber = receiptNumber;

}

function getReceiptNumber() {
    return this.receiptNumber;

}

function getSelectedReceiptId() {
    var id = undefined;
    if (Ext.getCmp('receipt-list-grid').getSelectionModel().getSelected() == undefined) {
        Ext.getCmp('receipts-details-panel').setActiveTab(1);
        loadReceipts();
    }
    try {
        id = Ext.getCmp('receipt-list-grid').getSelectionModel().getSelected()
                .get('id');
        return id;
    } catch (e) {
        Ext.Msg
                .alert('Selection', 'Please select a receipt on \'Receipts\' table and try again.');
    }

    var idSel = Ext.getCmp('receipt-list-grid').getSelectionModel()
            .getSelected().get('id');
    console.log('>>>' + idSel);
    return idSel;

}

function getReceiptContainer(title, idComp, idIframe, url) {
    return new Ext.BoxComponent({

        id : id,// 'report-student-receipt'
        title : title, // 'Students Receipt'
        closable : true,
        autoEl : {
            tag : 'iframe',
            id : idIframe,// 'student-receipt-frame'
            closable : true,
            frameborder : '0',
            width : screen.width * (90 / 100),
            height : screen.height * (70 / 100),
            src : url,
            autoLoad : true,
            waitMsg : 'Loading report ...'
        },
        listeners : {
            afterrender : function() {
                console.log('rendered');

                this.getEl().on('load', function() {
                    console.log('loaded');
                    Ext.getCmp('tree-panel').getSelectionModel().select(Ext
                            .getCmp('tree-panel').getNodeById("absolute"));
                    Ext.getCmp('tree-panel').fireEvent('itemclick', null, Ext
                            .getCmp('tree-panel').getNodeById("absolute"));

                });
            }
        }
    })
}

function setStudentbalance() {
    var form = Ext.getCmp('student-fee-form').getForm();
    storeBalance.load({
        params : {
            id : getSelectedStudentRecord().get('id'),
            session : form.findField('session').getValue(),
            year : form.findField('year').getValue()
        }
    }

    );
}

function selectCurrentRow() {
    loadReceipts();
}

function setReceiptId(receiptId) {
    genReceiptId = receiptId;
}

function getReceiptId() {
    return genReceiptId;
}

function checkAmounts() {
    var total = 0.0;
    var size = Ext.getCmp('normal-grid-pay').getStore().data.items.length;
    for (var i = 0; i < size; i++) {
        var val = (Ext.getCmp('normal-grid-pay').getStore().data.items[i].data.paid);
        val = val + '';
        val = val.replace('-', '');
        if (val.length > 0) {
            total = total + parseFloat(val);
        }
    }
    console.log();
    return (total === parseFloat(Ext.getCmp('student-fee-form').getForm()
            .findField('amount').getValue()));
}

function spreadPayment() {
    var gridRI = Ext.getCmp('normal-grid-pay');
    var models = gridRI.getStore().getRange();
    var paymnts = Ext.getCmp('student-fee-form').getForm().findField('amount')
            .getValue();
    paymnt = parseFloat(paymnts);
    var size = models.length;
    for (var i = 0; i < size; i++) {
        var itemAmount = parseFloat(models[i].get('amount'));
        var balance = parseFloat(models[i].get('balance'));
        var isNn = isNaN(balance);
        if (isNn) {
            balance = 0;
        }
        if (paymnt >= itemAmount && balance < itemAmount) {
            console.log(paymnt + '>=' + itemAmount);
            if (itemAmount > balance) {
                itemAmount = itemAmount - balance;

            }
            models[i].set('paid', itemAmount);
            paymnt = paymnt - itemAmount;

        } else if (paymnt < itemAmount && paymnt > 0 && balance < itemAmount) {
            console.log(paymnt + '<&&>0' + itemAmount);
            if((itemAmount-balance) < paymnt && (itemAmount-balance) > 0){
               console.log('here were');
               itemAmount = itemAmount - balance;
               models[i].set('paid', itemAmount);
            }else{
               models[i].set('paid', paymnt);
             }
            console.log('2->here were');
            paymnt = paymnt - itemAmount;
            
            
            console.log('rem:' + paymnt);
        }
    }
    console.log('all payment spread::' + (paymnt == 0));
}