stockItemsStore.on('load', function (ds, records, o) {
    Ext.getCmp('entity-combo-stock').setValue(records[0].data.registeredName);
});

stockItemsStore.load({
    params: {
        _csrf: csrfToken
    }
});

var stockItemsSelectModel = new Ext.grid.CheckboxSelectionModel();

var stockItemsGridPanel = new Ext.grid.GridPanel(
        {
            store: stockItemsStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'stockitems-grid-panel',
            sm: stockItemsSelectModel,
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
                    text: 'Add Stock',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addStockItemsWindow();

                    }

                }],
            columns: [stockItemsSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Stock Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'stockName'
                }, {
                    header: 'Stock Code',
                    width: 75,
                    sortable: true,
                    dataIndex: 'stockCode'
                }, {
                    header: 'Registered Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'registeredName'
                }, {
                    header: 'Unit of Issue',
                    width: 75,
                    sortable: true,
                    dataIndex: 'unitOfIssue'
                }, {
                    header: 'Is Vatable',
                    width: 85,
                    sortable: true,
                    dataIndex: 'vatable'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: stockItemsStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying stock(s) {0} - {1} of {2}',
                emptyMsg: "No stock(s) found"
            })
        });

stockItemsGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addStockItemsWindow(id);

});

var stockItemsForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/stockitem/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'stockitems-form',
    items: [{
            xtype: 'fieldset',
            title: 'Stock',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'Id',
                    name: 'id',
                    hidden: true
                }, {
                    fieldLabel: 'Stock Name',
                    name: 'stockName'
                }, {
                    fieldLabel: 'Stock Code',
                    name: 'stockCode'
                }, {
                    fieldLabel: 'Barcode',
                    name: 'barcode'
                }, new Ext.form.ComboBox({
                    store: uoiStore,
                    id: 'stockitems-combo-stock',
                    fieldLabel: 'Unit Name',
                    displayField: 'uoiName',
                    typeAhead: true,
                    name: 'uoiName',
                    mode: 'local',
                    anchor: '50%',
                    allowBlank: false,
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Unit...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    id: 'entity-combo-stock',
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
                }), new Ext.form.ComboBox({
                    store: industryGroups,
                    id: 'industrygroup-combo-stock',
                    fieldLabel: 'Industry Grp',
                    displayField: 'groupName',
                    typeAhead: true,
                    name: 'groupName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Industry ...',
                    selectOnFocus: true
                }), {
                    xtype: 'textarea',
                    fieldLabel: 'Description',
                    name: 'description'
                }, {
                    checked: true,
                    fieldLabel: 'Vatable',
                    xtype: 'checkbox',
                    labelSeparator: '',
                    boxLabel: 'Is Vatable',
                    name: 'vatable'
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('stockitems-form').getForm();
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
                            stockItemsStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winStockItem.hide();
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
                winStockItem.hide();
            }
        }]
});

var winStockItem;
function addStockItemsWindow(storeid) {
    if (!winStockItem) {
        winStockItem = new Ext.Window({
            title: 'Add Stock',
            layout: 'fit',
            width: 480,
            height: 370,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: stockItemsForm
        });
    }
    winStockItem.show(this);

    Ext.getCmp('stockitems-form').getForm().reset();
    Ext.getCmp('stockitems-form').getForm().load({
        url: contextpath + '/stockitem/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

