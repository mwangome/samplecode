var cashbookStorePay = new Ext.data.JsonStore({
    storeId: 'cashbooks-pay',
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

cashbookStorePay.load({
    params : {
        _csrf : csrfToken
    }
});

var storePayrolls = new Ext.data.JsonStore({
    id: 'store-payrolls',
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

storePayrolls.load();

var storeMonthsPayroll = new Ext.data.JsonStore({
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

var comboRunPayrollMonths = new Ext.form.ComboBox({
    fieldLabel : 'Month',
    name : 'month',
    id : 'combo-runpayroll-months',
    width: 180,
    allowBlank : true,
    emptyText : "Select month",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : this.storeMonthsPayroll,
    valueField : 'month',
    displayField : 'month'
});

storeMonthsPayroll.load();


var comboCashbooksPay = new Ext.form.ComboBox({
    fieldLabel : 'Cashbook',
    name : 'cashbookName',
    id : 'cashbook-combo-pay',
    anchor : '95%',
    emptyText : "Cashbook",
    triggerAction : 'all',
    lazyRender : true,
    allowBlank : false,
    mode : 'remote',
    store : this.cashbookStorePay,
    valueField : 'cashbookName',
    displayField : 'cashbookName'
});

var payrollGrid = new Ext.grid.GridPanel( {
                                          title : 'Payroll',
                                          region : 'south',
                                          height : 200,
                                          id: 'payrolls-grid',
                                          minSize : 120,
                                          maxSize : 250,
                                          closable: true,
                                          cmargins : '5 0 0 0',
                                          store:storePayrolls,
                                          sm : payrolSelectModel,
                                          tbar : [
                                                  comboCashbooksPay,'-',
                                                  comboRunPayrollMonths,'-', {
                                                      xtype : 'textfield',
                                                      width : 180,
                                                      id : 'payroll-year',
                                                      emptyText : "Year (Enter Key)",
                                                      listeners: {
                                                          specialkey: function (frm, evt) {
                                                              if (evt.getKey() == evt.ENTER) {
                                                                  console.log("something happened!" + frm.getValue());
                                                                  filterPayroll();
                                                              }
                                                          }
                                                      }
                                                  },'-','->',{
                                                           xtype : 'button',
                                                           text : 'Print Payslips',
                                                           iconCls:'silk-application-view-list',
                                                           handler: function(){
                                                                     var source = '/payroll/viewmonthpayroll.action?'
                                                                                   + '&month=' +Ext.getCmp('combo-runpayroll-months').getValue()
                                                                                  + '&year=' + Ext.getCmp('payroll-year').getValue();
                                                                                   source = Ext.urlEncode({source:source});

                                                                     var contentClassList = new Ext.BoxComponent({
                                                                                            id : 'report-payslips-list',
                                                                                            title : 'Payslips Report',
                                                                                            closable : true,
                                                                                            autoEl : {
                                                                                                     tag : 'iframe',
                                                                                                     id : 'payslips-list-frame',
                                                                                                     maskMessage: 'loading ...',
                                                                                                     closable : true,
                                                                                                     frameborder : '0',
                                                                                                     width : screen.width * (90 / 100),
                                                                                                           height : screen.height * (70 / 100),
                                                                                                           src : contextpath + '/viewer?&' + source + '&reload=true&reportName=Blank_A4_1&connectionType=JSON&id=&',
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
                                                                                                          Ext.getCmp('row-panel').remove(Ext.getCmp('report-payslips-list'));
                                                                                                      }catch(e){}

                                                                        addTab(Ext.getCmp('row-panel'), Ext.getCmp('report-payslips-list'), 'Payslips Report');
                                                                        }
                                                           },'-', {
                                                      xtype : 'button',
                                                      text : 'Run Payroll',
                                                      iconCls:'silk-money',
                                                      handler: function(){
                                                          Ext.Ajax.request({
                                                              url: contextpath + '/payroll/runpayroll.action?&_csrf=' + csrfToken,
                                                              method: 'POST',
                                                              params:{
                                                                  month: Ext.getCmp('combo-runpayroll-months').getValue(),
                                                                  year : Ext.getCmp('payroll-year').getValue() ,
                                                                  cashbookName : Ext.getCmp('cashbook-combo-pay').getValue()
                                                              },
                                                              waitMsg:'Please wait, payroll running ...',
                                                              success: function (response, opts) {
                                                                  var obj = Ext.decode(response.responseText);
                                                                  console.dir(obj);
                                                                  Ext.Msg.alert('Success',obj.msg);
                                                              },
                                                              failure: function (response, opts) {
                                                                  console.log('server-side failure with status code ' + response.status);
                                                              }
                                                          })
                                                      }
                                                  },'-',{
                                                    xtype: 'button',
                                                    iconCls: 'silk-application-go',
                                                    text: 'Journalize Payroll',
                                                    handler: function(){
                                                        Ext.Ajax.request({
                                                              url: contextpath + '/payroll/journalizepayroll.action?&_csrf=' + csrfToken,
                                                              method: 'POST',
                                                              params:{
                                                                  month: Ext.getCmp('combo-runpayroll-months').getValue(),
                                                                  year : Ext.getCmp('payroll-year').getValue() ,
                                                                  cashbookName : Ext.getCmp('cashbook-combo-pay').getValue()
                                                              },
                                                              waitMsg:'Please wait ...',
                                                              success: function (response, opts) {
                                                                  var obj = Ext.decode(response.responseText);
                                                                  console.dir(obj);
                                                                  Ext.Msg.alert('Success',obj.msg);
                                                              },
                                                              failure: function (response, opts) {
                                                                  console.log('server-side failure with status code ' + response.status);
                                                              }
                                                          })
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
                                          },{
                                              header : "Name",
                                              width : 170,
                                              sortable : true,
                                              dataIndex : 'employeeNames',
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
                                              store : storePayrolls,
                                              method : 'get',
                                              displayInfo : true,
                                              displayMsg : 'Displaying members {0} - {1} of {2}',
                                              emptyMsg : "No members found"
                                          })
                                      });

function filterPayroll(){
    storePayrolls.load({
        params:{
            month: Ext.getCmp('combo-runpayroll-months').getValue(),
            year : Ext.getCmp('payroll-year').getValue() 
        }
    });
}