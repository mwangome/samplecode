var accessibilityTypeStore = new Ext.data.JsonStore({
    id: 'accessibilitytypes-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/accessibilitytypes/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'accessibilityCode', 'accessibilityName']

});

accessibilityTypeStore.load({
    params: {
        _csrf: csrfToken
    }
});

var accessibilityTypesModel = new Ext.grid.CheckboxSelectionModel();

var accessibilityTypesGridPanel = new Ext.grid.GridPanel(
        {
            store: accessibilityTypeStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'accessibilitytypes-grid-panel',
            sm: accessibilityTypesModel,
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
                    text: 'Add Accessibility Type',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addAccessibilityTypesWindow();

                    }

                }],
            columns: [accessibilityTypesModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Accessibility Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'accessibilityName'
                },{
                    header: 'Accessibility Code',
                    width: 75,
                    sortable: true,
                    dataIndex: 'accessibilityCode'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: accessibilityTypeStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying type(s) {0} - {1} of {2}',
                emptyMsg: "No type(s) found"
            })
        });
        
        
accessibilityTypesGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');                
    addAccessibilityTypesWindow(id);
          
});



var accessibilityTypesForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/accessibilitytype/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'accessibilitytypes-form',
    items: [{
            xtype: 'fieldset',
            title: 'Accessibility Types',
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
                    fieldLabel: 'Code',
                    name: 'accessibilityCode'
                },{
                    fieldLabel: 'Name',
                    name: 'accessibilityName'
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('accessibilitytypes-form').getForm();
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
                            accessibilityTypeStore.load({
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
                winAccessibilityType.hide();
            }
        }]
});

var winAccessibilityType;
function addAccessibilityTypesWindow(storeid) {
    if (!winAccessibilityType) {
        winAccessibilityType = new Ext.Window({
            title: 'Add Type',
            layout: 'fit',
            width: 460,
            height: 200,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: accessibilityTypesForm
        });
    }
    winAccessibilityType.show(this);

    Ext.getCmp('accessibilitytypes-form').getForm().reset();
    Ext.getCmp('accessibilitytypes-form').getForm().load({
        url: contextpath + '/accessibilitytype/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

