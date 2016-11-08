/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var suppliersSelectModel = new Ext.grid.CheckboxSelectionModel();

var customersSelectModel = new Ext.grid.CheckboxSelectionModel();

var assetCustomersSelectModel = new Ext.grid.CheckboxSelectionModel();

var customerSupplierLayout = new Ext.TabPanel({
    activeTab: 0,
    plain: true,
    id: 'customer-supplier-panel',
    defaults: {
        autoScroll: true
    },
    items: [{
            layout: 'border',
            id: 'suppliers-pane',
            title: 'Suppliers Register',
            items: [{
                    // lazily created panel (xtype:'panel' is default)
                    region: 'south',
                    split: true,
                    height: 250,
                    minSize: 100,
                    maxSize: 300,
                    collapsible: true,
                    title: 'Suppliers Register',
                    margins: '0 5 0 0'
                }, new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 330,
                    minSize: 100,
                    maxSize: 350,
                    collapsible: true,
                    margins: '0 5 0 0',
                    store: suppliersStore,
                    id: 'suppliers-grid',
                    closable: true,
                    sm: suppliersSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [suppliersSelectModel, {
                            header: "Id",
                            width: 150,
                            sortable: true,
                            hidden: true,
                            dataIndex: 'id',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Supplier Number",
                            width: 70,
                            sortable: true,
                            dataIndex: 'supplierNumber',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Supplier Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'supplierName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Address",
                            width: 70,
                            sortable: true,
                            dataIndex: 'address',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Town",
                            width: 70,
                            sortable: true,
                            dataIndex: 'town',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Payment Mode",
                            width: 70,
                            sortable: true,
                            dataIndex: 'paymentMode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }), new Ext.FormPanel({
                    labelWidth: 100, // label settings here cascade unless overridden
                    url: contextpath + '/supplier/save.action?_csrf=' + csrfToken,
                    frame: true,
                    id: 'suppliers-form',
                    bodyStyle: 'padding:5px 5px 0',
                    defaults: {
                        width: 300
                    },
                    defaultType: 'textfield',
                    region: 'center',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Supplier',
                            collapsible: true,
                            width: '95%',
                            autoHeight: true,
                            defaults: {
                                anchor: '60%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Supplier Number',
                                    name: 'supplierNumber'
                                }, {
                                    fieldLabel: 'Supplier Name',
                                    name: 'supplierName'
                                }, {
                                    fieldLabel: 'Address',
                                    name: 'address'
                                }, {
                                    fieldLabel: 'Town',
                                    name: 'town'
                                }, {
                                    fieldLabel: 'Payment Mode',
                                    name: 'paymentMode'
                                }]
                        }],
                    buttons: [{
                            text: 'Save',
                            iconCls: 'silk-save',
                            handler: function () {
                                var form = Ext.getCmp('suppliers-form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        success: function (obj, resp) {
                                            var json = JSON.parse(resp.response.responseText);
                                            Ext.Msg.alert('Server Response', json.msg);
                                            suppliersStore.load({
                                                params: {
                                                    _csrf: csrfToken
                                                }
                                            });
                                        }, failure: function (obj, resp) {

                                        }
                                    });
                                }
                            }
                        }, {
                            text: 'Cancel',
                            iconCls:'silk-application-delete',
                        }]
                })]
        }, {
            layout: 'border',
            title: 'Customers Register (Trade)',
            items: [new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 330,
                    minSize: 100,
                    maxSize: 350,
                    collapsible: true,
                    title: 'Customers Register',
                    margins: '0 5 0 0',
                    store: customersStore,
                    id: 'customers-grid',
                    closable: true,
                    sm: customersSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [customersSelectModel, {
                            header: "Id",
                            width: 150,
                            sortable: true,
                            hidden: true,
                            dataIndex: 'id',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Customer Number",
                            width: 70,
                            sortable: true,
                            dataIndex: 'customerNumber',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Customer Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'customerName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Address",
                            width: 70,
                            sortable: true,
                            dataIndex: 'address',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Town",
                            width: 70,
                            sortable: true,
                            dataIndex: 'town',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Payment Mode",
                            width: 70,
                            sortable: true,
                            dataIndex: 'paymentMode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }), new Ext.FormPanel({
                    labelWidth: 100, // label settings here cascade unless overridden
                    url: contextpath + '/customer/save.action?_csrf=' + csrfToken,
                    frame: true,
                    id: 'customer-form',
                    method: 'POST',
                    bodyStyle: 'padding:5px 5px 0',
                    defaults: {
                        width: 300
                    },
                    defaultType: 'textfield',
                    region: 'center',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Customer',
                            collapsible: true,
                            width: '95%',
                            autoHeight: true,
                            defaults: {
                                anchor: '60%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Customer Number',
                                    name: 'customerNumber'
                                }, {
                                    fieldLabel: 'Customer Name',
                                    name: 'customerName'
                                }, {
                                    fieldLabel: 'Address',
                                    name: 'address'
                                }, {
                                    fieldLabel: 'Town',
                                    name: 'town'
                                }, {
                                    fieldLabel: 'Payment Mode',
                                    name: 'paymentMode'
                                }]
                        }],
                    buttons: [{
                            text: 'Save',
                            iconCls: 'silk-save',
                            handler: function () {
                                var form = Ext.getCmp('customer-form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        success: function (obj, resp) {
                                            var json = JSON.parse(resp.response.responseText);

                                            Ext.MessageBox.show({
                                                title: 'Server Response',
                                                msg: json.msg,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO
                                            });

                                            customersStore.load({
                                                params: {
                                                    _csrf: csrfToken
                                                }
                                            });
                                        }, failure: function (obj, resp) {

                                        }
                                    });
                                }
                            }
                        }, {
                            text: 'Cancel',
                            iconCls:'silk-application-delete'
                        }]
                })]
        },{
            layout: 'border',
            title: 'Customers Register (Asset)',
            items: [new Ext.grid.GridPanel({
                    region: 'south',
                    split: true,
                    height: 330,
                    minSize: 100,
                    maxSize: 350,
                    collapsible: true,
                    title: 'Customers Register',
                    margins: '0 5 0 0',
                    store: assetCustomersStore,
                    id: 'assetcustomers-grid',
                    closable: true,
                    sm: assetCustomersSelectModel,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [assetCustomersSelectModel, {
                            header: "Id",
                            width: 150,
                            sortable: true,
                            hidden: true,
                            dataIndex: 'id',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Customer Number",
                            width: 70,
                            sortable: true,
                            dataIndex: 'customerNumber',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Customer Name",
                            width: 70,
                            sortable: true,
                            dataIndex: 'customerName',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Address",
                            width: 70,
                            sortable: true,
                            dataIndex: 'address',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Town",
                            width: 70,
                            sortable: true,
                            dataIndex: 'town',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }, {
                            header: "Payment Mode",
                            width: 70,
                            sortable: true,
                            dataIndex: 'paymentMode',
                            editor: {
                                xtype: 'textfield',
                                allowBlank: false
                            }
                        }],
                    stripeRows: true
                }),new Ext.FormPanel({
                    labelWidth: 100, // label settings here cascade unless overridden
                    url: contextpath + '/assetcustomer/save.action?_csrf=' + csrfToken,
                    frame: true,
                    id: 'assetcustomer-form',
                    method: 'POST',
                    bodyStyle: 'padding:5px 5px 0',
                    defaults: {
                        width: 300
                    },
                    defaultType: 'textfield',
                    region: 'center',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Customer',
                            collapsible: true,
                            width: '95%',
                            autoHeight: true,
                            defaults: {
                                anchor: '60%'
                            },
                            defaultType: 'textfield',
                            items: [{
                                    fieldLabel: 'Customer Number',
                                    name: 'customerNumber'
                                }, {
                                    fieldLabel: 'Customer Name',
                                    name: 'customerName'
                                }, {
                                    fieldLabel: 'Address',
                                    name: 'address'
                                }, {
                                    fieldLabel: 'Town',
                                    name: 'town'
                                }, {
                                    fieldLabel: 'Payment Mode',
                                    name: 'paymentMode'
                                }]
                        }],
                    buttons: [{
                            text: 'Save',
                            iconCls: 'silk-save',
                            handler: function () {
                                var form = Ext.getCmp('assetcustomer-form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        success: function (obj, resp) {
                                            var json = JSON.parse(resp.response.responseText);

                                            Ext.MessageBox.show({
                                                title: 'Server Response',
                                                msg: json.msg,
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO
                                            });

                                            assetCustomersStore.load({
                                                params: {
                                                    _csrf: csrfToken
                                                }
                                            });
                                        }, failure: function (obj, resp) {

                                        }
                                    });
                                }
                            }
                        }, {
                            text: 'Cancel',
                            iconCls:'silk-application-delete'
                        }]
                })]
        }],
    autoDestroy: false
}

);