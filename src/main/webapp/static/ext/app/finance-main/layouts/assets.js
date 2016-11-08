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


var assetStore = new Ext.data.JsonStore({
    id: 'assets-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/assets/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'assetNumber', 'assetName', 'purchaseDate', 'supplierName', 'assetValue', 'assetType', 'grnNumber', 'assetLocation']

});

assetStore.load({
    params: {
        _csrf: csrfToken
    }
});

payModesStore.load({
    params: {
        _csrf: csrfToken
    }
});

var assetSelectModel = new Ext.grid.CheckboxSelectionModel();

var assetGridPanel = new Ext.grid.GridPanel(
        {
            store: assetStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'asset-grid-panel',
            sm: assetSelectModel,
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
                    text: 'Acquire Asset',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addAssetWindow();

                    }

                },'-',{
                    xtype: 'button',
                    text: 'Asset Disposal',
                    iconCls: 'silk-cancel',
                    handler: function () {
                        var id = Ext.getCmp('asset-grid-panel').getSelectionModel().getSelected().get('id');
                        addAssetDisposalWindow(id);

                    }

                }],
            columns: [assetSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'id'
                }, {
                    header: 'Asset Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'assetNumber'
                }, {
                    header: 'Asset Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'assetName'
                }, {
                    header: 'Purchase Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'purchaseDate'
                }, {
                    header: 'Supplier Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'supplierName'
                }, {
                    header: 'Asset Value',
                    width: 75,
                    sortable: true,
                    dataIndex: 'assetValue'
                }, {
                    header: 'GRN Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'grnNumber'
                }, {
                    header: 'Asset Location',
                    width: 75,
                    sortable: true,
                    dataIndex: 'assetLocation'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: assetStore,
                displayInfo: true,
                displayMsg: 'Displaying asset(s) {0} - {1} of {2}',
                emptyMsg: "No asset(s) found"
            })
        });


assetGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addAssetWindow(id);

});



var assetForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/asset/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'asset-form',
    items: [{
            xtype: 'fieldset',
            title: 'Asset',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'Trans Ref',
                    allowBlank: false,
                    name: 'transRef'
                }, new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    fieldLabel: 'Entity Name',
                    id: 'smeentity-asset-combo',
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
                    fieldLabel: 'Asset Number',
                    allowBlank: false,
                    name: 'assetNumber'
                }, {
                    fieldLabel: 'Asset Name',
                    allowBlank: false,
                    name: 'assetName'
                }, {
                    fieldLabel: 'Purchase Date',
                    xtype: 'datefield',
                    allowBlank: false,
                    name: 'purchaseDate'
                }, new Ext.form.ComboBox({
                    store: suppliersStore,
                    fieldLabel: 'Supplier Name',
                    id: 'suppliers-assets-combo',
                    displayField: 'supplierName',
                    typeAhead: true,
                    name: 'supplierName',
                    allowBlank: false,
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Supplier...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: payModesStore,
                    fieldLabel: 'Mode',
                    id: 'assets-sale-combo',
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
                    fieldLabel: 'Asset Value',
                    name: 'assetValue',
                    allowBlank: false
                },{
                    fieldLabel: 'Lifespan',
                    name: 'lifespan'
                }, new Ext.form.ComboBox({
                    store: assetTypeStore,
                    fieldLabel: 'Asset Type',
                    id: 'assettype-store-combo',
                    displayField: 'assetTypeName',
                    typeAhead: true,
                    name: 'assetTypeName',
                    allowBlank: false,
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Type...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'GRN Number',
                    name: 'grnNumber'
                }, {
                    fieldLabel: 'Asset Location',
                    name: 'assetLocation'
                }, {
                    fieldLabel: 'Description',
                    xtype: 'textarea',
                    name: 'description'
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('asset-form').getForm();
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
                            assetStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winAsset.hide();
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
                winAsset.hide();
            }
        }]
});


var assetDisposalForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/assetdisposal/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'assetdisposal-form',
    items: [{
            xtype: 'fieldset',
            title: 'Asset',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [ {
                    fieldLabel: 'Description',
                    xtype: 'textarea',
                    hidden: true,
                    name: 'description'
                }, {
                    fieldLabel: 'GRN Number',
                    hidden: true,
                    name: 'grnNumber'
                }, {
                    fieldLabel: 'Asset Location',
                    hidden: true,
                    name: 'assetLocation'
                }, new Ext.form.ComboBox({
                    store: assetTypeStore,
                    fieldLabel: 'Asset Type',
                    id: 'assettypedispose-store-combo',
                    displayField: 'assetTypeName',
                    typeAhead: true,
                    hidden: true,
                    name: 'assetTypeName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Type...',
                    selectOnFocus: true
                }),new Ext.form.ComboBox({
                    store: suppliersStore,
                    fieldLabel: 'Supplier Name',
                    id: 'suppliers-assetsdisposal-combo',
                    displayField: 'supplierName',
                    typeAhead: true,
                    hidden: true,
                    name: 'supplierName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Supplier...',
                    selectOnFocus: true
                }),{
                    fieldLabel: 'Trans Ref',
                    name: 'transRef'
                }, new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    fieldLabel: 'Entity Name',
                    id: 'smeentity-assetdisposal-combo',
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
                    fieldLabel: 'Asset Number',
                    name: 'assetNumber'
                }, {
                    fieldLabel: 'Asset Name',
                    name: 'assetName'
                }, {
                    fieldLabel: 'Purchase Date',
                    xtype: 'datefield',
                    name: 'purchaseDate'
                }, new Ext.form.ComboBox({
                    store: assetCustomersStore,
                    fieldLabel: 'Customer Name',
                    id: 'customers-assets-combo',
                    displayField: 'customerName',
                    typeAhead: true,
                    name: 'customerName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Customer...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: payModesStore,
                    fieldLabel: 'Mode',
                    id: 'assetsdisposal-sale-combo',
                    displayField: 'payModeName',
                    typeAhead: true,
                    name: 'payModeName',
                    mode: 'local',
                    anchor: '95%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Payment Mode Name',
                    selectOnFocus: true
                }),{
                    fieldLabel: 'Lifespan',
                    name: 'lifespan'
                }, {
                    fieldLabel: 'Asset Value',
                    name: 'assetValue',
                    id: 'assetValue'
                },{
                    fieldLabel: 'Disposal Value',
                    name: 'disposalValue',
                    allowBlank: false,
                    id: 'disposalValue'
                },{
                    fieldLabel: 'Accumulated Depr.',
                    name: 'cumulativeDepreciation',
                    id: 'cumulativeDepreciation'
                },{
                    fieldLabel: 'Gain/Loss',
                    name: 'gainLoss',
                    id: 'gainLoss'
                }]
        }], listeners: {
                change: function () {
                    var assetValue = Ext.getCmp('assetValue').getValue();
                    var disposalValue = Ext.getCmp('disposalValue').getValue();
                    var cumulativeDepreciation = Ext.getCmp('cumulativeDepreciation').getValue();
                    if(assetValue.length > 0 && disposalValue.length > 0 && cumulativeDepreciation.length > 0){
                        var gainOrLoss = Number(disposalValue) + Number(cumulativeDepreciation) - Number(assetValue);
                        gainOrLoss = gainOrLoss.toFixed(2);
                        Ext.getCmp('gainLoss').setValue(gainOrLoss);
                    }

                }
            },
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('assetdisposal-form').getForm();
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
                            assetStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winAssetDisposal.hide();
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
                winAssetDisposal.hide();
            }
        }]
});


var winAsset;
function addAssetWindow(storeid) {
    if (!winAsset) {
        winAsset = new Ext.Window({
            title: 'Add Asset',
            layout: 'fit',
            width: 600,
            height: 540,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: assetForm
        });
    }
    winAsset.show(this);

    Ext.getCmp('asset-form').getForm().reset();
    Ext.getCmp('asset-form').getForm().load({
        url: contextpath + '/asset/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}


var winAssetDisposal;
function addAssetDisposalWindow(storeid) {
    if (!winAssetDisposal) {
        winAssetDisposal = new Ext.Window({
            title: 'Add Asset Disposal',
            layout: 'fit',
            width: 640,
            height: 500,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: assetDisposalForm
        });
    }
    winAssetDisposal.show(this);

    Ext.getCmp('assetdisposal-form').getForm().reset();
    Ext.getCmp('assetdisposal-form').getForm().load({
        url: contextpath + '/assetdisposal/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}




