/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var lineOfBusinessStore = new Ext.data.JsonStore({
    id: 'lineofbusiness-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/lineofbusiness/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'registeredName', 'lineOfBusiness', 'shareOfBusiness', 'sicName']

});

var industryGroupsFiltered = new Ext.data.JsonStore({
    id: 'searchindustrygroup-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/searchindustrygroup/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        industryName: '',
        start: 0
    },
    root: 'data',
    fields: ['id', 'description', 'code', 'name']

});


var industryCodesStore = new Ext.data.JsonStore({
    id: 'industrycodes-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/industry-code/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'createdAt', 'sicCode', 'sicName']

});




lineOfBusinessStore.load({
    params: {
        _csrf: csrfToken
    }
});


industryCodesStore.load({
    params: {
        _csrf: csrfToken
    }
});

var lineOfBusinessSelectModel = new Ext.grid.CheckboxSelectionModel();

var lineOfBusinessGrid = new Ext.grid.GridPanel(
        {
            store: lineOfBusinessStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'lineofbusiness-grid-panel',
            sm: lineOfBusinessSelectModel,
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
                    text: 'Add Line of Business',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        addLineOfBusinessWindow();

                    }

                }],
            columns: [industryCodeSelectModel, {
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
                    header: 'SIC Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'sicName'
                }, {
                    header: 'Line of Business',
                    width: 75,
                    sortable: true,
                    dataIndex: 'lineOfBusiness'
                }, {
                    header: 'Share of Business',
                    width: 85,
                    sortable: true,
                    dataIndex: 'shareOfBusiness'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: lineOfBusinessStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying user(s) {0} - {1} of {2}',
                emptyMsg: "No line(s) found"
            })
        });



var lineOfBusinessForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/lineofbusiness/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'lineofbusiness-form',
    items: [{
            xtype: 'fieldset',
            title: 'Line of Business',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [new Ext.form.ComboBox({
                    store: smeEntitySiteStore,
                    fieldLabel: 'Entity Name',
                    displayField: 'registeredName',
                    typeAhead: true,
                    name: 'registeredName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Entity...',
                    selectOnFocus: true
                }), new Ext.form.ComboBox({
                    store: industryCodesStore,
                    fieldLabel: 'Industry Name',
                    displayField: 'sicName',
                    typeAhead: true,
                    name: 'sicName',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a Name...',
                    selectOnFocus: true, listeners: {
                        select: function (combo, record, index) {
                            var sicName = record.get('sicName');
                            console.log('Industry::' + sicName);
                            industryGroupsFiltered.load({
                                params: {
                                    _csrf: csrfToken,
                                    industryName: sicName
                                }
                            });
                        }
                    }
                }), new Ext.form.ComboBox({
                    store: industryGroupsFiltered,
                    id: 'industrygroup-combo-lineofbusiness',
                    fieldLabel: 'Industry Grp',
                    displayField: 'description',
                    typeAhead: true,
                    name: 'description',
                    mode: 'local',
                    anchor: '50%',
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Industry ...',
                    selectOnFocus: true
                }), {
                    fieldLabel: 'Id',
                    name: 'id',
                    hidden: true
                }, {
                    fieldLabel: 'Share of Business',
                    name: 'shareOfBusiness'
                }]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('lineofbusiness-form').getForm();
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
                            lineOfBusinessStore.load({
                                params: {
                                    _csrf: csrfToken
                                }
                            });
                            winLineOfBusiness.hide();
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
                winLineOfBusiness.hide();
            }
        }]
});

var winLineOfBusiness;
function addLineOfBusinessWindow(lineOfBusinessId) {
    if (!winLineOfBusiness) {
        winLineOfBusiness = new Ext.Window({
            title: 'Add Line of Business',
            layout: 'fit',
            width: 460,
            height: 250,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: lineOfBusinessForm
        });
    }
    winLineOfBusiness.show(this);

    Ext.getCmp('industry-code-form').getForm().reset();
    Ext.getCmp('industry-code-form').getForm().load({
        url: contextpath + '/getuser-in-form.action',
        params: {
            id: lineOfBusinessId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

