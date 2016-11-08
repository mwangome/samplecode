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


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var transactionTypeStore = new Ext.data.JsonStore({
    id: 'transactiontype-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/transactiontypes/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'tranName', 'TranshortName', 'createdAt', 'isActive']

});


transactionTypeStore.load({
    params: {
        _csrf: csrfToken
    }
});

var transactionTypeSelectModel = new Ext.grid.CheckboxSelectionModel();

var transactionTypeGridPanel = new Ext.grid.GridPanel(
        {
            store: transactionTypeStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'transactiontype-grid-panel',
            sm: transactionTypeSelectModel,
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
                    text: 'Add Transaction Type',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addTransactionTypeWindow();

                    }

                }],
            columns: [transactionTypeSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Type Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'tranName'
                },{
                    header: 'Short Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'tranShortName'
                }, {
                    header: 'Created On',
                    width: 75,
                    sortable: true,
                    dataIndex: 'createdAt'
                }, {
                    header: 'Is Active',
                    width: 85,
                    sortable: true,
                    dataIndex: 'isActive'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: transactionTypeStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying type(s) {0} - {1} of {2}',
                emptyMsg: "No type(s) found"
            })
        });



var transactionTypeForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/transactiontype/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'transactiontype-form',
    items: [{
            xtype: 'fieldset',
            title: 'Transaction Type',
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
                    name: 'tranName'
                },{
                    fieldLabel: 'Short Name',
                    name: 'tranShortName'
                },{
                    fieldLabel: 'Created On',
                    name: 'createdAt',
                    xtype: 'datefield'
                },{
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
                var form = Ext.getCmp('transactiontype-form').getForm();
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
                            transactionTypeStore.load({
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
                winTransactionType.hide();
            }
        }]
});

var winTransactionType;
function addTransactionTypeWindow(lineOfBusinessId) {
    if (!winTransactionType) {
        winTransactionType = new Ext.Window({
            title: 'Add Transaction Type',
            layout: 'fit',
            width: 460,
            height: 250,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: transactionTypeForm
        });
    }
    winTransactionType.show(this);

    Ext.getCmp('transactiontype-form').getForm().reset();
    Ext.getCmp('transactiontype-form').getForm().load({
        url: contextpath + '/getuser-in-form.action',
        params: {
            id: lineOfBusinessId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

