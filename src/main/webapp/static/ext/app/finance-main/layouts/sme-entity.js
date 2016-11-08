var smeEntityFormPanel = new Ext.FormPanel({//tabsNestedLayouts
    // specify it
    fileUpload: true,
    id: 'smeentity-form-panel', //tabs-nested-layouts-panel
    labelWidth: 125,
    url: contextpath + '/entity/save.action?&_csrf=' + csrfToken,
    method: 'POST',
    title: 'SME details',
    bodyStyle: 'padding:5px 5px 0',
    width: 350,
    labelPad: 125,
    frame: true,
    autoHeight: true,
    items: [
        {
            layout: 'column',
            border: false,
            items: [
                {
                    autoHeight: true,
                    columnWidth: .5,
                    layout: 'form',
                    defaultType: 'textfield',
                    bodyStyle: 'padding:5px 5px 0',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Organization Details',
                            bodyStyle: 'padding:5px 5px 0',
                            autoHeight: true,
                            defaults: {
                                anchor: '95%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Code',
                                    name: 'code'
                                },{
                                    fieldLabel: 'Registered Name',
                                    name: 'registeredName'
                                }, {
                                    fieldLabel: 'Trading Name',
                                    name: 'tradingName'
                                }, {
                                    fieldLabel: 'Created On',
                                    name: 'createdAtDisplayed',
                                    format: 'd-m-Y',
                                    id: 'createdAtDisplayed',
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'Date Registered',
                                    name: 'regDateDisplayed',
                                    id: 'regDateDisplayed',
                                    format: 'd-m-Y',
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'Created On',
                                    name: 'createdAt',
                                    hidden: true,
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'ID',
                                    name: 'id',
                                    hidden: true
                                }, {
                                    fieldLabel: 'Date Registered',
                                    name: 'regDate',
                                    hidden: true,
                                    xtype: 'datefield'
                                }, {
                                    fieldLabel: 'Reg Number',
                                    name: 'regNumber'
                                }, new Ext.form.ComboBox({
                                    store: legalTypeStore2,
                                    fieldLabel: 'Legal Type',
                                    displayField: 'accessName',
                                    typeAhead: true,
                                    name: 'accessName',
                                    mode: 'local',
                                    width: 230,
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select Legal Type ...',
                                    selectOnFocus: true
                                }), {
                                    fieldLabel: 'Logo',
                                    xtype: 'fileuploadfield',
                                    id: 'file',
                                    emptyText: 'Select an image file',
                                    name: 'file',
                                    anchor: '95%',
                                    buttonCfg: {
                                        iconCls: 'upload-icon'
                                    },
                                    buttonText: ''
                                }, {
                                    checked: true,
                                    fieldLabel: 'Enabled',
                                    xtype: 'checkbox',
                                    labelSeparator: '',
                                    boxLabel: 'Entity',
                                    name: 'enabled'
                                }]
                        }]
                }, {
                    columnWidth: .5,
                    bodyStyle: 'padding:5px 5px 0',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Contact Information',
                            autoHeight: true,
                            bodyStyle: 'padding:5px 5px 0',
                            defaults: {
                                anchor: '95%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Physical Address',
                                    name: 'physicalAddress'
                                }, {
                                    fieldLabel: 'Building LR',
                                    name: 'buildingLr'
                                }, {
                                    fieldLabel: 'Floor Number',
                                    name: 'floorNumber'
                                }, {
                                    fieldLabel: 'Street Name',
                                    name: 'streetName'
                                }, new Ext.form.ComboBox({
                                    store: townCodeStore2,
                                    fieldLabel: 'Town Code',
                                    displayField: 'townCode',
                                    typeAhead: true,
                                    name: 'townCode',
                                    mode: 'local',
                                    width: 230,
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select Town Code ...',
                                    selectOnFocus: true
                                }), new Ext.form.ComboBox({
                                    store: postalCodesStore2,
                                    fieldLabel: 'Post Code',
                                    displayField: 'postCode',
                                    typeAhead: true,
                                    name: 'postCode',
                                    mode: 'local',
                                    width: 230,
                                    forceSelection: true,
                                    triggerAction: 'all',
                                    emptyText: 'Select a Post Code...',
                                    selectOnFocus: true
                                }), {
                                    fieldLabel: 'Post Number',
                                    name: 'postNumber'
                                }, {
                                    fieldLabel: 'Email Address',
                                    name: 'emailAddress',
                                    vtype: 'email'
                                }, {
                                    fieldLabel: 'Phone Number',
                                    name: 'phoneNumber'
                                }, {
                                    fieldLabel: 'Legal Type',
                                    hidden: true,
                                    name: 'legalType'
                                }]
                        }
                    ],
                    buttons: [{
                            text: 'Save/Update',
                            iconCls: 'silk-save',
                            handler: function () {
                                var form = Ext.getCmp('smeentity-form-panel').getForm();
                                form.findField('createdAt').setValue(form.findField('createdAtDisplayed').getValue().format('m-d-Y'));
                                form.findField('regDate').setValue(form.findField('regDateDisplayed').getValue().format('m-d-Y'));
                                form.findField('legalType').setValue(form.findField('accessName').getValue());
                                if (form.isValid()) {
                                    form.submit({
                                        success: function (response, obj) {
                                            var res = Ext.decode(obj.response.responseText);
                                            Ext.Msg.show({
                                                title: 'Success',
                                                msg: res.msg,
                                                icon: Ext.Msg.INFO,
                                                buttons: Ext.Msg.OK
                                            });

                                            smeEntitySiteStore.load();
                                            winSmeEntity.hide();
                                        }, failure: function (response, obj) {
                                            console.log(obj);
                                            var res = obj.response.responseText;
                                            try {
                                                res = Ext.decode(obj.response.responseText);
                                            } catch (e) {
                                                console.log(e)
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
                                    }

                                    );
                                } else {
                                    Ext.Msg.alert(
                                            'Alert',
                                            'Fill in correct and complete information before you submit.'
                                            );
                                }
                            }
                        }, {
                            text: 'Cancel',
                            iconCls: 'silk-application-delete',
                            handler: function(){
                                winSmeEntity.hide();
                            }
                        }]
                }
            ]
        }
    ]

});


var smeEntitySelectModel = new Ext.grid.CheckboxSelectionModel();

var smeEntityGridPanel = new Ext.grid.GridPanel(
        {
            store: smeEntitySiteStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'tabs-nested-layouts-panel',
            sm: smeEntitySelectModel,
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
                    text: 'Add Entity',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addSmeEntityWindow();

                    }

                }],
            columns: [smeEntitySelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'id'
                }, {
                    header: 'Registered Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'registeredName'
                }, {
                    header: 'Trading Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'tradingName'
                }, {
                    header: 'Registered Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'regNumber'
                }, {
                    header: 'Created On',
                    width: 75,
                    sortable: true,
                    dataIndex: 'createdAt'
                }, {
                    header: 'Enabled',
                    width: 75,
                    sortable: true,
                    dataIndex: 'enabled'
                }, {
                    header: 'Access Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'accessName'
                }, {
                    header: 'Reg Date',
                    width: 75,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'regDate'
                }, {
                    header: 'Physical Address',
                    width: 75,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'physicalAddress'
                }, {
                    header: 'Building LR',
                    width: 75,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'buildingLr'
                }, {
                    header: 'Floor Number',
                    width: 75,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'floorNumber'
                }, {
                    header: 'Street Name',
                    width: 75,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'streetName'
                }, {
                    header: 'Town Code',
                    width: 75,
                    sortable: true,
                    dataIndex: 'townCode'
                }, {
                    header: 'Post Code',
                    width: 75,
                    sortable: true,
                    dataIndex: 'postCode'
                }, {
                    header: 'Post Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'postNumber'
                }, {
                    header: 'Email Address',
                    width: 75,
                    sortable: true,
                    dataIndex: 'emailAddress'
                }, {
                    header: 'Phone Number',
                    width: 75,
                    sortable: true,
                    dataIndex: 'phoneNumber'
                }, {
                    header: 'Code',
                    width: 75,
                    sortable: true,
                    dataIndex: 'code'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: smeEntitySiteStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying entity(ies) {0} - {1} of {2}',
                emptyMsg: "No entity(ies) found"
            })
        });


smeEntityGridPanel.on('celldblclick', function (grid, rindx, cindx, e) {
    var id = grid.getStore().getAt(rindx).get('id');
    addSmeEntityWindow(id);

});

var winSmeEntity;
function addSmeEntityWindow(storeid) {
    Ext.getCmp('smeentity-form-panel').getForm().reset();
    if (!winSmeEntity) {
        winSmeEntity = new Ext.Window({
            title: 'Add Entity',
            layout: 'fit',
            width: 800,
            autoHeight: true,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: smeEntityFormPanel
        });
    }
    winSmeEntity.show(this);

    Ext.getCmp('smeentity-form-panel').getForm().load({
        url: contextpath + '/entitysearch/formview.action',
        params: {
            id: storeid,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}



Ext.onReady(function () {
    smeEntityFormPanel.getForm().load({
        url: contextpath + '/entity/formview.action',
        method: 'POST',
        root: 'data',
        params: {
            _csrf: csrfToken
        },
        waitMsg: 'Loading ...'
    }
    );

    Ext.getCmp('tax-forms').getForm().load({
        url: contextpath + '/fina/fetchtax.action',
        params: {
            _csrf: csrfToken
        }
    });
})