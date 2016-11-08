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


var directorsStore = new Ext.data.JsonStore({
    id: 'directors-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/directors/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'directorName', 'positionInEntity', 'shareholding', 
            'positionInEntity', 'residenceTown', 'residenceLease',
            'phoneNumber', 'identityType', 'shareholdingType'
    ]

});


    
directorsStore.load({
    params: {
        _csrf: csrfToken
    }
});

smeEntitySiteStore.on('load',function(ds,records,o){
  Ext.getCmp('smeentity-store-director-combo').setValue(records[0].data.registeredName);
});

smeEntitySiteStore.load();

var directorsSelectModel = new Ext.grid.CheckboxSelectionModel();

var directorsGrid = new Ext.grid.GridPanel(
        {
            store: directorsStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'directors-grid-panel',
            sm: directorsSelectModel,
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
                    text: 'Add Director',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addDirectorWindow();

                    }

                }],
            columns: [directorsSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Director Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'directorName'
                },{
                    header: 'Position in Entity',
                    width: 75,
                    sortable: true,
                    dataIndex: 'positionInEntity'
                }, {
                    header: 'Shareholding',
                    width: 75,
                    sortable: true,
                    dataIndex: 'shareholding'
                }, {
                    header: 'Residence Town',
                    width: 85,
                    sortable: true,
                    dataIndex: 'residenceTown'
                }, {
                    header: 'Residence Lease',
                    width: 85,
                    sortable: true,
                    dataIndex: 'residenceLease'
                }, {
                    header: 'Identity Type',
                    width: 85,
                    sortable: true,
                    dataIndex: 'identityType'
                }, {
                    header: 'Shareholding Type',
                    width: 85,
                    sortable: true,
                    dataIndex: 'shareholdingType'
                }, {
                    header: 'Phone Number',
                    width: 85,
                    sortable: true,
                    dataIndex: 'phoneNumber'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: directorsStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying director(s) {0} - {1} of {2}',
                emptyMsg: "No director(s) found"
            })
        });



var directorsForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/director/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'directors-form',
    items: [{
            xtype: 'fieldset',
            title: 'Directors',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    fieldLabel: 'Entity Name',
                    id: 'smeentity-store-director-combo',
                    displayField: 'registeredName',
                    typeAhead: true,
                    name: 'registeredName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Entity...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'Id',
                    name: 'id',
                    hidden: true
                }, {
                    fieldLabel: 'Director Name',
                    name: 'directorName'
                }, new Ext.form.ComboBox({
                    store: positionInEntityStore,
                    fieldLabel: 'Position in Entity',
                    displayField: 'positionName',
                    typeAhead: true,
                    name: 'positionName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Position...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'Shareholding',
                    name: 'shareholding'
                }, {
                    fieldLabel: 'Residence Lease',
                    name: 'residenceLease'
                },{
                    fieldLabel: 'Residence Town',
                    name: 'residenceTown'
                }, {
                    fieldLabel: 'Phone Number',
                    name: 'phoneNumber'//
                }, new Ext.form.ComboBox({
                    store: identityTypesStore,
                    fieldLabel: 'ID Type Name',
                    displayField: 'idTypeName',
                    typeAhead: true,
                    name: 'idTypeName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Type...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: shareholdingTypeStore,
                    fieldLabel: 'Shareholding Type',
                    displayField: 'shareholdingTypeName',
                    typeAhead: true,
                    name: 'shareholdingTypeName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Type...',
                    selectOnFocus: true
                })]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('directors-form').getForm();
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
                            directorsStore.load({
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
                winDirector.hide();
            }
        }]
});

var winDirector;
function addDirectorWindow(lineOfBusinessId) {
    if (!winDirector) {
        winDirector = new Ext.Window({
            title: 'Add Director',
            layout: 'fit',
            width: 460,
            height: 370,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: directorsForm
        });
    }
    winDirector.show(this);

    Ext.getCmp('directors-form').getForm().reset();
    Ext.getCmp('directors-form').getForm().load({
        url: contextpath + '/getuser-in-form.action',
        params: {
            id: lineOfBusinessId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

