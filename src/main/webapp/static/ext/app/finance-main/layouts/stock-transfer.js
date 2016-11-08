var transfersStore = new Ext.data.JsonStore({
    id: 'transfers-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/transfers/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'storeFromName', 'storeToName', 'createdBy', 'receivedBy', 
        'receiptDate', 'transferDate', 'stockName', 'deliveryNote', 'receiptNote', 'quantity']

});


smeEntitySiteStore.on('load', function (ds, records, o) {
    
});

smeEntitySiteStore.load();

stockItemsStore.load();

var transfersForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/transfer/save.action?_csrf=' + csrfToken,
    method: 'POST',
    title: 'Transfers',
    frame: true,
    id: 'transfers-form',
    bodyStyle: 'padding:5px 5px 0',
    width: 350,
    items: [{
            xtype: 'fieldset',
            title: 'Transfer',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%',
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'Transfer Date',
                    name: 'transferDate',
                    xtype: 'datefield'
                }, new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    fieldLabel: 'Entity Name',
                    id: 'stocktransfer-smeentity-combo',
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
                    id: 'stocks-stocktransfers-combo',
                    displayField: 'stockName',
                    typeAhead: true,
                    name: 'stockName',
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Stock...',
                    selectOnFocus: true
                }),  new Ext.form.ComboBox({
                    store: storesStore,
                    fieldLabel: 'Store From',
                    id: 'transfers-storefrom-combo',
                    displayField: 'storeName',
                    typeAhead: true,
                    name: 'storeFromName',
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Store...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: storesStore,
                    fieldLabel: 'Store To',
                    id: 'transfers-storeto-combo',
                    displayField: 'storeName',
                    typeAhead: true,
                    name: 'storeToName',
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Store...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'Quantity',
                    name: 'quantity'
                }, {
                    fieldLabel: 'Delivery Note',
                    name: 'deliveryNote'
                }, {
                    fieldLabel: 'Receipt Note',
                    name: 'receiptNote'
                }, {
                    fieldLabel: 'Created By',
                    name: 'createdBy'
                }, {
                    fieldLabel: 'Received By',
                    name: 'receivedBy'
                },{
                    fieldLabel: 'Receipt Date',
                    name: 'receiptDate',
                    xtype: 'datefield'
                }, {
                    fieldLabel: 'Id',
                    hidden: true,
                    name: 'id'
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function(){
                var form = Ext.getCmp('transfers-form').getForm();
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
                            transfersStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                        }, failure: function (response, obj) {
                            console.log(obj);
                            var res = obj.response.responseText;
                            try {
                                res = Ext.decode(obj.response.responseText);
                            } catch (e) {
                                console.log(e);
                            }
                            if ((res.toString()).includes('Access is denied')) {
                                Ext.Msg.show({
                                    title: 'Server Alert',
                                    msg: 'Sorry, you do not have access rights for this action!',
                                    icon: Ext.Msg.WARNING,
                                    buttons: Ext.Msg.OK
                                });
                            } else {
                                Ext.Msg.show({
                                    title: 'Save attempt failed!',
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
            handler: function(){
                winTransfers.hide();
            }
        }]
});





var transfersSelectModel = new Ext.grid.CheckboxSelectionModel();

var transfersGridPanel = new Ext.grid.GridPanel(
        {
            store: transfersStore,
            height: 200,
            title: 'Transfers',
            minSize: 75,
            maxSize: 250,
            id: 'transfers-grid-panel',
            sm: transfersSelectModel,
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
                    text: 'Transfer Stock',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addTransfersWindow();

                    }

                }],
            columns: [transfersSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'id'
                }, {
                    header: 'Store From',
                    width: 75,
                    sortable: true,
                    dataIndex: 'storeFromName'
                }, {
                    header: 'Store To',
                    width: 75,
                    sortable: true,
                    dataIndex: 'storeToName'
                }, {
                    header: 'Date Received',
                    width: 75,
                    sortable: true,
                    dataIndex: 'receiptDate'
                }, {
                    header: 'Received By',
                    width: 75,
                    sortable: true,
                    dataIndex: 'receivedBy'
                }, {
                    header: 'Receipt Note',
                    width: 75,
                    sortable: true,
                    dataIndex: 'receiptNote'
                }, {
                    header: 'Delivery Note',
                    width: 75,
                    sortable: true,
                    dataIndex: 'deliveryNote'
                }, {
                    header: 'Stock Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'stockName'
                }, {
                    header: 'Quantity',
                    width: 75,
                    sortable: true,
                    dataIndex: 'quantity'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: transfersStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying transfer(s) {0} - {1} of {2}',
                emptyMsg: "No transfer(s) found"
            })
        });
        
transfersStore.load();

transfersGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addTransfersWindow(id);

});

var winTransfers;
function addTransfersWindow(id) {
    if (!winTransfers) {
        winTransfers = new Ext.Window({
            title: 'Add Transfers',
            layout: 'fit',
            width: 600,
            height: 450,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: [ new Ext.TabPanel({
                    autoTabs: true,
                    activeTab: 0,
                    deferredRender: false,
                    border: false,
                    items:[transfersForm]
                })]
        });
    }
    winTransfers.show(this);

    Ext.getCmp('transfers-form').getForm().reset();
    Ext.getCmp('transfers-form').getForm().load({
        url: contextpath + '/transfer/formview.action',
        params: {
            id: id,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}