/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

payModesStore.load({
    params: {
        _csrf: csrfToken
    }
});

var payModesSelectModel = new Ext.grid.CheckboxSelectionModel();

var payModesGridPanel = new Ext.grid.GridPanel(
        {
            store: payModesStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'paymodes-grid-panel',
            sm: payModesSelectModel,
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
                    text: 'Add Payment Mode',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addPayModesWindow();

                    }

                }],
            columns: [payModesSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Payment Mode',
                    width: 75,
                    sortable: true,
                    dataIndex: 'payMode'
                }, {
                    header: 'Payment Mode Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'payModeName'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: payModesStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying mode(s) {0} - {1} of {2}',
                emptyMsg: "No mode(s) found"
            })
        });


payModesGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addPayModesWindow(id);

});



var payModesForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/paymode/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'paymodes-form',
    items: [{
            xtype: 'fieldset',
            title: 'Payment Mode',
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
                    fieldLabel: 'Mode',
                    name: 'payMode'
                }, {
                    fieldLabel: 'Mode Name',
                    name: 'payModeName'
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('paymodes-form').getForm();
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
                            payModesStore.load({
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
                winPayMode.hide();
            }
        }]
});

var winPayMode;
function addPayModesWindow(storeid) {
    if (!winPayMode) {
        winPayMode = new Ext.Window({
            title: 'Add Payment Mode',
            layout: 'fit',
            width: 460,
            height: 200,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: payModesForm
        });
    }
    winPayMode.show(this);

    Ext.getCmp('paymodes-form').getForm().reset();
    Ext.getCmp('paymodes-form').getForm().load({
        url: contextpath + '/paymode/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

