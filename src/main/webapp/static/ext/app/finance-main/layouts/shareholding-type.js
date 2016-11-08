
var shareholdingTypeSelectModel = new Ext.grid.CheckboxSelectionModel();

var shareholdingTypeGridPanel = new Ext.grid.GridPanel(
        {
            store: shareholdingTypeStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'shareholdingtype-grid-panel',
            sm: shareholdingTypeSelectModel,
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
                    text: 'Add Shareholding Type',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addShareholdingTypeWindow();

                    }

                }],
            columns: [shareholdingTypeSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Shareholding Type Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'shareholdingTypeName'
                },{
                    header: 'Short Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'shortName'
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
                store: shareholdingTypeStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying type(s) {0} - {1} of {2}',
                emptyMsg: "No type(s) found"
            })
        });

shareholdingTypeGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');   
    addShareholdingTypeWindow(id);
           
});

var shareholdingTypeForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/shareholdingtype/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'shareholdingtype-form',
    items: [{
            xtype: 'fieldset',
            title: 'Shareholding Type',
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
                    name: 'shareholdingTypeName'
                },{
                    fieldLabel: 'Short Name',
                    name: 'shortName'
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
                var form = Ext.getCmp('shareholdingtype-form').getForm();
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
                            shareholdingTypeStore.load({
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
                winShareholdingType.hide();
            }
        }]
});

var winShareholdingType;
function addShareholdingTypeWindow(id) {
    if (!winShareholdingType) {
        winShareholdingType = new Ext.Window({
            title: 'Add Shareholding Type',
            layout: 'fit',
            width: 460,
            height: 250,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: shareholdingTypeForm
        });
    }
    winShareholdingType.show(this);

    Ext.getCmp('shareholdingtype-form').getForm().reset();
    Ext.getCmp('shareholdingtype-form').getForm().load({
        url: contextpath + '/shareholdingtype/formview.action',
        params: {
            id: id,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

