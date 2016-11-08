/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var accountsStore = new Ext.data.ArrayStore({
    fields: ['accountClass'],
    data: [['Profit and Loss'],
        ['Balance Sheet']] // from states.js
});

var accountsCombo = new Ext.form.ComboBox({
    fieldLabel: 'Account Class',
    store: accountsStore,
    displayField: 'accountClass',
    name: 'accountClass',
    typeAhead: true,
    mode: 'local',
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select a class ...',
    defaults: {
        anchor: '95%'
    },
    selectOnFocus: true
});

var fsf = new Ext.FormPanel({
    labelWidth: 100, // label settings here cascade unless overridden
    url: contextpath + '/account/savenorminal.action?_csrf=' + csrfToken,
    frame: true,
    method: 'POST',
    bodyStyle: 'padding:5px 5px 0',
    width: 400,
    id: 'account-form',
    items: [{
            xtype: 'fieldset',
            title: 'Account Details',
            collapsible: true,
            autoHeight: true,
            defaults: {
                anchor: '95%'
            },
            defaultType: 'textfield',
            items: [{
                    fieldLabel: 'parentId',
                    name: 'parentId',
                    hidden: true
                },{
                    fieldLabel: 'Account Name',
                    name: 'accountName'
                },{
                    fieldLabel: 'Code',
                    name: 'accountCode'
                }, {
                    fieldLabel: 'Account Number',
                    name: 'accountNumber'
                }, {
                    fieldLabel: 'Id',
                    name: 'id',
                    hidden: true,
                }, {
                    fieldLabel: 'Description',
                    name: 'description'
                }, accountsCombo]
        }],
    buttons: [{
            text: 'Save',
            iconCls: 'silk-save',
            handler: function () {
                var form = Ext.getCmp('account-form').getForm();
                console.log('form picked ...');
                if (form.isValid()) {
                    console.log('form valid ...');
                    form.findField('code').setValue(accountCode);
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
                            treeGridPanel.getLoader().load(treeGridPanel.getRootNode()); 
                            winAccountCreate.hide();
                        }, failure: function (response, obj) {
                            console.log(obj);
                            var res = obj.response.responseText;
                            var message = '';
                            try {
                                res = Ext.decode(obj.response.responseText);
                                message = res.msg;
                            } catch (e) {
                                console.log(e)
                            }
                            if (message.includes('Access is denied')) {
                                Ext.Msg.show({
                                    title: 'Server Alert',
                                    msg: 'Sorry, you do not have access rights for this action!',
                                    icon: Ext.Msg.WARNING,
                                    buttons: Ext.Msg.OK
                                });
                            } else {
                                Ext.MessageBox.show({
                                    title: 'Server Alert',
                                    msg: message,
                                    icon: Ext.MessageBox.WARNING,
                                    buttons: Ext.MessageBox.OK
                                });
                            }

                        }
                    });
                }
            }
        }, {
            text: 'Cancel',
            iconCls:'silk-application-delete',
            handler: function () {
                winAccountCreate.hide();
            }
        }]
});



var winAccountCreate;
function addAccountWindow(code) {
    accountCode = code;
    if (!winAccountCreate) {
        winAccountCreate = new Ext.Window({
            title: 'Add Account',
            layout: 'fit',
            iconCls: 'silk-book',
            width: 460,
            height: 230,
            closeAction: 'hide',
            plain: true,
            items: fsf
        });
    }
    winAccountCreate.show(this);

    Ext.getCmp('account-form').getForm().reset();
    Ext.getCmp('account-form').getForm().load({
        url: contextpath + '/account/getaccount-in-form.action',
        params: {
            accountNumber: code,
            _csrf: csrfToken
        },
        waitMsg: 'Loading'
    });
}

var accountCode;