/*
 * 
 * @author=derek
 */
var taxStore = new Ext.data.JsonStore({
    id: 'tax-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/tax/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'tax', 'taxType', 'createdAt', 'isActive']

});

taxStore.load({
    params: {
        _csrf: csrfToken
    }
});

var vatTypesStore = new Ext.data.ArrayStore({
    fields: ['taxType'],
    data: [['VAT'],
        ['Corporate']] // from states.js
});
var taxCombo = new Ext.form.ComboBox({
    fieldLabel: 'Tax Type',
    store: vatTypesStore,
    displayField: 'taxType',
    name: 'taxType',
    typeAhead: true,
    mode: 'local',
    anchor: '95%',
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select a tax...',
    selectOnFocus: true
});


var taxSelectModel = new Ext.grid.CheckboxSelectionModel();

var taxGridPanel = new Ext.grid.GridPanel(
        {
            store: taxStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'tax-grid-panel',
            sm: taxSelectModel,
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
                    text: 'Add Tax',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addTaxWindow();

                    }

                }],
            columns: [taxSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Tax Type',
                    width: 75,
                    sortable: true,
                    dataIndex: 'taxType'
                }, {
                    header: 'Tax',
                    width: 75,
                    sortable: true,
                    dataIndex: 'tax'
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
                store: taxStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying tax(es) {0} - {1} of {2}',
                emptyMsg: "No tax(es) found"
            })
        });



var taxForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/tax/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'tax-form',
    items: [{
            xtype: 'fieldset',
            title: 'Tax',
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
                }, taxCombo, {
                    fieldLabel: 'Tax',
                    name: 'tax'
                }, {
                    fieldLabel: 'Created On',
                    name: 'createdAt',
                    xtype: 'datefield'
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
                var form = Ext.getCmp('tax-form').getForm();
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
                            taxStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winTax.hide();
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
                                    msg: 'Save at.load();tempt failed!',
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
                winTax.hide();
            }
        }]
});


Ext.getCmp('tax-grid-panel').on('celldblclick', function (grid, rindx, cindx, e) {

    var id = grid.getStore().getAt(rindx).get('id');

    addTaxWindow(id);

});

var winTax;
function addTaxWindow(lineOfBusinessId) {
    if (!winTax) {
        winTax = new Ext.Window({
            title: 'Add Tax',
            layout: 'fit',
            width: 460,
            height: 250,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: taxForm
        });
    }
    winTax.show(this);

    Ext.getCmp('tax-form').getForm().reset();
    Ext.getCmp('tax-form').getForm().load({
        url: contextpath + '/tax/formview.action',
        params: {
            id: lineOfBusinessId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}


