/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

//
// This is the main layout definition.
//
var detailEl;
Ext.onReady(function () {

            Ext.QuickTips.init();

            // This is an inner body element within the Details panel created to
            // provide a "slide in" effect
            // on the panel body without affecting the body's box itself. This
            // element is created on
            // initial use and cached in this var for subsequent access.


            // This is the main content center region that will contain each
            // example layout panel.
            // It will be implemented as a CardLayout since it will contain
            // multiple panels with
            // only one being visible at any given time.
            var contentPanel = {
                id: 'content-panel',
                region: 'center', // this is what makes this panel into a
                // region within the containing layout
                layout: 'card',
                margins: '2 5 5 0',
                activeItem: 0,
                border: false,
                items: [
                    // from basic.js:
                    start, absolute, accordion, anchor, border, cardTabs,
                    cardWizard, column, fit, form, table, vbox, hbox,
                    // from custom.js:
                    rowLayout, centerLayout,
                    // from combination.js:
                    absoluteForm, smeEntityGridPanel, userManagerLayout,
                    setupLayout, sitePanel, branchPanel, treeGridPanel, customerSupplierLayout,
                    bankCurrencyPanel, industryCodeGrid,
                    lineOfBusinessGrid, shareholdingTypeGridPanel, transactionTypeGridPanel,
                    positionInEntityGridPanel, directorsGrid, identityTypesGridPanel,
                    storesGridPanel, stockItemsGridPanel, payModesGridPanel,
                    purchasesGridPanel, salesGridPanel, accessibilityTypesGridPanel,
                    uoiGridPanel, supplierTypesGridPanel, assetTypesGridPanel,
                    customerTypesGridPanel, leaseTypesGridPanel, assetGridPanel,
                    stockLedgerGridPanel, receiptsGridPanel, //paymentsGridPanel,
                    transfersGridPanel, accountsTransactions, modulesManagerPanel,
                    financialTransactionsGridPanel, accountingPeriodsGrid, taxGridPanel,
                    expensesPanel, helpPanel
                ]
            };

            // Go ahead and create the TreePanel now so that we can use it below
            var treePanel = new Ext.tree.TreePanel({
                id: 'tree-panel',
                title: 'SMEs Finance',
                region: 'north',
                split: true,
                height: 300,
                minSize: 150,
                autoScroll: true,
                // tree-specific configs:
                rootVisible: false,
                lines: false,
                //singleExpand : true,
                useArrows: true,
                root: new Ext.tree.AsyncTreeNode({
                    text: 'Applications',
                    draggable: false,
                    id: 'source',
                    children: data
                }), listeners: {
                    click: function (n) {
                        console.log(n);
                        if (n.attributes.text == 'Students Register') {
                            Ext.getCmp('absolute-panel').setActiveTab(0);
                        }
                        if (n.attributes.text == 'Payroll Register') {
                            Ext.getCmp('row-panel').setActiveTab(0);
                        }
                        if (n.attributes.text == 'Fee Register &amp; Student Records' ||
                                n.attributes.text == 'Fee Register & Student Records') {
                            Ext.getCmp('content-panel').layout
                                    .setActiveItem('start-panel');
                        }
                    }
                }
            });

            // Assign the changeLayout function to be called on tree node click.
            treePanel.on('click', function (n) {
                var sn = this.selModel.selNode || {}; // selNode is null on
                // initial selection
                if (n.leaf && n.id != sn.id) { // ignore clicks on folders and
                    // currently selected node
                    Ext.getCmp('content-panel').layout
                            .setActiveItem(n.id + '-panel');
                    if (n.id + '-panel' == 'absolute-panel') {
                        Ext.getCmp('absolute-panel').setActiveTab(0);
                    }
                    console.log(n.id + '-panel');
                    if (!detailEl) {
                        var bd = Ext.getCmp('details-panel').body;
                        bd.update('').setStyle('background', '#fff');
                        detailEl = bd.createChild(); // create default empty
                        // div
                    }
                    detailEl.hide()
                            .update(Ext.getDom(n.id + '-details').innerHTML)
                            .slideIn('l', {
                                stopFx: true,
                                duration: .2
                            });
                }
                /**
                 * reset properties grid
                 */
                Ext.getCmp("propsGrid").setSource({
                    '(name)': 'Properties Grid'
                });
            });

            // This is the Details panel that contains the description for each
            // example layout.
            var detailsPanel = {
                id: 'details-panel',
                title: 'Details',
                region: 'center',
                bodyStyle: 'padding-bottom:15px;background:#eee;',
                autoScroll: true,
                html: '<p class="details-info">When you select a layout from the tree, additional details will display here.</p>'
            };

            // Finally, build the main layout once all the pieces are ready.
            // This is also a good
            // example of putting together a full-screen BorderLayout within a
            // Viewport.
            new Ext.Viewport({
                layout: 'border',
                items: [new Ext.Panel({
                        layout: 'fit',
                        region: 'north',
                        height: 32,
                        items: [toolBar]
                    }), {
                        layout: 'border',
                        id: 'layout-browser',
                        collapsible: true,
                        region: 'west',
                        border: false,
                        split: true,
                        margins: '2 0 5 5',
                        width: 275,
                        minSize: 100,
                        maxSize: 500,
                        items: [treePanel, detailsPanel]
                    }, contentPanel, {
                        region: 'east',
                        title: 'Notifications',
                        collapsible: true,
                        collapsed: true,
                        split: true,
                        width: 225, // give east and west
                        // regions a width
                        minSize: 175,
                        maxSize: 400,
                        margins: '0 5 0 0',
                        layout: 'fit', // specify layout
                        // manager for items
                        items: // this TabPanel is wrapped by
                                // another Panel so the title
                                // will be applied
                                new Ext.TabPanel({
                                    border: false, // already
                                    // wrapped
                                    // so don't
                                    // add
                                    // another border
                                    activeTab: 0, // second
                                    // tab
                                    // initially
                                    // active
                                    tabPosition: 'bottom',
                                    items: [new Ext.grid.PropertyGrid({
                                            title: 'Property Grid',
                                            closable: true,
                                            id: "propsGrid",
                                            source: {
                                                "(name)": "Properties Grid",
                                                Class: "",
                                                "created": new Date(Date.parse('10/15/2006'))
                                            }
                                        })]
                                })
                    }],
                renderTo: Ext.getBody()
            });



            Ext.Ajax.request({
                url: contextpath + '/user/getusername.action',
                method: 'POST',
                params: {
                    _csrf: csrfToken
                },
                success: function (obj, resp) {
                    console.log(obj)
                    var json = JSON.parse(obj.responseText);
                    Ext.getCmp('logout').setText('Logout (' + json.name + ')');
                    entityId = json.entityId;
                    entityName = json.entityName;
                    baseUrl = json.base_url;
                    jasperserver = json.jasperserver;
                    Ext.getCmp('tree-panel').setTitle('SMEs Finance (' + entityName + ')');
                    accountsModuleEnabled ? Ext.getCmp('accounts-transactions').enable(true) :
                            Ext.getCmp('accounts-transactions').disable(true)
                }, failure: function () {

                }
            });
           
        });

var data = [{
        text: 'Administrative Interfaces',
        expanded: true,
        children: [{
                text: 'Manage Entity',
                id: 'tabs-nested-layouts',
                iconCls: 'leafIcon',
                leaf: true
            }, {
                text: 'Manage Users',
                id: 'manage-users-center',
                iconCls: 'leafIcon',
                leaf: true
            }, {
                text: 'Manage Modules',
                id: 'modules-manager',
                iconCls: 'leafIcon',
                leaf: true
            }
        ]
    }, {
        text: 'Main Setup',
        expanded: true,
        children: [{
                text: 'Site setup',
                id: 'site',
                iconCls: 'leafIcon',
                leaf: true
            }, {
                text: 'Branches setup',
                id: 'branch',
                iconCls: 'leafIcon',
                leaf: true
            }, {
                text: 'Supplier/Customer setup',
                id: 'customer-supplier',
                iconCls: 'leafIcon',
                leaf: true
            }, {
                text: 'Banks/Currency setup',
                id: 'bank-currency',
                iconCls: 'leafIcon',
                leaf: true
            }, {
                text: 'Other setups | Postal/Town/Legal',
                id: 'setup-center',
                iconCls: 'leafIcon',
                leaf: true
            }]
    }, {
        text: 'Finance Operations &amp; Reports',
        expanded: true,
        children: [{
                text: 'Chart of Accounts',
                id: 'accountstransactions',
                iconCls: 'leafIcon',
                leaf: true
            }, {
                text: 'Accounting Periods',
                id: 'ap-grid',
                iconCls: 'leafIcon',
                leaf: true
            }, {
                text: 'Tax Setup',
                id: 'tax-grid',
                iconCls: 'leafIcon',
                leaf: true
            }]
    }];

var toolBar = new Ext.Toolbar({
    items: [
        {
            xtype: 'box',
            autoEl: {
                tag: 'div',
                html: '<img src="' + contextpath + '/static/images/metrologo_half.png" width="24" height="24" />'

            }
        }, '-', {
            text: 'Home',
            iconCls: 'silk-home',
            handler: function () {
                Ext.getCmp('content-panel').layout
                        .setActiveItem('start-panel');
            }
        }, '-', {
            text: 'All Setup',
            iconCls: 'silk-gears',
            menu: [{
                    html: '<b>General Setup</b>'
                }, '-', {
                    text: 'Site setup',
                    handler: function () {

                        displayPanel('site');
                    }
                }, {
                    text: 'Branches Setup',
                    handler: function () {
                        displayPanel('branch');
                    }
                }, {
                    text: 'Supplier Setup',
                    handler: function () {
                        displayPanel('customer-supplier');
                        Ext.getCmp('customer-supplier-panel').setActiveTab(0);
                    }
                }, {
                    text: 'Customer Setup',
                    handler: function () {
                        displayPanel('customer-supplier');
                        Ext.getCmp('customer-supplier-panel').setActiveTab(1);
                    }
                }, {
                    text: 'Banks Setup',
                    handler: function () {
                        displayPanel('bank-currency');
                        Ext.getCmp('bank-currency-panel').setActiveTab(0);
                    }
                }, {//
                    text: 'Branches Setup',
                    handler: function () {

                        displayPanel('branch');
                    }
                }, {//'lineofbusiness-grid-panel'
                    text: 'Industry Codes Setup',
                    handler: function () {

                        displayPanel('industry-code-grid');
                    }
                }, {//
                    text: 'Line of Business Setup',
                    handler: function () {

                        displayPanel('lineofbusiness-grid');
                    }
                }, {//
                    text: 'Shareholding Type Setup',
                    handler: function () {
                        displayPanel('shareholdingtype-grid');
                    }
                }, {//
                    text: 'Transaction Type Setup',
                    handler: function () {

                        displayPanel('transactiontype-grid');
                    }
                }, {//
                    text: 'Position in Entity',
                    handler: function () {

                        displayPanel('positioninentity-grid');
                    }
                }, {//
                    text: 'Directors',
                    handler: function () {

                        displayPanel('directors-grid');
                    }
                }, {//
                    text: 'Identity Types',
                    handler: function () {
                        displayPanel('identitytypes-grid');
                    }
                }, {//
                    text: 'Stores',
                    handler: function () {

                        displayPanel('stores-grid');
                    }
                }, {//
                    text: 'Stock',
                    handler: function () {
                        displayPanel('stockitems-grid');
                    }
                }, {//
                    text: 'Accessibility Types',
                    handler: function () {
                        displayPanel('accessibilitytypes-grid');
                    }
                }, {
                    text: 'Unit of Issue',
                    handler: function () {
                        displayPanel('uoi-grid');
                    }
                }, {
                    text: 'Supplier Types',
                    handler: function () {
                        displayPanel('suppliertypes-grid');
                    }
                }, {
                    text: 'Asset Types',
                    handler: function () {
                        displayPanel('assettypes-grid');
                    }
                }, {
                    text: 'Customer Types',
                    handler: function () {
                        displayPanel('customertypes-grid');
                    }
                }, {
                    text: 'Lease Types',
                    handler: function () {
                        displayPanel('leasetypes-grid');
                    }
                }, '-', {
                    html: '<b>Accounts Setup</b>'
                }, '-', {
                    text: 'Currency Setup',
                    handler: function () {
                        displayPanel('bank-currency');
                        Ext.getCmp('bank-currency-panel').setActiveTab(1);
                    }
                }, {//'accountsframework-grid-panel'
                    text: 'Payment Modes',
                    handler: function () {
                        displayPanel('paymodes-grid');
                    }
                }, {//'accountsframework-grid-panel'
                    text: 'Chart of Accounts',
                    handler: function () {
                        displayPanel('accountstransactions');
                    }
                }]
        }, '-', {
            text: 'Transactions',
            iconCls: 'silk-application-go',
            id: 'accounts-transactions',
            menu: [{
                    text: 'Purchases',
                    handler: function () {

                        displayPanel('purchases-grid');


                    }
                }, {
                    text: 'Sales',
                    handler: function () {

                        displayPanel('sales-grid');

                    }
                }, '-', {
                    text: 'Assets Register',
                    handler: function () {

                        displayPanel('asset-grid');

                    }
                }, {
                    text: 'Stock Ledger List',
                    handler: function () {

                        displayPanel('stockledgers-grid');

                    }
                }, {
                    text: 'Stock Transfers List',
                    handler: function () {

                        displayPanel('transfers-grid');

                    }
                }, '-', {
                    text: 'Receipts',
                    handler: function () {

                        displayPanel('receipts-grid');

                    }
                }, {
                    text: 'Payments/Expenses',
                    handler: function () {
                        displayPanel('payments-grid');
                    }
                },'-', {
                    text: 'Cash &amp; Equivalents Transactions',
                    handler: function () {
                        displayPanel('financialtransactions-grid');

                    }
                }]
        }, '-', {
            text: 'Modules',
            iconCls: 'silk-link',
            menu: [{
                    text: 'Loan center',
                    handler: function () {
                        if (!loanModuleEnabled) {
                            Ext.Msg.show({
                                title: 'Server Message',
                                msg: "Kindly, seek advice from admin, this module is disabled!",
                                icon: Ext.Msg.WARNING,
                                buttons: Ext.Msg.OK
                            }
                            )
                        } else {
                            if (!userEnabledLoan) {
                                Ext.Msg.show({
                                    title: 'Server Message',
                                    msg: "Kindly, seek advice from admin, you're not allowed to use this module!",
                                    icon: Ext.Msg.WARNING,
                                    buttons: Ext.Msg.OK
                                }
                                )
                            } else {
                                window.location.assign(LOAN_CENTER);
                            }
                        }

                    }
                }]
        },{
            text: 'Help',
            iconCls: 'silk-help',
            handler: function(){
                displayPanel('help');
            }
        },'->',
        {
            xtype: 'textfield',
            name: 'field1',
            emptyText: 'enter search term'
        }, {
            xtype: 'tbspacer',
            width: 50
        }, // add a 50px space
        {
            xtype: 'button',
            text: 'Logout',
            id: 'logout',
            iconCls: 'logout',
            handler: function () {
                window.location.href = contextpath + '/logout'
            }
        }]
});

function displayPanel(prefix) {
    if ((prefix === 'payments-grid' ||
            prefix === 'payments-grid' ||
            prefix === 'receipts-grid' ||
            prefix === 'transfers-grid' ||
            prefix === 'stockledgers-grid' ||
            prefix === 'asset-grid' ||
            prefix === 'sales-grid' ||
            prefix === 'sales-grid' ||
            prefix === 'purchases-grid' ||
            prefix === 'accountstransactions') && !userEnabledAccounts) {

        Ext.Msg.show({
            title: 'Server Message',
            msg: "Kindly, seek advice from admin, you're not allowed to use this module!",
            icon: Ext.Msg.WARNING,
            buttons: Ext.Msg.OK
        }
        )
    } else {
        Ext.getCmp('content-panel').layout
                .setActiveItem(prefix + '-panel');
        if (!detailEl) {
            var bd = Ext.getCmp('details-panel').body;
            bd.update('').setStyle('background', '#fff');
            detailEl = bd.createChild(); // create default empty
            // div
        }
        detailEl.hide()
                .update(Ext.getDom(prefix + '-details').innerHTML)
                .slideIn('l', {
                    stopFx: true,
                    duration: .2
                });
    }

}

