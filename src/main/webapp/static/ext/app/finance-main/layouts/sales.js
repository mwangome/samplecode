/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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

var taxSales;
smeEntitySiteStore.on('load', function (ds, records, o) {
    Ext.getCmp('smeentity-store-sales-combo').setValue(records[0].data.registeredName);
});

smeEntitySiteStore.load();

stockItemsStore.load();

var salesForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/sale/save.action?_csrf=' + csrfToken,
    method: 'POST',
    frame: true,
    id: 'sales-form',
    bodyStyle: 'padding:5px 5px 0',
    width: 350,
    items: [{
            xtype: 'fieldset',
            title: 'Sale',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%',
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'Barcode',
                    name: 'barcode',
                    id: 'barcode-sales',
                    listeners: {
                        specialkey: function (frm, evt) {
                            if (evt.getKey() == evt.ENTER) {
                                Ext.Ajax.request({
                                    url: contextpath + '/purchasebarcode/item.action',
                                    method: 'POST',
                                    params: {
                                        _csrf: csrfToken,
                                        barcode: Ext.getCmp('barcode-sales').getValue()
                                    },
                                    success: function (obj, resp) {                                        
                                        Ext.getCmp('stocks-store-sale-combo').setValue(obj.responseText)
                                    }, failure: function () {

                                    }
                                });
                            }
                        }
                    }
                },{
                    fieldLabel: 'Sales Ref No',
                    allowBlank: false,
                    name: 'salesRefNumber'
                }, new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    fieldLabel: 'Entity Name',
                    id: 'smeentity-store-sales-combo',
                    displayField: 'registeredName',
                    typeAhead: true,
                    name: 'registeredName',
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Entity...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: stockItemsStore,
                    fieldLabel: 'Stock Name',
                    id: 'stocks-store-sale-combo',
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
                            if(record.data.vatable){
                                Ext.getCmp('vat-sales').setValue(record.data.tax);
                                Ext.getCmp('vat-sales').setVisible(false);
                                taxSales = record.data.tax;
                            }else{
                                Ext.getCmp('vat-sales').setValue('');
                                Ext.getCmp('vat-sales').setVisible(false);
                            }
                                
                        }
                    }
                }), new Ext.form.ComboBox({
                    store: customersStore,
                    fieldLabel: 'Customer Name',
                    id: 'customer-sales-combo',
                    displayField: 'customerName',
                    typeAhead: true,
                    name: 'customerName',
                    allowBlank: false,
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Customer...',
                    selectOnFocus: true//
                }), new Ext.form.ComboBox({
                    store: storesStore,
                    fieldLabel: 'Store Name',
                    id: 'stores-sale-combo',
                    displayField: 'storeName',
                    typeAhead: true,
                    allowBlank: false,
                    name: 'storeName',
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Store...',
                    selectOnFocus: true
                }),new Ext.form.ComboBox({
                    store: payModesStore,
                    fieldLabel: 'Mode',
                    id: 'paymentmode-sale-combo',
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
                    fieldLabel: 'Sale Date',
                    name: 'saleDate',
                    allowBlank: false,
                    xtype: 'datefield'
                }, {
                    fieldLabel: 'Quantity',
                    allowBlank: false,
                    name: 'quantity',
                    id: 'quantity'
                }, {
                    fieldLabel: 'Unit Price',
                    allowBlank: false,
                    name: 'unitPrice',
                    id: 'unitPrice'
                }, {
                    fieldLabel: 'Delivery Note',
                    name: 'deliveryNote'
                }, {
                    fieldLabel: 'Sale Value',
                    name: 'salesValue',
                    allowBlank: false,
                    id: 'salesValue'
                }, {
                    fieldLabel: 'Id',
                    hidden: true,
                    name: 'id'
                }, {
                    fieldLabel: 'VAT',
                    name: 'vat',
                    hidden: true,
                    id: 'vat-sales'
                }]
        }], listeners: {
                change: function () {
                    var unitPrice = Ext.getCmp('unitPrice').getValue();
                    var quantity = Ext.getCmp('quantity').getValue();
                    if(unitPrice.length > 0 && quantity.length > 0){
                        Ext.getCmp('salesValue').setValue(quantity * unitPrice);
                        console.log('changes detected!');
                    }
                    var val = taxSales;
            if(Number(val) > 0){
                val = (val/(val + 100)) * quantity * unitPrice;
                console.log('tax::' + val);
                Ext.getCmp('vat-sales').setValue(val);
                Ext.getCmp('vat-sales').setVisible(true);
            }

                }
            },
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function(){
                var form = Ext.getCmp('sales-form').getForm();
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
                            salesStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winSales.hide();
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
            iconCls:'silk-application-delete',
            handler: function(){
                winSales.hide();
            }
        }]
});





var salesSelectModel = new Ext.grid.CheckboxSelectionModel();

var salesGridPanel = new Ext.grid.GridPanel(
        {
            store: salesStore,
            height: 200,
            title: 'Sales',
            minSize: 75,
            maxSize: 250,
            id: 'sales-grid-panel',
            sm: salesSelectModel,
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
                    text: 'Sale Stock',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addSalesWindow();

                    }

                }, '-', {
                    xtype: 'button',
                    text: 'Add Receipt',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addReceiptsWindow();

                    }

                }],
            columns: [salesSelectModel, {
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
                },{
                    header: 'Sales Ref Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'salesRefNumber'
                }, {
                    header: 'Payment Mode Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'payModeName'
                },{
                    header: 'Quantity',
                    width: 75,
                    sortable: true,
                    dataIndex: 'quantity'
                }, {
                    header: 'Sales Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'saleDate'
                }, {
                    header: 'Unit Price',
                    width: 75,
                    sortable: true,
                    dataIndex: 'unitPrice'
                }, {
                    header: 'Customer Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'customerName'
                }, {
                    header: 'storeName',
                    width: 75,
                    sortable: true,
                    dataIndex: 'storeName'
                }, {
                    header: 'Delivery Note',
                    width: 75,
                    sortable: true,
                    dataIndex: 'deliveryNote'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: salesStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying sale(s) {0} - {1} of {2}',
                emptyMsg: "No sale(s) found"
            })
        });

salesStore.load();

salesGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addSalesWindow(id);

});




var winSales;
function addSalesWindow(id) {
    if (!winSales) {
        winSales = new Ext.Window({
            title: 'Add Sales',
            layout: 'fit',
            width: 600,
            height: 450,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: salesForm
        });
    }
    winSales.show(this);

    Ext.getCmp('sales-form').getForm().reset();
    Ext.getCmp('sales-form').getForm().load({
        url: contextpath + '/sale/formview.action',
        params: {
            id: id,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

