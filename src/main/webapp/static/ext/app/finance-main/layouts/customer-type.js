var customerTypeStore = new Ext.data.JsonStore({
    id: 'customertypes-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/customertypes/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'customerTypeName', 'createdAt', 'createdBy']

});

customerTypeStore.load({
    params: {
        _csrf: csrfToken
    }
});

var customerTypesSelectModel = new Ext.grid.CheckboxSelectionModel();

var customerTypesGridPanel = new Ext.grid.GridPanel(
        {
            store: customerTypeStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'customertypes-grid-panel',
            sm: customerTypesSelectModel,
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
                    text: 'Add Customer Type',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addCustomerTypesWindow();

                    }

                }],
            columns: [customerTypesSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Customer Type Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'customerTypeName'
                }, {
                    header: 'Created On',
                    width: 75,
                    sortable: true,
                    dataIndex: 'createdAt'
                }, {
                    header: 'Created By',
                    width: 75,
                    sortable: true,
                    dataIndex: 'createdBy'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: customerTypeStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying type(s) {0} - {1} of {2}',
                emptyMsg: "No type(s) found"
            })
        });


customerTypesGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addCustomerTypesWindow(id);

});



var customerTypesForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/customertype/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'customertype-form',
    items: [{
            xtype: 'fieldset',
            title: 'Customer Types',
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
                    name: 'customerTypeName'
                }, {
                    fieldLabel: 'Created On',
                    xtype: 'datefield',
                    name: 'createdAt'
                }, {
                    fieldLabel: 'Created By',
                    name: 'createdBy'
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('customertype-form').getForm();
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
                            customerTypeStore.load({
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
                winCustomerType.hide();
            }
        }]
});

var winCustomerType;
function addCustomerTypesWindow(storeid) {
    if (!winCustomerType) {
        winCustomerType = new Ext.Window({
            title: 'Add Type',
            layout: 'fit',
            width: 460,
            height: 230,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: customerTypesForm
        });
    }
    winCustomerType.show(this);

    Ext.getCmp('customertype-form').getForm().reset();
    Ext.getCmp('customertype-form').getForm().load({
        url: contextpath + '/customertype/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}




