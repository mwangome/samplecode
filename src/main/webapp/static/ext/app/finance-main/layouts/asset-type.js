

var assetTypesSelectModel = new Ext.grid.CheckboxSelectionModel();

var assetTypesGridPanel = new Ext.grid.GridPanel(
        {
            store: assetTypeStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'assettypes-grid-panel',
            sm: assetTypesSelectModel,
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
                    text: 'Add Asset Type',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addAssetTypesWindow();

                    }

                }],
            columns: [assetTypesSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Asset Type Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'assetTypeName'
                }, {
                    header: 'Depreciation Rate',
                    width: 75,
                    sortable: true,
                    dataIndex: 'depreciationRate'
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
                store: assetTypeStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying type(s) {0} - {1} of {2}',
                emptyMsg: "No type(s) found"
            })
        });


assetTypesGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addAssetTypesWindow(id);

});



var assetTypesForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/assettype/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'assets-form',
    items: [{
            xtype: 'fieldset',
            title: 'Asset Types',
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
                    fieldLabel: 'Type Name',
                    name: 'assetTypeName'
                }, {
                    fieldLabel: 'Depr. Rate',
                    name: 'depreciationRate'
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
                var form = Ext.getCmp('assets-form').getForm();
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
                            assetTypeStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winAssetType.hide();
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
                winAssetType.hide();
            }
        }]
});

var winAssetType;
function addAssetTypesWindow(storeid) {
    if (!winAssetType) {
        winAssetType = new Ext.Window({
            title: 'Add Type',
            layout: 'fit',
            width: 500,
            height: 240,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: assetTypesForm
        });
    }
    winAssetType.show(this);

    Ext.getCmp('assets-form').getForm().reset();
    Ext.getCmp('assets-form').getForm().load({
        url: contextpath + '/assettype/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}




