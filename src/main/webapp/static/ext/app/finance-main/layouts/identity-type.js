/*
 * 
 * @author=derek
 */



var identityTypesSelectModel = new Ext.grid.CheckboxSelectionModel();

var identityTypesGridPanel = new Ext.grid.GridPanel(
        {
            store: identityTypesStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'identitytypes-grid-panel',
            sm: identityTypesSelectModel,
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
                    text: 'Add Identity Type',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addIdentityTypeWindow();

                    }

                }],
            columns: [identityTypesSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Type Code',
                    width: 75,
                    sortable: true,
                    dataIndex: 'typeCode'
                }, {
                    header: 'Id Type Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'idTypeName'
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
                store: identityTypesStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying identity(ies) {0} - {1} of {2}',
                emptyMsg: "No identity(ies) found"
            })
        });



var identityTypeForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/identitytype/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'identity-type-form',
    items: [{
            xtype: 'fieldset',
            title: 'Identity Type',
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
                    fieldLabel: 'Type Code',
                    name: 'typeCode'
                }, {
                    fieldLabel: 'Id Type Name',
                    name: 'idTypeName'
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
                var form = Ext.getCmp('identity-type-form').getForm();
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
                            identityTypesStore.load({
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
                winIdentityType.hide();
            }
        }]
});

var winIdentityType;
function addIdentityTypeWindow(lineOfBusinessId) {
    if (!winIdentityType) {
        winIdentityType = new Ext.Window({
            title: 'Add Identity Type',
            layout: 'fit',
            width: 460,
            height: 250,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: identityTypeForm
        });
    }
    winIdentityType.show(this);

    Ext.getCmp('identity-type-form').getForm().reset();
    Ext.getCmp('identity-type-form').getForm().load({
        url: contextpath + '/getuser-in-form.action',
        params: {
            id: lineOfBusinessId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

