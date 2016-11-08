/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * CenterLayout demo panel
 */

var storeMonths = new Ext.data.JsonStore({
    proxy : new Ext.data.HttpProxy({
        url : contextpath + '/payroll/viewmonths.action',
        method : 'GET'
    }),
    baseParams : {
        _csrf : csrfToken,
        start : 0,
    },
    root : 'data',
    fields : [ 'month' ]

});

var storeBanks = new Ext.data.JsonStore({
    proxy : new Ext.data.HttpProxy({
        url : contextpath + '/cash/getbanks.action',
        method : 'POST'
    }),
    baseParams : {
        _csrf : csrfToken,
        start : 0
    },
    root : 'data',
    fields : [ 'id' , 'name', 'accountNumber']

});


var storeDebtorCreditor = new Ext.data.JsonStore({
    proxy : new Ext.data.HttpProxy({
        url : contextpath + '/cash/getdebtorcreditor.action',
        method : 'POST'
    }),
    idProperty: 'name',
    baseParams : {
        _csrf : csrfToken,
        start : 0,
    },
    root : 'data',
    fields : [ 'id' , 'name']

});


var storePayroll = new Ext.data.JsonStore({
    proxy : new Ext.data.HttpProxy({
        url : contextpath + '/payroll/viewpayroll.action',
        method : 'POST'
    }),
    baseParams : {
        _csrf : csrfToken,
        start : 0,
    },
    root : 'data',
    fields : ['employeeNames', 'year' , 'month', 'gross' , 'fees', 'advance', 'deduction', 'tax', 'nhif', 'pension', 'netPay']

});

var storeCashbook = new Ext.data.JsonStore({
    proxy : new Ext.data.HttpProxy({
        url : contextpath + '/cash/getcashbook.action',
        method : 'GET'
    }),
    baseParams : {
        _csrf : csrfToken,
        start : 0,
    },
    root : 'data',
    fields : ['Date1', 'Particulars1' , 'LF1', 'Cash1' , 'Bank1','Date2', 'Particulars2' , 'LF2', 'Cash2' , 'Bank2']

});


var storeCashbookTransactions = new Ext.data.GroupingStore({
    url : contextpath + '/cash/gettransactiontypes',
    autoLoad : true,
    method : 'POST',
    remoteGroup : true,
    storeId : 'storeCashbookTransactions',
    sortInfo : {
        field : 'transactionType',
        direction : 'ASC'
    },
    baseParams : {
        _csrf : csrfToken
    },
    reader : new Ext.data.JsonReader({
        totalProperty : 'totalCount',
        root : 'data',
        idProperty : 'id',
        fields : ['id' ,'transactionType' ]
    })
});

storeMonths.load({
    params : {
        _csrf : csrfToken
    }
});

storeCashbookTransactions.load({
    params : {
        _csrf : csrfToken
    }
});

storeCashbook.load({
    params : {
        _csrf : csrfToken
    }
});

storeBanks.on('beforeload', function(store, operation) {
    operation.params = operation.params || {};
    operation.params.status = 2;
    operation.params._csrf = csrfToken;
    operation.params.cashbookName = getCashbookName();
});

storeDebtorCreditor.load({
    params : {
        _csrf : csrfToken
    }
});

var comboPayrollMonths = new Ext.form.ComboBox({
    fieldLabel : 'Month',
    name : 'month',
    id : 'combo-payroll-months',
    width: 150,
    allowBlank : false,
    emptyText : "Select action",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : this.storeMonths,
    valueField : 'month',
    displayField : 'month'
});

var cashbookStore = new Ext.data.JsonStore({
    proxy : new Ext.data.HttpProxy({
        url : contextpath + '/cash/getcashbooks.action',
        method : 'POST'
    }),
    baseParams : {
        _csrf : csrfToken,
        start : 0,
    },
    root : 'data',
    fields : ['id', 'cashbookName' ]

});

cashbookStore.load({
    params : {
        _csrf : csrfToken
    }
});
var cashbookCombo = new Ext.form.ComboBox({
    store: cashbookStore,
    fieldLabel : 'Cashbook',
    displayField: 'cashbookName',
    typeAhead: false,
    ditable: true,
    name: 'cashbookName',
    width: 210,
    mode: 'remote',
    forceSelection: false,
    triggerAction: 'all',
    emptyText: 'Select a cashbook...',
    selectOnFocus: true,
    listeners:{
        select: function(combo, record, index){
            var cashbookName = record.get('cashbookName');
            storeBanks.load({
                params : {
                    _csrf : csrfToken,
                    cashbookName : cashbookName
                }
            });
            storeCashbook.load({
                params : {
                    _csrf : csrfToken,
                    cashbookName : cashbookName
                }
            });
        }
    }
});


var bankCombo = new Ext.form.ComboBox({
    store: storeBanks,
    fieldLabel : 'Banks',
    autoLoad:false, 
    displayField: 'name',
    typeAhead: false,
    name: 'bankName',
    editable: true,
    width: 210,
    mode: 'remote',
    forceSelection: false,
    triggerAction: 'all',
    emptyText: 'Select a bank...',
    selectOnFocus: true,
    listeners: {        
        beforequery: function(queryEvent, eOpts) {
            queryEvent.combo.store.proxy.extraParams = {
                    _csrf : csrfToken,
                    cashbookName : getCashbookName()
            }
          }
    }
   
});


var debtorCreditorCombo = new Ext.form.ComboBox({
    store: storeDebtorCreditor,
    fieldLabel : 'Dr/Cr',
    displayField: 'name',
    editable: true,
    typeAhead: false,
    name: 'debtorCreditorName',
    width: 210,
    mode: 'remote',
    forceSelection: false,
    triggerAction: 'all',
    emptyText: 'Select a Dr/Cr...',
    selectOnFocus: true
});

var transactionTypeCombo = new Ext.form.ComboBox({
    store: storeCashbookTransactions,
    fieldLabel : 'Transaction',
    displayField: 'id',
    valueField: 'transactionType',
    typeAhead: true,
    name: 'transactionType',
    width: 210,
    mode: 'remote',
    hiddenName : 'transactionType',
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select a transaction ...',
    selectOnFocus: true,
    listeners: { 
        select: function(combo, record, index) { 
            console.log('selected::' + record.data.transactionType);
            if(record.data.transactionType == 'DEPOSIT'
                ||record.data.transactionType == 'WITHDRAWAL'
                    ||record.data.transactionType == 'CASH_AT_BANK'
                        ||record.data.transactionType == 'BANK_CHARGES'
                            ||record.data.transactionType == 'CASH_IN_HAND'){
                debtorCreditorCombo.hide();
                debtorCreditorCombo.setValue('');
            }else{
                debtorCreditorCombo.show();
            }
            if(record.data.transactionType == 'CASH_IN_HAND'
                ||record.data.transactionType == 'CASH_RECEIPT'
                    ||record.data.transactionType == 'CASH_PAYMENT'){
                bankCombo.hide();
                bankCombo.setValue('');
            }else{
                bankCombo.show();
            }
        } 
    }
});

var cashbookSelectModel = new Ext.grid.CheckboxSelectionModel();
var centerLayout = new Ext.TabPanel({
    activeTab: 0,
    title: 'Financial Operations',
    plain: true,
    id: 'center-panel',
    defaults: {
        autoScroll: true
    },
    items:{
        id: 'border-panel',
        title: 'Financial Operations',
        layout: 'border',
        bodyBorder: false,
        defaults: {
            collapsible: true,
            split: true,
            animFloat: false,
            autoHide: false,
            useSplitTips: true,
            bodyStyle: 'padding:15px'
        },
        items: [new Ext.grid.GridPanel(
                {
                    title: 'Cashbook',
                    store : storeCashbook,
                    region: 'south',
                    height: 200,
                    minSize: 75,
                    maxSize: 250,
                    id : 'cashbook-grid',
                    sm : cashbookSelectModel,
                    viewConfig : {
                        forceFit : true
                    },
                    loadMask : true,
                    stripeRows : true,
                    // bbar : pagingBar,
                    tbar : [
                            {
                                xtype : 'button',
                                text : 'Print Cashbook',
                                iconCls : 'member',
                                handler: function(){
                                    var enc = Ext.urlEncode({cashbookName:Ext.getCmp('cashbook-form').getForm().findField('cashbookName').getValue()});
                                    var source = '/cash/getcashbookreport.action?&_csrf=' + csrfToken + '&' + enc;
                                    source = Ext.urlEncode({source:source});
                                    var contentClassList = new Ext.BoxComponent({

                                        id : 'cashbook-report',
                                        title : 'Cashbook Report',
                                        closable : true,
                                        autoEl : {
                                            tag : 'iframe',
                                            id : 'cashbook-report-frame', 
                                            maskMessage: 'loading ...', 
                                            closable : true,
                                            frameborder : '0',
                                            width : screen.width * (90 / 100),
                                            height : screen.height * (70 / 100),
                                            src : contextpath + '/viewer?&' + source + '&reload=true&reportName=cashbook&connectionType=JSON&id=&',
                                            autoLoad: true
                                         },
                                        listeners : {
                                            afterrender : function() {
                                                console.log('rendered');

                                                this.getEl().on('load', function() {
                                                            console.log('loaded');
                                                             
                                                        });
                                            
                                            }
                                        }
                                    });
                                    try{
                                        Ext.getCmp('center-panel').remove(Ext.getCmp('cashbook-report'));
                                    }catch(e){
                                        
                                    }
                                    
                                    addTab(Ext.getCmp('center-panel'), Ext.getCmp('cashbook-report'), 'Cashbook Report');
                                }

                            }],
                    columns : [ cashbookSelectModel, {
                        header : "Date",
                        width : 100,
                        sortable : true,
                        dataIndex : 'Date1',
                        hidden : false,
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Particulars",
                        width : 150,
                        sortable : true,
                        dataIndex : 'Particulars1',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "LF",
                        width : 70,
                        sortable : true,
                        dataIndex : 'LF1',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Cash",
                        width : 150,
                        sortable : true,
                        dataIndex : 'Cash1',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Bank",
                        width : 150,
                        sortable : true,
                        dataIndex : 'Bank1',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Date",
                        width : 100,
                        sortable : true,
                        dataIndex : 'Date2',
                        hidden : false,
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Particulars",
                        width : 150,
                        sortable : true,
                        dataIndex : 'Particulars2',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "LF",
                        width : 70,
                        sortable : true,
                        dataIndex : 'LF2',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Cash",
                        width : 150,
                        sortable : true,
                        dataIndex : 'Cash2',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Bank",
                        width : 150,
                        sortable : true,
                        dataIndex : 'Bank2',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }

                    ],
                    bbar : new Ext.PagingToolbar({
                        pageSize : 25,
                        store : storeCashbook,
                        method : 'get',
                        displayInfo : true,
                        displayMsg : 'Displaying cashbook items {0} - {1} of {2}',
                        emptyMsg : "No cashbook items found"
                    })
                }), {
            title: 'Navigation',
            region: 'west',
            collapsed: true,
            floatable: false,
            margins: '5 0 0 0',
            cmargins: '5 5 0 0',
            width: 175,
            minSize: 100,
            maxSize: 250,
            html: '<p>Details</p>'
        }, new Ext.FormPanel({
            region: 'center',
            labelWidth: 75,
            url: contextpath + '/cash/savecashbookitems.action?&_csrf=' + csrfToken,
            method: 'POST',
            frame: true,
            title: 'Cashbooks',
            bodyStyle: 'padding:5px 5px 0',
            width: 350,
            id: 'cashbook-form',
            items: [ {
                xtype: 'fieldset',
                title: 'Cashbook Details',
                collapsible: true,
                autoHeight: true,
                defaults: {
                    width: 210
                },
                defaultType: 'textfield',
                items: [
                    cashbookCombo, 
                     {
                        xtype: 'compositefield',
                        fieldLabel: 'Transaction',
                        msgTarget: 'side',
                        anchor: '-20',
                        defaults: {
                            flex: 1
                        },
                        items: [
                                transactionTypeCombo, 
                                debtorCreditorCombo
                                ]
                    },
                    bankCombo,{
                        fieldLabel: 'Trans. Date',
                        xtype: 'datefield',
                        format: 'd/m/Y',
                        name : 'hdate',
                        value: new Date(),
                        width : 210
                    },{
                        fieldLabel: 'Trans. Date',
                        xtype: 'datefield',
                        format: 'm/d/Y',
                        name : 'date',
                        hidden: true,
                        value: new Date(),
                        width : 210
                    }, {
                    fieldLabel: 'Amount',
                    name: 'amount'
                }]
            }],

            buttons: [{
                text: 'Save',
                handler: function(){
                    var form = Ext.getCmp('cashbook-form').getForm();
                    if(form.isValid()){
                        form.findField('hdate').getValue()
                        var val = Ext.getCmp('cashbook-form').getForm();
                        var date = val.findField('hdate').getValue();
                        var fdate = date.format('m/d/Y');
                        form.findField('date').setValue(fdate);
                        form.submit({
                            success: function(form, response){
                                var json = JSON.parse(response.response.responseText);
                                console.log(response.response.responseText);
                                Ext.MessageBox.show({
                                    title: 'Server Response',
                                    msg : json.msg,
                                    icon : Ext.MessageBox.INFO,
                                    buttons: Ext.MessageBox.OK
                                }                                       
                                );
                                cashbookStore.load({
                                    params : {
                                        _csrf : csrfToken
                                    }
                                });

                                storeBanks.load({
                                    params : {
                                        _csrf : csrfToken
                                    }
                                });

                                storeDebtorCreditor.load({
                                    params : {
                                        _csrf : csrfToken
                                    }
                                });
                                
                                storeCashbook.load({
                                    params : {
                                        _csrf : csrfToken,
                                        cashbookName : Ext.getCmp('cashbook-form').getForm().findField('cashbookName').getValue()
                                    }
                                });
                                 
                            },failure: function(form, response){
                                console.log(response.response.responseText);
                                var json = JSON.parse(response.response.responseText);
                                Ext.MessageBox.show({
                                    title: 'Server Response',
                                    msg : json.msg,
                                    icon : Ext.MessageBox.WARNING,
                                    buttons: Ext.MessageBox.OK
                                })
                            }
                        });
                    }
                }
            }, {
                text: 'Cancel'
            }]
        })]
    },  
    autoDestroy: false,
    listeners: {
        remove: function(tabPanel,tab) {
                Ext.Msg.alert('Closed ' + tab.id, 'Removed!');
                if(tab.id == 'pay-staff'
                    ||tab.id == 'payrolls-grid'){
                    
                }else{
                    tab.destroy();
                }
        }
}
    }
     
);

require.config({    
    waitSeconds: 0
  });
requirejs(
        [ contextpath
                + '/static/ext/app/finance-main/layouts/trial-balance.js' ],
        function() {
             addTab(Ext.getCmp('center-panel'), Ext.getCmp('tbl-grid'), 'Trial Balance');
             Ext.getCmp('center-panel').setActiveTab(0);
        }

)

function getCashbookName(){
    var cashbookName = '';
    try{
        cashbookName = Ext.getCmp('cashbook-form').getForm().findField('cashbookName').getValue();
    }catch(e){
        
    }
    console.log('getting cashbook name for ya ...');
    return cashbookName;
}

var storeEmployee = new Ext.data.JsonStore({
    url : contextpath + '/employee/view.action',
    groupField : 'gender',
    totalProperty : 'totalCount',
    remoteGroup : true,
    root : 'data',
    baseParams : {
        _csrf : csrfToken
    },
    fields : [ 'id', 'firstName', 'otherNames', 'surname', 'dateOfBirth', 'idNumber', 'gender' ]
});

storeEmployee.load({
    params:{
        start: 0,
        limit : 25
    }
});

var selectModelStaff = new Ext.grid.CheckboxSelectionModel();

var employeesGrid = new Ext.grid.GridPanel(
        {
            title: 'Staff List',
            store : storeEmployee,
            id : 'employees-grid',
            sm : selectModelStaff,
            viewConfig : {
                forceFit : true
            },
            loadMask : true,
            stripeRows : true,
            // bbar : pagingBar,
            tbar : [
                    {
                        xtype : 'splitbutton',
                        text : 'Employee',
                        iconCls : 'member',
                        handler: function(){
                            requirejs(
                                    [ contextpath
                                            + '/static/ext/app/finance-main/layouts/employee-form.js' ],
                                    function() {
                                        getEmployeeWindow();
                                    }

                            )
                        },
                        menu : {
                            items : [
                                    {
                                        text : 'Add Employee',
                                        handler : function() {
                                            requirejs(
                                                    [ contextpath
                                                            + '/static/ext/app/finance-main/layouts/employee-form.js' ],
                                                    function() {
                                                        getEmployeeWindow();
                                                    }

                                            )
                                            
                                        }
                                    }, '-', {
                                        text : '<i>View Employees List</i>',
                                        handler : function() {
                                            var source = "/employee/reportlist.action";
                                            source = Ext.urlEncode({source:source});
                                            var contentClassList = new Ext.BoxComponent({

                                                id : 'report-employees-list',
                                                title : 'Employees List',
                                                closable : true,
                                                autoEl : {
                                                    tag : 'iframe',
                                                    id : 'employees-list-frame', 
                                                    maskMessage: 'loading ...', 
                                                    closable : true,
                                                    frameborder : '0',
                                                    width : screen.width * (90 / 100),
                                                    height : screen.height * (70 / 100),
                                                    src : contextpath + '/viewer?&' + source + '&reload=true&reportName=employeesList&connectionType=JSON&id=&',
                                                    autoLoad: true
                                                 },
                                                listeners : {
                                                    afterrender : function() {
                                                        console.log('rendered');

                                                        this.getEl().on('load', function() {
                                                                    console.log('loaded');
                                                                   
                                                                });
                                                    }
                                                }
                                            });
                                            
                                            addTab(Ext.getCmp('row-panel'), Ext.getCmp('report-employees-list'), 'Employees List Report');
                                                    
                                        }
                                    } ]
                        }

                    },{
                        text: 'Payments',
                        iconCls:'silk-money',
                        menu:[
                              {
                                  text: 'Pay Salary',
                                  handler: function(){
                                      addTab(Ext.getCmp('row-panel'), Ext.getCmp('pay-staff'), 'Pay Staff');  
                                      Ext.getCmp('pay-salary-form').getForm().reset();
                                      
                                      storePayroll.load({
                                          params : {
                                              _csrf : csrfToken,
                                              employeeId: getSelectedEmployeeId()
                                          }
                                      });
                                      
                                      Ext.getCmp('pay-salary-form').getForm().load({
                                          url : contextpath + '/employee/loadform.action',
                                          params : {
                                              start: 0,
                                              limit: 25,
                                              id : getSelectedEmployeeId(),
                                              _csrf : csrfToken
                                          },
                                          waitMsg : 'Loading'
                                      });
                                    
                                     
                                  }
                              }, {
                                  text: 'Payroll Register',
                                  handler: function(){
                                      
                                      
                                      requirejs([contextpath + "/static/ext/app/finance-main/layouts/payroll-grid.js"], function(util) {
                                          var payGrid = Ext.getCmp('payrolls-grid');
                                          addTab(Ext.getCmp('row-panel'), payGrid, 'Payroll Register');
                                      });
                                  }
                              }, {
                                  text: 'Payroll Report',
                                  handler: function(){
                                      showPayrollReport();
                                  }
                              }
                              ]
                    }, '->', new Ext.form.TwinTriggerField({
                        xtype : 'twintriggerfield',
                        trigger1Class : 'x-form-clear-trigger',
                        trigger2Class : 'x-form-search-trigger',
                        emptyText : 'ID No.',
                        onTrigger1Click : function() {
                            this.setValue('');
                        },
                        onTrigger2Click : function() {
                            var partNumber = this.getValue();
                            storeEmployee.load({
                                params : {
                                    start : 0,
                                    limit : 25,
                                    _csrf : csrfToken,
                                    idNumber : partNumber
                                }
                            });
                        },
                        listeners : {
                            specialkey : function(f, e) {
                                if (e.getKey() == e.ENTER) {
                                    var partNumber = this.getValue();
                                    storeEmployee.load({
                                        params : {
                                            start : 0,
                                            limit : 25,
                                            _csrf : csrfToken,
                                            idNumber : partNumber
                                        }
                                    });
                                }
                            }
                        }
                    }) ],
            columns : [ selectModelStaff, {
                header : "Nat. ID.",
                width : 170,
                sortable : true,
                dataIndex : 'idNumber',
                hidden : false,
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
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
                header : "First Name",
                width : 170,
                sortable : true,
                dataIndex : 'firstName',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Last Name",
                width : 150,
                sortable : true,
                dataIndex : 'surname',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Other Names",
                width : 150,
                sortable : true,
                dataIndex : 'otherNames',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Gender",
                width : 150,
                sortable : true,
                dataIndex : 'gender',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }

            ],
            bbar : new Ext.PagingToolbar({
                pageSize : 25,
                store : storeEmployee,
                method : 'get',
                displayInfo : true,
                displayMsg : 'Displaying members {0} - {1} of {2}',
                emptyMsg : "No members found"
            })
        });

var cashbookSelectModel = new Ext.grid.CheckboxSelectionModel();



employeesGrid.on('celldblclick', function(grid, rindx, cindx, e) {
    // var cf =
    // Ext.ComponentMgr.create(CourseForm);
    var id = grid.getStore().getAt(rindx).get('id');
    console.log('double clicked ..' + id);
    requirejs(
            [ contextpath
                    + '/static/ext/app/finance-main/layouts/employee-form.js' ],
            function() {
                getEmployeeWindow(id);
            }

    )
    // fillProperties();
});


var rowLayout = new Ext.TabPanel({
    activeTab: 0,
    
    plain: true,
    id: 'row-panel',
    defaults: {
        autoScroll: true
    },
    items: employeesGrid,  
    autoDestroy: false,
    listeners: {
        remove: function(tabPanel,tab) {
                Ext.Msg.alert('Closed ' + tab.id, 'Removed!');
                if(tab.id == 'pay-staff'
                    ||tab.id == 'payrolls-grid'){
                    
                }else{
                    tab.destroy();
                }
        }
}
    }
     
);



function handleActivate(tab) {
    alert(tab.title + ' was activated.');
}

/*
 * RowLayout demo panel
 */


var payrolSelectModel = new Ext.grid.CheckboxSelectionModel();
var border = {
        id : 'pay-staff',
        title : 'Pay Staff',
        closable: true,
        layout : 'border',
        bodyBorder : false,
        defaults : {
            collapsible : true,
            split : true,
            animFloat : false,
            autoHide : false,
            useSplitTips : true,
            bodyStyle : 'padding:15px'
                
        },
        items : [
                new Ext.grid.GridPanel( {
                    title : 'Payroll',
                    region : 'south',
                    height : 200,
                    id: 'payslips-grid',
                    minSize : 120,
                    maxSize : 250,
                    cmargins : '5 0 0 0',
                    store:storePayroll,
                    sm : payrolSelectModel,
                    tbar : [
                            {
                                xtype : 'button',
                                text : 'Print Payslip',
                                iconCls:'silk-money',
                                handler: function(){
                                    var source = '/payroll/viewmonthpayslip.action?'
                                        + '&idNumber=' +Ext.getCmp('employees-grid').getSelectionModel().getSelected().get('idNumber')
                                        + '&month=' +Ext.getCmp('payslips-grid').getSelectionModel().getSelected().get('month')
                                        + '&year=' + Ext.getCmp('payslips-grid').getSelectionModel().getSelected().get('year');
                                    source = Ext.urlEncode({source:source});
                                    var contentClassList = new Ext.BoxComponent({

                                        id : 'report-payslip-list',
                                        title : 'Payslip Report',
                                        closable : true,
                                        autoEl : {
                                            tag : 'iframe',
                                            id : 'payslip-list-frame', 
                                            maskMessage: 'loading ...', 
                                            closable : true,
                                            frameborder : '0',
                                            width : screen.width * (90 / 100),
                                            height : screen.height * (70 / 100),
                                            src : contextpath + '/viewer?&' + source + '&reload=true&reportName=payslip&connectionType=JSON&id=&',
                                            autoLoad: true
                                         },
                                        listeners : {
                                            afterrender : function() {
                                                console.log('rendered');

                                                this.getEl().on('load', function() {
                                                            console.log('loaded');
                                                             
                                                        });
                                            
                                            }
                                        }
                                    });
                                    try{
                                        Ext.getCmp('row-panel').remove(Ext.getCmp('report-payslip-list'));
                                    }catch(e){
                                        
                                    }
                                    
                                    addTab(Ext.getCmp('row-panel'), Ext.getCmp('report-payslip-list'), 'Payslip Report');
                                }
                            }],
                    viewConfig : {
                        forceFit : true
                    },
                    loadMask : true,
                    stripeRows : true,
                    columns : [ payrolSelectModel, {
                        header : "Year",
                        width : 170,
                        sortable : true,
                        dataIndex : 'year',
                        hidden : false,
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Month",
                        width : 170,
                        sortable : true,
                        dataIndex : 'month',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Gross",
                        width : 170,
                        sortable : true,
                        dataIndex : 'gross',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "Advance",
                        width : 170,
                        sortable : true,
                        dataIndex : 'advance',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "P.A.Y.E",
                        width : 170,
                        sortable : true,
                        dataIndex : 'tax',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }, {
                        header : "N.S.S.F",
                        width : 170,
                        sortable : true,
                        dataIndex : 'pension',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    },{
                        header : "N.H.I.F",
                        width : 170,
                        sortable : true,
                        dataIndex : 'nhif',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    },{
                        header : "Net Pay.",
                        width : 170,
                        sortable : true,
                        dataIndex : 'netPay',
                        editor : {
                            xtype : 'textfield',
                            allowBlank : false
                        }
                    }],
                    bbar : new Ext.PagingToolbar({
                        pageSize : 25,
                        store : storePayroll,
                        method : 'get',
                        displayInfo : true,
                        displayMsg : 'Displaying members {0} - {1} of {2}',
                        emptyMsg : "No members found"
                    })
                }),
                {
                    title : 'Details',
                    region : 'west',
                    floatable : false,
                    collapsed: true,
                    margins : '5 0 0 0',
                    cmargins : '5 5 0 0',
                    width : 175,
                    minSize : 100,
                    maxSize : 250,
                    html : '<p>Details</p>'
                },{
                    xtype: 'form',
                    url:contextpath + '/payroll/savepay.action',
                    method: 'POST',
                    title: 'Pay Staff',
                    layout: 'column',
                    frame: true,
                    margins : '5 0 0 0',
                    region : 'center',
                    border:false,
                    id:'pay-salary-form',
                    labelAlign: 'left',
                    defaults: {
                       xtype: 'container',
                       layout: 'form',
                       columnWidth: 0.5
                    },
                    items: [{
                        defaults: {width: 200},
                        defaultType: 'textfield',
                       items: [{
                           fieldLabel: 'csrf',
                           name: '_csrf',
                           value: csrfToken,
                           allowBlank:false,
                           hidden:true
                       },{
                           fieldLabel: 'Gross',
                           name: 'gross',
                           allowBlank:false
                       },{
                               fieldLabel: 'Deductions',
                               name: 'deduction',
                               value: 0,
                               hidden: true
                           },{
                               fieldLabel: 'Months',
                               hidden: true,
                               name: 'months'
                           }, {
                               fieldLabel: 'Employee ID',
                               name: 'employeeId',
                               value: '',
                               hidden: true
                           },{
                               fieldLabel: 'Net Pay',
                               name: 'netPay',
                               value: 0,
                               hidden: true
                           },comboPayrollMonths,{
                               fieldLabel: 'Year',
                               emptyText:'Year',
                               name: 'year'
                           },{
                                 fieldLabel: 'Advance',
                                 name: 'advance'
                             },{
                                 fieldLabel: 'Off Duty Fee',
                                 name: 'offDutyFee'
                             }
                       ]
                    }], buttons: [{
                        text: 'Save',
                        handler: function(){
                           var form = Ext.getCmp('pay-salary-form').getForm();
                           form.findField('employeeId').setValue(getSelectedEmployeeId());
                           
//                           var oDuty = form.findField('offDutyFee').getValue();
//                           var mAllow = form.findField('medicalAllowance').getValue();
//                           var hAllow = form.findField('houseAllowance').getValue();
//                           var sCharge = form.findField('saccoCharge').getValue();
//                           var wCharge = form.findField('welfareCharge').getValue();
//                           if(oDuty == ''){
//                               form.findField('offDutyFee').setValue('0')
//                           }if(mAllow == ''){
//                               form.findField('medicalAllowance').setValue('0')
//                           }if(hAllow == ''){
//                               form.findField('houseAllowance').setValue('0')
//                           }if(sCharge == ''){
//                               form.findField('saccoCharge').setValue('0')
//                           }if(wCharge == ''){
//                               form.findField('welfareCharge').setValue('0')
//                           }
                           if(form.isValid()){
                               form.submit({
                                   success: function(form, response){
                                       
                                       var res = Ext.decode(response.response.responseText);
                                       Ext.Msg.show({
                                           title: 'Success',
                                           msg: res.msg,
                                           buttons: Ext.Msg.OK,
                                           icon: Ext.Msg.INFO
                                       });
                                       storePayroll.load({
                                           params : {
                                               _csrf : csrfToken,
                                               employeeId: getSelectedEmployeeId()
                                           }
                                       });
                                   },failure: function(form, response){
                                       var res = Ext.decode(response.response.responseText);
                                       Ext.Msg.show({
                                           title: 'Failure',
                                           msg: 'Failed to save payment',
                                           buttons: Ext.Msg.OK,
                                           icon: Ext.Msg.ERROR
                                       })
                                   }
                               })
                           }
                        }
                    },{
                        text: 'Cancel'
                    }]
                 }]
    };





function getSelectedEmployeeId(){
    if(Ext.getCmp('employees-grid').getSelectionModel().hasSelection()){
        return Ext.getCmp('employees-grid').getSelectionModel().getSelected().get('id');
    }else{
        Ext.Msg.show({
            title: 'No Selection',
            modal: true,
            msg: 'Select employee then click pay salary!',
            buttons:Ext.Msg.OK,
            icon:Ext.Msg.WARNING
                
        })
        return 0;
    }
}

Ext.onReady(function() {
    storePayroll.load({
        params : {
            _csrf : csrfToken,
            employeeId: getSelectedEmployeeId()
        }
    });

})

var win;
function showPayrollReport(){
    var simple = new Ext.FormPanel({
        labelWidth: 75, // label settings here cascade unless overridden
        frame: true,
        
        bodyStyle: 'padding:5px 5px 0',
        width: 350,
        defaults: {
            width: 340
        },
        defaultType: 'textfield',

        items: [{
            fieldLabel: 'Year',
            name: 'year',
            id: 'payroll-year',
            allowBlank: false
        }, new Ext.form.ComboBox({
            fieldLabel : 'Month',
            name : 'month',
            id : 'payroll-month',
            width: 340,
            allowBlank : false,
            emptyText : "Select action",
            triggerAction : 'all',
            lazyRender : true,
            mode : 'remote',
            store : this.storeMonths,
            valueField : 'month',
            displayField : 'month'
        })],

        buttons: [{
            text: 'Generate',
            handler: function(){
                var source = '/payroll/viewmonthpayroll.action?&month=' +Ext.getCmp('payroll-month').getValue()+ '&year=' + Ext.getCmp('payroll-year').getValue();
                source = Ext.urlEncode({source:source});
                var contentClassList = new Ext.BoxComponent({

                    id : 'report-payroll-list',
                    title : 'Payroll List Report',
                    closable : true,
                    autoEl : {
                        tag : 'iframe',
                        id : 'payroll-list-frame', 
                        maskMessage: 'loading ...', 
                        closable : true,
                        frameborder : '0',
                        width : screen.width * (90 / 100),
                        height : screen.height * (70 / 100),
                        src : contextpath + '/viewer?&' + source + '&reload=true&reportName=payrollList&connectionType=JSON&id=&',
                        autoLoad: true
                     },
                    listeners : {
                        afterrender : function() {
                            console.log('rendered');

                            this.getEl().on('load', function() {
                                        console.log('loaded');
                                       
                                    });
                        }
                    }
                });
                try{
                    Ext.getCmp('row-panel').remove(Ext.getCmp('report-payroll-list'));
                }catch(e){
                    
                }
                
                addTab(Ext.getCmp('row-panel'), Ext.getCmp('report-payroll-list'), 'Payroll List Report');
                Ext.getCmp('payroll-window').close();
            }
        }, {
            text: 'Cancel',
            handler: function(){
                Ext.getCmp('payroll-window').close();
            }
        }]
    });
    
    
        win = new Ext.Window({
            layout: 'fit',
            title: 'Payroll Report',
            id: 'payroll-window',
            width: 500,
            height: 180,
            closeAction: 'close',
            plain: true,

            items: simple
        });
    
    Ext.getCmp('payroll-window').show();
}



