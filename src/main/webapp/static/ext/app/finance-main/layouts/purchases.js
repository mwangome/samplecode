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


smeEntitySiteStore.load();

stockItemsStore.load();

payModesStore.load();

var taxPurchases;

var purchasesForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/purchase/save.action?_csrf=' + csrfToken,
    method: 'POST',
    title: 'Purchases',
    frame: true,
    id: 'purchases-form',
    bodyStyle: 'padding:5px 5px 0',
    width: 350,
    items: [{
            xtype: 'fieldset',
            title: 'Purchase',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%',
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'Barcode',
                    name: 'barcode',
                    id: 'barcode-purchases',
                    listeners: {
                        specialkey: function (frm, evt) {
                            if (evt.getKey() == evt.ENTER) {
                                Ext.Ajax.request({
                                    url: contextpath + '/purchasebarcode/item.action',
                                    method: 'POST',
                                    params: {
                                        _csrf: csrfToken,
                                        barcode: Ext.getCmp('barcode-purchases').getValue()
                                    },
                                    success: function (obj, resp) {                                        
                                        Ext.getCmp('stocks-store-purchase-combo').setValue(obj.responseText)
                                    }, failure: function () {

                                    }
                                });
                            }
                        }
                    }
                }, {
                    fieldLabel: 'Invoice Number',
                    allowBlank: false,
                    name: 'invoiceNumber'
                }, {
                    fieldLabel: 'Document Name',
                    name: 'documentName'
                }, new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    fieldLabel: 'Entity Name',
                    id: 'smeentity-store-purchases-combo',
                    displayField: 'registeredName',
                    typeAhead: true,
                    name: 'registeredName',
                    hidden: true,
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Entity...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: stockItemsStore,
                    fieldLabel: 'Stock Name',
                    id: 'stocks-store-purchase-combo',
                    displayField: 'stockName',
                    typeAhead: true,
                    name: 'stockName',
                    allowBlank: false,
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Stock...',
                    selectOnFocus: true,
                    listeners: {
                        select: function (combo, record, index) {
                            console.log('is vatable::' + record.data.vatable + "::tax::" + record.data.tax);
                            if (record.data.vatable) {
                                Ext.getCmp('vat-purchase').setValue(record.data.tax);
                                Ext.getCmp('vat-purchase').setVisible(false);
                                taxPurchases = record.data.tax;
                            } else {
                                Ext.getCmp('vat-purchase').setValue('');
                                Ext.getCmp('vat-purchase').setVisible(false);
                            }

                        }
                    }
                }), new Ext.form.ComboBox({
                    store: suppliersStore,
                    fieldLabel: 'Supplier Name',
                    id: 'supplier-purchase-combo',
                    displayField: 'supplierName',
                    allowBlank: false,
                    typeAhead: true,
                    name: 'supplierName',
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Supplier...',
                    selectOnFocus: true//
                }), new Ext.form.ComboBox({
                    store: storesStore,
                    fieldLabel: 'Store Name',
                    id: 'stores-purchase-combo',
                    displayField: 'storeName',
                    allowBlank: false,
                    typeAhead: true,
                    name: 'storeName',
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Store...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: payModesStore,
                    fieldLabel: 'Mode',
                    id: 'paymentmode-purchase-combo',
                    displayField: 'payModeName',
                    typeAhead: true,
                    name: 'payModeName',
                    allowBlank: false,
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Payment Mode Name',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'Purchase Date',
                    name: 'purchaseDate',
                    allowBlank: false,
                    xtype: 'datefield'
                }, {
                    fieldLabel: 'Quantity',
                    name: 'quantity',
                    allowBlank: false,
                    id: 'quantityPurchase'
                }, {
                    fieldLabel: 'Unit Cost',
                    name: 'unitCost',
                    allowBlank: false,
                    id: 'unitCost'
                }, {
                    fieldLabel: 'GRN Number',
                    name: 'grnNumber'
                }, {
                    fieldLabel: 'Purchase Value',
                    name: 'purchaseValue',
                    allowBlank: false,
                    id: 'purchaseValue'
                }, {
                    fieldLabel: 'Other charges',
                    name: 'carriageInwards',
                    id: 'carriageInwards'
                }, {
                    fieldLabel: 'Id',
                    hidden: true,
                    name: 'id'
                }, {
                    fieldLabel: 'VAT',
                    name: 'vat',
                    hidden: true,
                    id: 'vat-purchase'
                }]
        }], listeners: {
        change: function () {
            var unitCost = Ext.getCmp('unitCost').getValue();
            var quantity = Ext.getCmp('quantityPurchase').getValue();
            if (unitCost.length > 0 && quantity.length > 0) {
                Ext.getCmp('purchaseValue').setValue(quantity * unitCost);
                console.log('changes detected!');
            }
            var val = taxPurchases;
            if (Number(val) > 0) {
                val = (val / (val + 100)) * quantity * unitCost;
                console.log('tax::' + val);
                Ext.getCmp('vat-purchase').setValue(val);
                Ext.getCmp('vat-purchase').setVisible(true);
            }

        }
    },
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('purchases-form').getForm();
                var ci = form.findField('carriageInwards').getValue();
                if (ci.length === 0) {
                    form.findField('carriageInwards').setValue(0);
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
                            purchasesStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winPurchases.hide();
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
                winPurchases.hide();
            }
        }]
});


var purchasesSelectModel = new Ext.grid.CheckboxSelectionModel();

var purchasesGridPanel = new Ext.grid.GridPanel(
        {
            store: purchasesStore,
            height: 200,
            title: 'Purchases',
            minSize: 75,
            maxSize: 250,
            id: 'purchases-grid-panel',
            sm: purchasesSelectModel,
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
                    text: 'Purchase Stock',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addPurchasesWindow();

                    }

                }, {
                    xtype: 'button',
                    text: 'Pay for credit purchases',
                    iconCls: 'silk-money',
                    handler: function () {
                        addPaymentsWindow(-1, 'GENERAL');
                        formDisplay('Item');
                        Ext.getCmp('combo-payment-expense-item').setValue('Item');

                    }

                }],
            columns: [purchasesSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'id'
                }, {
                    header: 'Barcode',
                    width: 75,
                    sortable: true,
                    dataIndex: 'barcode'
                }, {
                    header: 'GRN Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'grnNumber'
                }, {
                    header: 'Payment Mode Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'payModeName'
                }, {
                    header: 'Invoice Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'invoiceNumber'
                }, {
                    header: 'Purchase Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'purchaseDate'
                }, {
                    header: 'Quantity',
                    width: 75,
                    sortable: true,
                    dataIndex: 'quantity'
                }, {
                    header: 'Unit Cost',
                    width: 75,
                    sortable: true,
                    dataIndex: 'unitCost'
                }, {
                    header: 'Value',
                    width: 75,
                    sortable: true,
                    dataIndex: 'purchaseValue'
                }, {
                    header: 'Supplier Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'supplierName'
                }, {
                    header: 'storeName',
                    width: 75,
                    sortable: true,
                    dataIndex: 'storeName'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: purchasesStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying purchase(s) {0} - {1} of {2}',
                emptyMsg: "No purchase(s) found"
            })
        });

//purchasesStore.load();



// var runner = new Ext.util.TaskRunner(),
//            task = runner.start({
//                run: function() {
//                    purchasesStore.reload();
//                },
//                interval: 10000
//            });
//
//        // IMPORTANT: Dont forget to call stop at a logical point.
//        runner.stop();


purchasesGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addPurchasesWindow(id);

});

var winPurchases;
function addPurchasesWindow(id) {
    if (!winPurchases) {
        winPurchases = new Ext.Window({
            title: 'Add Purchases',
            layout: 'fit',
            width: 600,
            height: 530,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: [new Ext.TabPanel({
                    autoTabs: true,
                    activeTab: 0,
                    deferredRender: false,
                    border: false,
                    items: [purchasesForm]
                })]
        });
    }
    winPurchases.show(this);

    Ext.getCmp('purchases-form').getForm().reset();
    Ext.getCmp('purchases-form').getForm().load({
        url: contextpath + '/purchase/formview.action',
        params: {
            id: id,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}