var receiptsStore = new Ext.data.JsonStore({
    id: 'receipts-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/receipts/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'registeredName',  'receiptRef', 'receiptDate', 
        'receiptMode', 'salesRefNumber', 'receiptAmt', 'createdAt', 
        'isActive']

});

receiptsStore.load({
    params: {
        _csrf: csrfToken
    }
});

paymentsStore.load({
    params: {
        _csrf: csrfToken
    }
});

var receiptsSelectModel = new Ext.grid.CheckboxSelectionModel();

var receiptsGridPanel = new Ext.grid.GridPanel(
        {
            store: receiptsStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'receipts-grid-panel',
            sm: receiptsSelectModel,
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
                    text: 'Add Receipt',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addReceiptsWindow();

                    }

                }],
            columns: [receiptsSelectModel, {
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
                    header: 'Receipt Ref',
                    width: 75,
                    sortable: true,
                    dataIndex: 'receiptRef'
                }, {
                    header: 'Receipt Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'receiptDate'
                }, {
                    header: 'Receipt Mode',
                    width: 75,
                    sortable: true,
                    dataIndex: 'receiptMode'
                }, {
                    header: 'Invoice Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'salesRefNumber'
                }, {
                    header: 'Receipt Amt',
                    width: 75,
                    sortable: true,
                    dataIndex: 'receiptAmt'
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
                store: receiptsStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying receipt(s) {0} - {1} of {2}',
                emptyMsg: "No receipt(s) found"
            })
        });


receiptsGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addReceiptsWindow(id);

});



var receiptsForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/receipt/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'receipts-form',
    items: [{
            xtype: 'fieldset',
            title: 'Receipt',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    fieldLabel: 'Entity Name',
                    id: 'smeentity-receipts-combo',
                    displayField: 'registeredName',
                    typeAhead: true,
                    name: 'registeredName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Entity...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'Id',
                    name: 'id',
                    hidden: true
                }, {
                    fieldLabel: 'Receipt Date',
                    xtype: 'datefield',
                    name: 'receiptDate'
                }, {
                    fieldLabel: 'Receipt Mode',
                    name: 'receiptMode'
                }, {
                    fieldLabel: 'Receipt Ref',
                    name: 'receiptRef'
                }, new Ext.form.ComboBox({
                    store: salesStore,
                    fieldLabel: 'Invoice Ref.',
                    id: 'salesrefnumber-receipt-combo',
                    displayField: 'salesRefNumber',
                    typeAhead: true,
                    allowBlank: false,
                    name: 'salesRefNumber',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select Invoice...',
                    selectOnFocus: true
                }),{
                    fieldLabel: 'Receipt Amt',
                    name: 'receiptAmt'
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
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('receipts-form').getForm();
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
                            receiptsStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winReceipt.hide();
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
                winReceipt.hide();
            }
        }]
});

var winReceipt;
function addReceiptsWindow(storeid) {
    if (!winReceipt) {
        winReceipt = new Ext.Window({
            title: 'Add Receipt',
            layout: 'fit',
            width: 460,
            height: 330,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: receiptsForm
        });
    }
    winReceipt.show(this);

    Ext.getCmp('receipts-form').getForm().reset();
    Ext.getCmp('receipts-form').getForm().load({
        url: contextpath + '/receipt/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}




