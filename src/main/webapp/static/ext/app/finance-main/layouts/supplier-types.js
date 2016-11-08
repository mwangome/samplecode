var supplierTypesStore = new Ext.data.JsonStore({
    id: 'suppliertype-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/suppliertypes/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'typeName', 'supplierType',  'registeredName']

});


supplierTypesStore.load({
    params: {
        _csrf: csrfToken
    }
});

var supplierTypesSelectModel = new Ext.grid.CheckboxSelectionModel();

var supplierTypesGridPanel = new Ext.grid.GridPanel(
        {
            store: supplierTypesStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'suppliertypes-grid-panel',
            sm: supplierTypesSelectModel,
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
                    text: 'Add Supplier Type',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addSupplierTypesWindow();

                    }

                }],
            columns: [supplierTypesSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Supplier Type',
                    width: 75,
                    sortable: true,
                    dataIndex: 'supplierType'
                },{
                    header: 'Type Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'typeName'
                }, {
                    header: 'Registered Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'registeredName'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: supplierTypesStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying type(s) {0} - {1} of {2}',
                emptyMsg: "No type(s) found"
            })
        });
        
        
supplierTypesGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');                
    addSupplierTypesWindow(id);
          
});



var supplierTypesForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/suppliertype/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'suppliertypes-form',
    items: [{
            xtype: 'fieldset',
            title: 'Supplier Type',
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
                    fieldLabel: 'Supplier Type',
                    name: 'supplierType'
                },{
                    fieldLabel: 'Type Name',
                    name: 'typeName'
                },new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    id: 'suppliertypes-combo-stock',
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
                })]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('suppliertypes-form').getForm();
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
                            supplierTypesStore.load({
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
                winSupplierTypes.hide();
            }
        }]
});

var winSupplierTypes;
function addSupplierTypesWindow(storeid) {
    if (!winSupplierTypes) {
        winSupplierTypes = new Ext.Window({
            title: 'Add Supplier Type',
            layout: 'fit',
            width: 460,
            height: 230,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: supplierTypesForm
        });
    }
    winSupplierTypes.show(this);

    Ext.getCmp('suppliertypes-form').getForm().reset();
    Ext.getCmp('suppliertypes-form').getForm().load({
        url: contextpath + '/suppliertype/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

