var stockLedgerStore = new Ext.data.JsonStore({
    id: 'stockledger-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/stockledgers/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'unitOfIssue', 'averageUnitCost', 'averageUnitPrice', 'storeName', 'stockName', 'qtyBalance', 'closingStock']

});

var stockLedgerSelectModel = new Ext.grid.CheckboxSelectionModel();

var stockLedgerGridPanel = new Ext.grid.GridPanel(
        {
            store: stockLedgerStore,
            height: 200,
            minSize: 75,
            maxSize: 250,
            id: 'stockledgers-grid-panel',
            sm: stockLedgerSelectModel,
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
                    text: 'View Stock Ledger',
                    iconCls: 'silk-comment-add',
                    handler: function () {

                    }

                }],
            columns: [stockLedgerSelectModel, {
                    header: 'Id',
                    width: 160,
                    hidden: true,
                    sortable: true,
                    dataIndex: 'id'
                }, {
                    header: 'Stock Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'stockName'
                }, {
                    header: 'Store Name',
                    width: 75,
                    sortable: true,
                    dataIndex: 'storeName'
                }, {
                    header: 'Unit of Issue',
                    width: 75,
                    sortable: true,
                    dataIndex: 'unitOfIssue'
                }, {
                    header: 'Average Unit Cost',
                    width: 75,
                    sortable: true,
                    dataIndex: 'averageUnitCost'
                }, {
                    header: 'Average Unit Price',
                    width: 75,
                    sortable: true,
                    dataIndex: 'averageUnitPrice'
                }, {
                    header: 'Qty Balance',
                    width: 75,
                    sortable: true,
                    dataIndex: 'qtyBalance'
                }, {
                    header: 'Closing Stock',
                    width: 75,
                    sortable: true,
                    dataIndex: 'closingStock'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: stockLedgerStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying ledger(s) {0} - {1} of {2}',
                emptyMsg: "No ledger(s) found"
            })
        });


stockLedgerStore.load();