leaseTypeStore.load({
    params: {
        _csrf: csrfToken
    }
});

var leaseTypesSelectModel = new Ext.grid.CheckboxSelectionModel();

var leaseTypesGridPanel = new Ext.grid.GridPanel(
        {
            store: leaseTypeStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'leasetypes-grid-panel',
            sm: leaseTypesSelectModel,
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
                    text: 'Add Lease Type',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addLeaseTypesWindow();

                    }

                }],
            columns: [leaseTypesSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Lease Type Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'leaseTypeName'
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
                store: leaseTypeStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying type(s) {0} - {1} of {2}',
                emptyMsg: "No type(s) found"
            })
        });


leaseTypesGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addLeaseTypesWindow(id);

});



var leaseTypesForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/leasetype/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'leasetype-form',
    items: [{
            xtype: 'fieldset',
            title: 'Lease Types',
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
                    name: 'leaseTypeName'
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
                var form = Ext.getCmp('leasetype-form').getForm();
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
                            leaseTypeStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winLeaseType.hide();
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
                winLeaseType.hide();
            }
        }]
});

var winLeaseType;
function addLeaseTypesWindow(storeid) {
    if (!winLeaseType) {
        winLeaseType = new Ext.Window({
            title: 'Add Type',
            layout: 'fit',
            width: 460,
            height: 240,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: leaseTypesForm
        });
    }
    winLeaseType.show(this);

    Ext.getCmp('leasetype-form').getForm().reset();
    Ext.getCmp('leasetype-form').getForm().load({
        url: contextpath + '/leasetype/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}




