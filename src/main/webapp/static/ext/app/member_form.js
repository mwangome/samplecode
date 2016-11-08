var comboFromArray = new Ext.form.ComboBox({
    store : [ "MALE", "FEMALE" ], // direct array data
    typeAhead : true,
    fieldLabel: 'Gender',
    name : 'gender',
    id : 'student-gender',
    triggerAction : 'all',
    emptyText : 'Select a gender...',
    selectOnFocus : true,
    anchor : '95%'
});

var storeCategories = new Ext.data.GroupingStore({
    url : contextpath + '/form/categories.action',
    autoLoad : true,
    remoteGroup : true,
    groupField : 'category',
    storeId : 'storeCategory',
    sortInfo : {
        field : 'category',
        direction : 'ASC'
    },
    baseParams : {
        _csrf : csrfToken
    },
    reader : new Ext.data.JsonReader({
        totalProperty : 'totalCount',
        root : 'data',
        idProperty : 'category',
        fields : [ 'category' ]
    })
});

this.store = new Ext.data.JsonStore({
    proxy : new Ext.data.HttpProxy({
        url : contextpath + '/form/viewclass.action',
        method : 'POST'
    }),
    baseParams : {
        _csrf : csrfToken,
        start : 0,
        limit : 25
    },
    root : 'data',
    fields : [ 'id', 'className', 'streamName' ]

});

storeCategories.load({
    params : {
        start : 0,
        limit : 25,
        _csrf : csrfToken
    }
});




var comboClass = new Ext.form.ComboBox({
    fieldLabel : 'Class',
    name : 'company',
    id : 'company',
    anchor : "45%",
    allowBlank : false,
    emptyText : "Select action",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : this.store,
    valueField : 'className',
    displayField : 'className'
});

var comboCategorymembers = new Ext.form.ComboBox({
    fieldLabel : 'Category',
    name : 'category',
    id : 'category-member-form',
    anchor : "45%",
    allowBlank : false,
    emptyText : "Select action",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : storeCategories,
    valueField : 'category',
    displayField : 'category'
});

var tab2 = new Ext.FormPanel({
    labelAlign : 'top',
    bodyStyle : 'padding:5px',
    width : 600,
    id : 'membersForm',
    items : [ {
        layout : 'column',
        border : false,
        items : [ {
            columnWidth : .5,
            layout : 'form',
            border : false,
            items : [ {
                xtype : 'textfield',
                fieldLabel : 'First Name',
                name : 'firstName',
                id : 'firstName',
                anchor : '95%'
            }, {
                xtype : 'textfield',
                fieldLabel : 'Last Name',
                name : 'lastName',
                id : 'lastName',
                anchor : '95%'
            }, comboFromArray ]
        }, {
            columnWidth : .5,
            layout : 'form',
            border : false,
            items : [ {
                xtype : 'textfield',
                fieldLabel : 'Other Names',
                name : 'otherNames',
                id : 'otherNames',
                anchor : '95%'
            }, {
                xtype : 'datefield',
                fieldLabel : 'Date of Birth',
                name : 'dob',
                id : 'dob',
                format: 'd/m/Y',
                anchor : '95%'
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
            title : 'Student Details',
            layout : 'form',
            defaults : {
                width : 230
            },
            // defaultType: 'textfield',
            items : [ comboClass, comboCategorymembers, {
                fieldLabel : 'Reg No',
                xtype : 'textfield',
                name : 'partNumber',
                id : 'partNumber',
                anchor : "45%"
            },{
                fieldLabel : 'Joined School',
                xtype : 'datefield',
                name : 'dateJoined',
                format: 'd/m/Y',
                id : 'dateJoined',
                anchor : "45%"
            }  ]
        }, {
            title : 'Contacts',
            layout : 'form',
            defaults : {
                width : 230
            },
            defaultType : 'textfield',
            items : [ {
                fieldLabel : 'Home',
                name : 'home',
                id : 'home',
                emptyText : '(888) 555-1212'
            }, {
                fieldLabel : 'Business',
                name : 'business',
                id : 'business'
            }, {
                fieldLabel : 'Mobile',
                name : 'mobile',
                id : 'mobile'
            }, {
                fieldLabel : 'Email',
                name : 'email',
                id : 'email',
                vtype : 'email'
            } ]
        }, {
            // cls:'x-plain',
            title : 'Biography',
            layout : 'form',
            defaults : {
                width : 230
            },
            defaultType : 'textfield',
            items : [ {
                fieldLabel : 'Biography',
                name : 'biography',
                id : 'biography',
                width : 650,
                height : 90,
                xtype : 'htmleditor'
            } ]
        } ]
    } ],
    buttons : [ {
        text : 'Save',
        handler : function() {
            // Ext.getCmp('login-form').getForm().submit();
            if (idSelected == null) {
                saveMember();
            } else {
                updateMember();
            }
        }
    }, {
        text : 'Reset',
        handler : function() {
            idSelected = null;
            Ext.getCmp('membersForm').getForm().reset();

        }
    } ]
});

Ext.getCmp('membersForm').on({
    actioncomplete : function(form, action) {
        if (action.type == 'load') {
            var member = action.result.data;
            console.log('>>>' + member.dob);
            if (member.dob == undefined) {
                Ext.getCmp('dob').setValue(null);
            }
        }
    }
});

function saveMember() {
    Ext.Ajax
            .request({
                url : contextpath + '/submitMember',
                method : 'POST',
                scope : this,
                params : {
                    firstName : Ext.getCmp('firstName').getValue(),
                    lastName : Ext.getCmp('lastName').getValue(),
                    biography : Ext.getCmp('biography').getValue(),
                    dob : formatDate(Ext.getCmp('dob').getValue()),
                    otherNames : Ext.getCmp('otherNames').getValue(),
                    gender : Ext.getCmp('student-gender').getValue().toUpperCase(),
                    home : Ext.getCmp('home').getValue() == "" ? "-" : Ext
                            .getCmp('home').getValue(),
                    business : Ext.getCmp('business').getValue() == "" ? "-" : Ext
                            .getCmp('business').getValue(),
                    email : Ext.getCmp('email').getValue(),
                    mobile : Ext.getCmp('mobile').getValue() == "" ? "-" : Ext
                            .getCmp('mobile').getValue(),
                    company : Ext.getCmp('company').getValue() == "" ? "-" : Ext
                            .getCmp('company').getValue(),
                    partNumber : Ext.getCmp('partNumber').getValue(),
                    form : Ext.getCmp('company').getValue() == "" ? "-" : Ext
                            .getCmp('company').getValue(),
                    _csrf : csrfToken,
                    category : Ext.getCmp('category-member-form').getValue() == "" ? "-" : Ext
                            .getCmp('category-member-form').getValue(),
                    dateJoined : formatDate(Ext.getCmp('dateJoined').getValue()),
                },
                success : function(response, opts) {
                    console.log(response);
                    if (response.responseText == 'success') {
                        Ext.MessageBox.show({
                            title : 'Server Response',
                            msg : 'Save Successful!',
                            buttons : Ext.MessageBox.OK,
                            icon : Ext.MessageBox.INFO
                        });
                    } else {
                        Ext.MessageBox.show({
                            title : 'Server Response',
                            msg : 'Access Denied!',
                            buttons : Ext.MessageBox.OK,
                            icon : Ext.MessageBox.WARNING
                        });
                    }
                },
                failure : function() {
                    Ext.MessageBox.show({
                        title : 'Server Response',
                        msg : 'Access Denied!',
                        buttons : Ext.MessageBox.OK,
                        icon : Ext.MessageBox.WARNING
                    });
                }
            });

}

function updateMember() {
    Ext.Ajax
            .request({
                url : contextpath + '/submitMember',
                method : 'POST',
                scope : this,
                params : {
                    id : idSelected,
                    firstName : Ext.getCmp('firstName').getValue(),
                    lastName : Ext.getCmp('lastName').getValue(),
                    biography : Ext.getCmp('biography').getValue(),
                    dob : formatDate(Ext.getCmp('dob').getValue()),
                    otherNames : Ext.getCmp('otherNames').getValue(),
                    gender : Ext.getCmp('student-gender').getValue().toUpperCase(),
                    home : Ext.getCmp('home').getValue(),
                    business : Ext.getCmp('business').getValue(),
                    email : Ext.getCmp('email').getValue(),
                    mobile : Ext.getCmp('mobile').getValue(),
                    company : Ext.getCmp('company').getValue(),
                    partNumber : Ext.getCmp('partNumber').getValue(),
                    form : Ext.getCmp('company').getValue(),
                    dateJoined : formatDate(Ext.getCmp('dateJoined').getValue()),
                    _csrf : csrfToken,
                    category : Ext.getCmp('category-member-form').getValue() == "" ? "-" : Ext
                            .getCmp('category-member-form').getValue(),
                },
                success : function(response, opts) {
                    console.log(response);
                    if (response.responseText == 'success') {
                        Ext.MessageBox.show({
                            title : 'Server Response',
                            msg : 'Save Successful!',
                            buttons : Ext.MessageBox.OK,
                            icon : Ext.MessageBox.INFO
                        });
                    } else {
                        Ext.MessageBox.show({
                            title : 'Server Response',
                            msg : 'Access Denied!',
                            buttons : Ext.MessageBox.OK,
                            icon : Ext.MessageBox.WARNING
                        });
                    }
                },
                failure : function() {
                    Ext.MessageBox.show({
                        title : 'Server Response',
                        msg : 'Access Denied!',
                        buttons : Ext.MessageBox.OK,
                        icon : Ext.MessageBox.WARNING
                    });
                }
            });

}
function formatDate(date) {
    //var date = Ext.getCmp('dob').getValue();
    return date == '' ? null : date.format('Y-m-d');
}

var idSelected;

var winStudentForm;
function launchMemberForm(idSelected) {
    Ext.getCmp('membersForm').getForm().reset();
    
    winStudentForm = Ext.getCmp('window-member-form');
    this.idSelected = idSelected;

    if (!winStudentForm) {
        winStudentForm = new Ext.Window({
            layout : 'fit',
            closable : true,
            id : 'window-member-form',
            title : 'Students\'s Particulars',
            width : 700,
            height : 465,
            closeAction : 'hide',
            plain : true,
            items : [ tab2 ]

        });
    }
    winStudentForm.show();

    Ext.getCmp('membersForm').getForm().load({
        url : contextpath + '/viewmember.action',
        params : {
            id : idSelected,
            _csrf : csrfToken
        },
        waitMsg : 'Loading'
    });

    if (idSelected == null) {
        console.log('null selected trying to reset ...');
        Ext.getCmp('membersForm').getForm().reset();
    }

}


