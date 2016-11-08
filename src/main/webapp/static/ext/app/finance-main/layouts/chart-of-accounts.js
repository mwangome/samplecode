/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
// Array data for the grids

var reader = new Ext.data.JsonReader({
    root: 'data',
    totalProperty: 'totalCount',
    fields: ['id', 'accountName', 'accountNumber', 'code']
});

// Create Grouping Store to group records by a given value
var accountsStore = new Ext.data.GroupingStore({
    id: 'accounts-store',
    reader: reader,
    remoteSort: true,
    groupField: 'accountName',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/accounts/viewchartofaccounts?_csrf=' + csrfToken,
        autoAbort: true,
        disableCaching: true,
        timeout: 180000,
        method: 'POST'
    }),
    sortInfo: {
        field: 'accountNumber',
        direction: "ASC"
    }, listeners: {
        load: function (sender, node, records) {
            console.log('data loaded!');
        }
    }
});

accountsStore.load();

// shared reader
//var reader = new Ext.data.ArrayReader({}, [{
//        name: 'company'
//    }, {
//        name: 'price',
//        type: 'float'
//    }, {
//        name: 'change',
//        type: 'float'
//    }, {
//        name: 'pctChange',
//        type: 'float'
//    }, {
//        name: 'lastChange',
//        type: 'date',
//        dateFormat: 'n/j h:ia'
//    }, {
//        name: 'industry'
//    }, {
//        name: 'desc'
//    }]);

//var store = new Ext.data.GroupingStore({
//    reader: reader,
//    data: Ext.grid.dummyData,
//    sortInfo: {
//        field: 'company',
//        direction: "ASC"
//    },
//    groupField: 'industry'
//});

//var chartOfAccountsGrid = new Ext.grid.GridPanel({
//    id: 'chart-of-accounts-panel',
//    store: accountsStore,
//    tbar: [{
//            text: 'Add Account',
//            handler: function () {
//
//            }
//        }],
//    columns: [{
//            id: 'accountNumber',
//            header: "Account Code",
//            width: 20,
//            sortable: true,
//            dataIndex: 'accountNumber'
//        }, {
//            header: "Account Name",
//            width: 60,
//            sortable: true,
//            dataIndex: 'accountName'
//        }, {
//            header: "Account Code",
//            width: 20,
//            sortable: true,
//            dataIndex: 'code'
//        }, {
//            header: "Id",
//            width: 20,
//            hidden: true,
//            sortable: true,
//            dataIndex: 'id'
//        }],
//    view: new Ext.grid.GroupingView({
//        forceFit: true,
//        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Accounts" : "Accounts"]})'
//    }),
//    frame: true,
//    width: 700,
//    height: 450,
//    collapsible: true,
//    animCollapse: false,
//    title: 'Chart of Accounts',
//    iconCls: 'icon-grid',
//    fbar: ['->', {
//            text: 'Clear Grouping',
//            iconCls: 'icon-clear-group',
//            handler: function () {
//                accountsStore.clearGrouping();
//            }
//        }],
//    renderTo: document.body
//});



var treeGridPanel = new Ext.ux.tree.TreeGrid({
    title: 'Chart of Accounts',
    id: 'tree-grid-panel',
    enableDD: true,
    expand: false,
    tbar: [{
            text: 'Add Account',
            iconCls: 'silk-book',
            handler: function () {
                var selected = Ext.getCmp('tree-grid-panel').getSelectionModel().isSelected();
                if (!selected) {
                    var codeSelected = Ext.getCmp('tree-grid-panel').getSelectionModel().getSelectedNode().attributes.accountNumber;
                    requirejs(
                            [contextpath
                                        + '/static/ext/app/finance-main/layouts/add-account.js'],
                            function () {
                                addAccountWindow(codeSelected);
                            }

                    )

                    console.log('Selected::' + codeSelected);
                } else {
                    Ext.MessageBox.show({
                        title: 'Alert',
                        msg: 'Please, Select one of the main accounts then try again!',
                        icon: Ext.MessageBox.WARNING,
                        buttons: Ext.MessageBox.OK
                    })

                }
            }
        }],
    columns: [{
            header: 'Account Number',
            width: 230,
            sortType: 'asFloat',
            dataIndex: 'accountNumber'
        }, {
            header: 'Account Name',
            dataIndex: 'accountName',
            width: 230
        }, {
            header: 'Code',
            width: 230,
            dataIndex: 'code',
            align: 'center'
        }],
    viewConfig: {
        forceFit: true
    }, listeners: {
        itemdblclick: function (tree, record, index) {
            console.log(record);
        }
    },
    loader: new Ext.ux.tree.TreeGridLoader({
        dataUrl: contextpath + '/accounts/viewchartofaccounts?_csrf=' + csrfToken,
        requestMethod: 'POST',
        sortInfo: {
            field: 'accountNumber',
            direction: 'ASC'
        }
    }),
    bbar: new Ext.PagingToolbar({
        pageSize: 25,
        store: accountsStore,
        method: 'POST',
        displayInfo: true,
        displayMsg: 'Displaying account(s) {0} - {1} of {2}',
        emptyMsg: "No account(s) found"
    })


});


Ext.getCmp('tree-grid-panel').on('dblclick', function (node) {
    console.log(node);

    var selected = Ext.getCmp('tree-grid-panel').getSelectionModel().isSelected();

    var codeSelected = Ext.getCmp('tree-grid-panel').getSelectionModel().getSelectedNode().attributes.accountNumber;
    requirejs(
            [contextpath
                        + '/static/ext/app/finance-main/layouts/add-account.js'],
            function () {
                addAccountWindow(codeSelected);
            }

    )

    console.log('Selected::' + codeSelected);

});