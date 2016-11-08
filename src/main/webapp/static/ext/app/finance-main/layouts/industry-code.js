/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var industryCodesStore = new Ext.data.JsonStore({
    id: 'iindustrycode-store-id',
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

industryCodesStore.load();

var industryCodeSelectModel = new Ext.grid.CheckboxSelectionModel();

var industryCodeGrid = new Ext.grid.GridPanel(
        {
            store: industryCodesStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'industry-code-grid-panel',
            sm: industryCodeSelectModel,
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
                    text: 'Add Industry Code',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        requirejs(
                                [contextpath
                                            + '/static/ext/app/finance-main/layouts/add-user.js'],
                                function () {
                                    addIndustryCodeWindow();
                                    industryCodesStore.load();
                                }

                        )
                    }

                }],
            columns: [industryCodeSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'id'
                }, {
                    header: 'Created on',
                    width: 75,
                    sortable: true,
                    dataIndex: 'createdAt'
                }, {
                    header: 'SIC Code',
                    width: 75,
                    sortable: true,
                    dataIndex: 'sicCode'
                }, {
                    header: 'SIC Name',
                    width: 85,
                    sortable: true,
                    dataIndex: 'sicName'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: industryCodesStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying user(s) {0} - {1} of {2}',
                emptyMsg: "No user(s) found"
            })
        });



var addIndustryCodeForm = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/industry-code/save.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'industry-code-form',
    items: [{
            xtype: 'fieldset',
            title: 'Industry Code',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'SIC Code',
                    name: 'sicCode',
                    allowBlank: false
                }, {
                    fieldLabel: 'SIC Name',
                    name: 'sicName',
                    allowBlank: false
                }, {
                    fieldLabel: 'Id',
                    name: 'id',
                    hidden: true
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
                var form = Ext.getCmp('industry-code-form').getForm();
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
                            industryCodesStore.load();
                            winIndustryCode.hide();
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
                winIndustryCode.hide();
            }
        }]
});

var winIndustryCode;
function addIndustryCodeWindow(industryCodeId) {
    if (!winIndustryCode) {
        winIndustryCode = new Ext.Window({
            title: 'Add Industry Code',
            layout: 'fit',
            width: 460,
            height: 250,
            closeAction: 'hide',
            iconCls: 'member',
            plain: true,
            items: addIndustryCodeForm
        });
    }
    winIndustryCode.show(this);

    Ext.getCmp('industry-code-form').getForm().reset();
    Ext.getCmp('industry-code-form').getForm().load({
        url: contextpath + '/getuser-in-form.action',
        params: {
            id: industryCodeId,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

