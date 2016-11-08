var changed = false;
var employeeGenderCombo = new Ext.form.ComboBox({
    fieldLabel: 'Gender',
    store : [ "Male", "Female" ], // direct array data
    typeAhead : true,
    name: 'gender',
    id : 'employee-gender',
    triggerAction : 'all',
    emptyText : 'Select a gender...',
    selectOnFocus : true,
    width : 230
});


var employeeFormPanel = new Ext.FormPanel({
    labelAlign : 'top',
    method: 'POST',
    url: contextpath + '/employee/submitEmployee' ,
    bodyStyle : 'padding:5px',
    id : 'employee-window',
    width : 600,
    items : [ {
        layout : 'column',
        border : false,
        items : [ {
            columnWidth : .5,
            layout : 'form',
            border : false,
            items : [ {
                xtype : 'textfield',
                fieldLabel : 'csrf',
                name : '_csrf',
                value: csrfToken,
                hidden : true,
                anchor : '95%'
            },  {
                xtype : 'textfield',
                fieldLabel : 'ID',
                name : 'id',
                hidden: true,
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : 'First Name',
                name : 'firstName',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : 'Other Names',
                name : 'otherNames',
                anchor : '95%'
            } ]
        }, {
            columnWidth : .5,
            layout : 'form',
            border : false,
            items : [ {
                xtype : 'textfield',
                fieldLabel : 'Last Name',
                name : 'surname',
                anchor : '95%'
            } , {
                xtype: 'datefield',
                fieldLabel : 'Date of Birth',
                name : 'dateOfBirth',
                anchor : '95%',
                format: 'd/m/Y',
                submitFormat: 'Y-m-d',
                allowBlank : false
            } ]
        } ]
    }, {
        xtype : 'tabpanel',
        plain : true,
        activeTab : 0,
        height : 235,
        /*
         * By turning off deferred rendering we are guaranteeing that the form
         * fields within tabs that are not activated will still be rendered.
         * This is often important when creating multi-tabbed forms.
         */
        deferredRender : false,
        defaults : {
            bodyStyle : 'padding:10px'
        },
        items : [ {
            title : 'Personal Details',
            layout : 'form',
            defaults : {
                width : 230
            },
            defaultType : 'textfield',

            items : [  employeeGenderCombo, {
                fieldLabel : 'ID Number',
                name : 'idNumber',
                allowBlank: false
            } ]
        }, {
            title : 'Phone Numbers',
            layout : 'form',
            defaults : {
                width : 230
            },
            defaultType : 'textfield',

            items : [ {
                fieldLabel : 'Home',
                name : 'home'
            }, {
                fieldLabel : 'Business',
                name : 'business'
            }, {
                fieldLabel : 'Mobile',
                name : 'mobile'
            }, {
                fieldLabel : 'E-mail',
                name : 'email',
                vtype: 'email'
            } ]
        }, {
            cls : 'x-plain',
            title : 'Biography',
            layout : 'fit',
            items : {
                xtype : 'htmleditor',
                id : 'employee-biography',
                name: 'biography',
                fieldLabel : 'Biography'
            }
        },  {
            title : 'Salary Information',
            
            items : [ {
                layout : 'column',
                border : false,
                items : [ {
                    columnWidth : .5,
                    layout : 'form',
                    border : false,
                  //layout : 'form',
                    labelAlign: 'top',
                    defaults : {
                        anchor : '95%'
                    },
                    defaultType : 'textfield',
                    items : [ new Ext.form.TextField({
                        name:'basicPay',
                        fieldLabel: 'Basic Pay',
                        listeners: {
                          'change': function(){
                          }
                        }
                      }),{
                          fieldLabel: 'Sacco Deductions',
                          name: 'saccoCharge'
                      },{
                          fieldLabel: 'Welfare Deductions',
                          name: 'welfareCharge',
                          id: 'welfareCharge'
                      },{
                          fieldLabel: 'House Allowance',
                          name: 'houseAllowance',
                          id: 'houseAllowance'
                      } ]
                },{
                    columnWidth : .5,
                    layout : 'form',
                    border : false,
                  //layout : 'form',
                    labelAlign: 'top',
                    defaults : {
                        anchor : '95%'
                    },
                    defaultType : 'textfield',
                    items : [  {
                        fieldLabel: 'Medical Allowance',
                        xtype: 'textfield',
                        name: 'medicalAllowance',
                        id: 'medicalAllowance',
                    }]}
                ]
            }
            ]
            
        } ]
    } ]
});

var employeeWin;
function getEmployeeWindow(employeeId) {
    Ext.getCmp('employee-window').getForm().reset();
    Ext.getCmp('employee-window').getForm().findField('_csrf').setValue(csrfToken);
    if (!employeeWin) {
        employeeWin = new Ext.Window({
            layout : 'fit',
            title: 'Staff Form',
            width : 600,
            height : 430,
            closeAction : 'hide',
            plain : true,

            items : employeeFormPanel,

            buttons : [ {
                text : 'Save',
                handler: function(){
                    var employeefm = employeeFormPanel.getForm();
                    if(employeefm.isValid()){
                        var gro = Ext.getCmp('employee-window').getForm().findField('basicPay').getValue();
                        var sacco = Ext.getCmp('employee-window').getForm().findField('saccoCharge').getValue();
                        var welf = Ext.getCmp('employee-window').getForm().findField('welfareCharge').getValue();
                        var hous = Ext.getCmp('employee-window').getForm().findField('houseAllowance').getValue();
                        var medi = Ext.getCmp('employee-window').getForm().findField('medicalAllowance').getValue();
                        if(!gro)
                            Ext.getCmp('employee-window').getForm().findField('basicPay').setValue(0);
                        if(!sacco)
                            Ext.getCmp('employee-window').getForm().findField('saccoCharge').setValue(0);
                        if(!welf)
                            Ext.getCmp('employee-window').getForm().findField('welfareCharge').setValue(0);
                        if(!hous)
                            Ext.getCmp('employee-window').getForm().findField('houseAllowance').setValue(0);
                        if(!medi)
                            Ext.getCmp('employee-window').getForm().findField('medicalAllowance').setValue(0);
                        console.log(employeefm.getValues())
                        employeefm.submit({
                            success: function(response, obj){
                                var dec = Ext.decode(obj.response.responseText);
                                Ext.Msg.show({
                                    title:'Success', 
                                    msg:dec.msg,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.INFO
                                }
                                        
                                );
                                if(changed == true){
                                    refreshTotals();
                                    changed = false;
                                }
                                    
                            },
                            failure : function(response, obj){
                                var someResp = Ext.decode(response);
                                console.log(obj);
                                Ext.Msg.show({
                                    title:'Failed', 
                                    msg:'Failed to save, consult admin!',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.ERROR
                                }
                                        
                                );
                            }
                            
                        })
                    }
                }
            }, {
                text : 'Reset',
                handler : function() {
                    //employeeWin.hide();
                    employeeFormPanel.getForm().reset();
                    Ext.getCmp('employee-window').getForm().findField('_csrf').setValue(csrfToken);
                }
            } ]
        });
    }
    
    
    employeeFormPanel.getForm().load({
        url : contextpath + '/employee/loadform.action',
        params : {
            start: 0,
            limit: 25,
            id : employeeId,
            _csrf : csrfToken
        },
        waitMsg : 'Loading'
    });
    
    employeeWin.show(this);

}


function refreshTotals(){
    employeeFormPanel.getForm().load({
        url : contextpath + '/employee/loadform.action',
        params : {
            start: 0,
            limit: 25,
            id : Ext.getCmp('employees-grid').getSelectionModel().getSelected().get('id'),
            _csrf : csrfToken
        },
        waitMsg : 'Loading'
    });
}
// create the window on the first click and reuse on subsequent clicks
