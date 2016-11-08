

uoiStore.load();

var uoiSelectModel = new Ext.grid.CheckboxSelectionModel();

var uoiGridPanel = new Ext.grid.GridPanel(
        {
            store: uoiStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'uoi-grid-panel',
            sm: uoiSelectModel,
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
                    text: 'Add Unit of Issue',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addUOIWindow();

                    }

                }],
            columns: [uoiSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'UOI Code',
                    width: 75,
                    sortable: true,
                    dataIndex: 'uoiCode'
                },{
                    header: 'UOI Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'uoiName'
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
                store: uoiStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying unit(s) {0} - {1} of {2}',
                emptyMsg: "No unit(s) found"
            })
        });



uoiGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');   
    addUOIWindow(id);
           
});


var uoiForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/uoi/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'uoi-form',
    items: [{
            xtype: 'fieldset',
            title: 'Unit of Issue',
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
                    fieldLabel: 'UOI Code',
                    name: 'uoiCode'
                },{
                    fieldLabel: 'UOI Name',
                    name: 'uoiName'
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
                var form = Ext.getCmp('uoi-form').getForm();
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
                            uoiStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winUOI.hide();
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
                winUOI.hide();
            }
        }]
});

var winUOI;
function addUOIWindow(lineOfBusinessId) {
    if (!winUOI) {
        winUOI = new Ext.Window({
            title: 'Add UOI',
            layout: 'fit',
            width: 460,
            height: 250,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: uoiForm
        });
    }
    winUOI.show(this);

    Ext.getCmp('uoi-form').getForm().reset();
    Ext.getCmp('uoi-form').getForm().load({
        url: contextpath + '/uoi/formview.action',
        params: {
            id: lineOfBusinessId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}




