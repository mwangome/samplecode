var storetbl = new Ext.data.JsonStore({
    storeId : 'storetb',
    baseParams : {
        _csrf : csrfToken
    },
    proxy : new Ext.data.HttpProxy({
        url : contextpath + '/fina/gettrialbalance.action',
        method : 'GET'
    }),
    root : 'data',
    fields : ['particulars' , 'credit_amount', 'debit_amount']
});

var date = new Date();
var year = date.format('Y');
storetbl.load({
    params:{
        year:year
    }
});
storetbl.on('beforeload', function(store, operation) {
    operation.params = operation.params || {};
    operation.params.year = year;
    operation.params._csrf = csrfToken;
});
var selectModelTB = new Ext.grid.CheckboxSelectionModel();

var gridTbl = new Ext.grid.GridPanel(
        {
            title : 'Trial Balance',
            store : storetbl,
            id : 'tbl-grid',
            sm : selectModelTB,
            closable: true,
            viewConfig : {
                forceFit : true
            },
            loadMask : true,
            stripeRows : true,
            // bbar : pagingBar,
            tbar : [
                    
                    {
                        xtype : 'button',
                        text : 'Trial Balance',
                        iconCls:'silk-money',
                        handler: function(){
                            
                        }

                    } ],
            columns : [ selectModelTB, {
                header : "ID",
                width : 170,
                sortable : true,
                dataIndex : 'id',
                hidden : true,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Particulars",
                width : 170,
                sortable : true,
                dataIndex : 'particulars',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Dr",
                width : 150,
                sortable : true,
                dataIndex : 'debit_amount',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Cr",
                width : 150,
                sortable : true,
                dataIndex : 'credit_amount',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }

            ],
            bbar : new Ext.PagingToolbar({
                pageSize : 25,
                store : storetbl,
                method : 'get',
                displayInfo : true,
                displayMsg : 'Displaying balances {0} - {1} of {2}',
                emptyMsg : "No balances found"
            })
        });