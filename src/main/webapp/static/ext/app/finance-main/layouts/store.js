/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




storesStore.load({
    params: {
        _csrf: csrfToken
    }
});

var storesSelectModel = new Ext.grid.CheckboxSelectionModel();

var storesGridPanel = new Ext.grid.GridPanel(
        {
            store: storesStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'stores-grid-panel',
            sm: storesSelectModel,
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
                    text: 'Add Store',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addStoresWindow();

                    }

                }],
            columns: [storesSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Store Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'storeName'
                },{
                    header: 'Store Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'storeNumber'
                }, {
                    header: 'Store Location',
                    width: 75,
                    sortable: true,
                    dataIndex: 'storeLocation'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: storesStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying store(s) {0} - {1} of {2}',
                emptyMsg: "No store(s) found"
            })
        });
        
        
storesGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');                
    addStoresWindow(id);
          
});



var storesForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/store/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'stores-form',
    items: [{
            xtype: 'fieldset',
            title: 'Store',
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
                    fieldLabel: 'Name',
                    name: 'storeName'
                },{
                    fieldLabel: 'Number',
                    name: 'storeNumber'
                },{
                    fieldLabel: 'Location',
                    name: 'storeLocation'
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('stores-form').getForm();
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
                            storesStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winStores.hide();
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
                winStores.hide();
            }
        }]
});

var winStores;
function addStoresWindow(storeid) {
    if (!winStores) {
        winStores = new Ext.Window({
            title: 'Add Store',
            layout: 'fit',
            width: 460,
            height: 230,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: storesForm
        });
    }
    winStores.show(this);

    Ext.getCmp('stores-form').getForm().reset();
    Ext.getCmp('stores-form').getForm().load({
        url: contextpath + '/store/getstore-in-form.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

