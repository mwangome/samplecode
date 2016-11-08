/*
 * 
 * @author=derek
 */

var positionInEntitySelectModel = new Ext.grid.CheckboxSelectionModel();

var positionInEntityGridPanel = new Ext.grid.GridPanel(
        {
            store: positionInEntityStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'positioninentity-grid-panel',
            sm: positionInEntitySelectModel,
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
                    text: 'Add Position in Entity',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addPositionInEntityWindow();

                    }

                }],
            columns: [positionInEntitySelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Position Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'positionName'
                }, {
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
                store: positionInEntityStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying position(s) {0} - {1} of {2}',
                emptyMsg: "No position(s) found"
            })
        });



var transactionTypeForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/positioninentity/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'positioninentity-form',
    items: [{
            xtype: 'fieldset',
            title: 'Position In Entity',
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
                    fieldLabel: 'Position Name',
                    name: 'positionName'
                }, {
                    fieldLabel: 'Short Name',
                    name: 'shortName'
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
                var form = Ext.getCmp('positioninentity-form').getForm();
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
                            positionInEntityStore.load({
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
                winPositionInEntity.hide();
            }
        }]
});

var winPositionInEntity;
function addPositionInEntityWindow(lineOfBusinessId) {
    if (!winPositionInEntity) {
        winPositionInEntity = new Ext.Window({
            title: 'Add Position In Entity',
            layout: 'fit',
            width: 460,
            height: 250,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: transactionTypeForm
        });
    }
    winPositionInEntity.show(this);

    Ext.getCmp('positioninentity-form').getForm().reset();
    Ext.getCmp('positioninentity-form').getForm().load({
        url: contextpath + '/getuser-in-form.action',
        params: {
            id: lineOfBusinessId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

