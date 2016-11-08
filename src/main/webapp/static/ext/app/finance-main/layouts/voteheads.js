var storeClasses = new Ext.data.GroupingStore({
    url : contextpath + '/form/classes.action',
    autoLoad : true,
    method : 'POST',
    remoteGroup : true,
    groupField : 'class_name',
    storeId : 'storeClass',
    sortInfo : {
        field : 'class_name',
        direction : 'ASC'
    },
    baseParams : {
        _csrf : csrfToken
    },
    reader : new Ext.data.JsonReader({
        totalProperty : 'totalCount',
        root : 'data',
        idProperty : 'class_name',
        fields : [ 'class_name' ]
    })
});

var storeSessions = new Ext.data.GroupingStore({
    url : contextpath + '/form/sessions.action',
    autoLoad : true,
    method : 'POST',
    remoteGroup : true,
    groupField : 'session',
    storeId : 'storeSession',
    sortInfo : {
        field : 'session',
        direction : 'ASC'
    },
    baseParams : {
        _csrf : csrfToken
    },
    reader : new Ext.data.JsonReader({
        totalProperty : 'totalCount',
        root : 'data',
        idProperty : 'session',
        fields : [ 'session' ]
    })
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

storeCategories.load({
    params : {
        start : 0,
        limit : 25,
        _csrf : csrfToken
    }
});
storeClasses.load({
    params : {
        start : 0,
        limit : 25,
        _csrf : csrfToken
    }
});
storeSessions.load({
    params : {
        start : 0,
        limit : 25,
        _csrf : csrfToken
    }
});

/*
 * ================ AccordionLayout config =======================
 * 
 */

var storeVoteheads = new Ext.data.JsonStore({
    url : contextpath + '/form/viewvotehead.action',
    root : 'data',
    baseParams : {
        _csrf : csrfToken
    },
    fields : [ 'id', 'className', 'votehead', 'year', 'category', 'amount',
            'session' ]
});
storeVoteheads.load({
    params : {
        start : 0,
        limit : 200,
        _csrf : csrfToken
    }
});

var smListView = new Ext.grid.CheckboxSelectionModel();

var listView = new Ext.grid.PivotGrid({
    store : storeVoteheads,
    region : 'south',
    aggregator : 'sum',
    measure : 'amount',
    id : 'listView',
    multiSelect : true,
    stripeRows : true,
    emptyText : 'No voteheads to display',
    reserveScrollOffset : true,
    selModel : smListView, 
    columns : [ smListView, {
        header : 'ID',
        width : 75,
        hidden : true,
        dataIndex : 'id'
    }, {
        header : 'Votehead',
        width : 75,
        dataIndex : 'votehead'
    }, {
        header : 'Amount',
        width : 75,
        dataIndex : 'amount'
    }, {
        header : 'Session',
        width : 75,
        dataIndex : 'session'
    }, {
        header : 'Class',
        width : 75,
        dataIndex : 'className'
    }, {
        header : 'Year',
        dataIndex : 'year',
        align : 'right',
        cls : 'listview-filesize'
    }, {
        header : 'Category',
        dataIndex : 'category',
        align : 'right',
        cls : 'listview-filesize'
    } ],
    viewConfig : {
        title : 'Voteheads'
    },
    bbar : new Ext.PagingToolbar({
        pageSize : 200,
        store : storeVoteheads,
        method : 'get',
        displayInfo : true,
        displayMsg : 'Displaying markets {0} - {1} of {2}',
        emptyMsg : "No markets found"
    }),

    leftAxis : [ {
        width : 80,
        dataIndex : 'className'
    }, {
        width : 80,
        dataIndex : 'category'
    }, {
        width : 160,
        height : 10,
        dataIndex : 'votehead'
    } ],

    topAxis : [ {
        dataIndex : 'session'
    } ]
});

var smNormalGrid = new Ext.grid.CheckboxSelectionModel();
var normalGrid = new Ext.grid.GridPanel({
    store : storeVoteheads,
    region : 'south',
    aggregator : 'sum',
    measure : 'amount',
    height: 250,
    id : 'normal-grid',
    multiSelect : true,
    stripeRows : true,
    emptyText : 'No voteheads to display',
    reserveScrollOffset : true,
    selModel : smNormalGrid,
    tbar : [ {
        text : 'Delete',
        iconCls : 'silk-delete',
        handler : function() {
            var index = getSelectedRowIndex();
            console.log(index);
            Ext.Ajax.request({
                method : 'POST',
                url : contextpath + '/form/deletevotehead.action',
                params : {
                    _csrf : csrfToken,
                    id : index
                },
                success : function() {

                    storeVoteheads.load({
                        params : {
                            start : 0,
                            limit : 200,
                            _csrf : csrfToken
                        }
                    });
                    Ext.Msg.alert('Success', 'Delete successful!');
                },
                failure : function() {
                    Ext.Msg.alert('Failure', 'Delete failed!');
                }
            });
        }
    } ],
    columns : [ smNormalGrid, {
        header : 'ID',
        width : 75,
        hidden : true,
        dataIndex : 'id'
    }, {
        header : 'Votehead',
        width : 75,
        dataIndex : 'votehead'
    }, {
        header : 'Amount',
        width : 75,
        dataIndex : 'amount'
    }, {
        header : 'Session',
        width : 75,
        dataIndex : 'session'
    }, {
        header : 'Class',
        width : 75,
        dataIndex : 'className'
    }, {
        header : 'Year',
        dataIndex : 'year',
        align : 'right',
        cls : 'listview-filesize'
    }, {
        header : 'Category',
        dataIndex : 'category',
        align : 'right',
        cls : 'listview-filesize'
    } ],
    viewConfig : {
        forceFit : true
    },
    bbar : new Ext.PagingToolbar({
        pageSize : 200,
        store : storeVoteheads,
        method : 'get',
        displayInfo : true,
        displayMsg : 'Displaying markets {0} - {1} of {2}',
        emptyMsg : "No markets found"
    })
});

var comboClass = new Ext.form.ComboBox({
    fieldLabel : 'Class',
    name : 'className',
    id : 'class_name',
    width : 350,
    allowBlank : false,
    emptyText : "Select action",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : this.storeClasses,
    valueField : 'class_name',
    displayField : 'class_name'
});

var comboCategory = new Ext.form.ComboBox({
    fieldLabel : 'Category',
    name : 'category',
    id : 'category',
    width : 350,
    allowBlank : false,
    emptyText : "Select action",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : this.storeCategories,
    valueField : 'category',
    displayField : 'category'
});

var comboSession = new Ext.form.ComboBox({
    fieldLabel : 'Session',
    name : 'session',
    id : 'sessionVotehead',
    anchor : '95%',
    allowBlank : false,
    emptyText : "Select action",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : this.storeSessions,
    valueField : 'session',
    displayField : 'session'
});
var accordion = {
    id : 'accordion-panel',
    title : 'Voteheads',
    layout : 'accordion',
    bodyBorder : false, // useful for accordion containers since the inner
    // panels have borders already
    bodyStyle : 'background-color:#DFE8F6', // if all accordion panels are
    // collapsed, this looks better in
    // this layout
    defaults : {
        bodyStyle : 'padding:2px'
    },
    items : [ {
        title : '<b><font color="blue"><u>Add Voteheads</u></font></b>',
        
        tools : [ {
            id : 'gear'
        }, {
            id : 'refresh'
        } ],
        layout : 'border',
        bodyBorder : false,
        defaults : {
            
            split : true,
            animFloat : false,
            autoHide : false,
            useSplitTips : true,
            bodyStyle : 'padding:15px'
        },
        items : [
                normalGrid,
                {
                    // title : '',
                    region : 'center',
                    items : [ {
                        layout : 'column',
                        border : false,

                        items : [ {
                            columnWidth : .5,
                            xtype : 'form', // since we are not using
                            // the
                            id : 'votehead-form-panel1',
                            border : false,
                            // default
                            // 'panel' xtype, we must
                            // specify it

                            labelWidth : 75,
                            // title : 'Form Layout',
                            bodyStyle : 'padding:15px',
                            width : 450,
                            labelPad : 20,
                            layoutConfig : {
                                labelSeparator : ''
                            },
                            defaults : {
                                width : 230,
                                msgTarget : 'side'
                            },
                            defaultType : 'textfield',
                            items : [ comboClass, comboCategory, {
                                fieldLabel : 'Votehead',
                                name : 'votehead',
                                id : 'votehead',
                            },  {
                                xtype : 'textfield',
                                fieldLabel : 'Amount',
                                name : 'amount',
                                id : 'amount'
                            }, {
                                hidden : true,
                                name : '_csrf',
                                value : csrfToken
                            } ]
                        }, {
                            columnWidth : .5,
                            bodyStyle : 'padding:15px',
                            layout : 'form',
                            id : 'votehead-form-panel2',
                            border : false,
                            items : [ comboSession, {
                                fieldLabel : 'Year',
                                xtype: 'textfield',
                                name : 'year',
                                id : 'year',
                                anchor : '95%'
                            }]
                        } ],
                        buttons : [
                                {
                                    text : 'Save',
                                    iconCls : 'icon-save',
                                    handler : function() {

                                        Ext.Ajax
                                                .request({
                                                    method : 'POST',
                                                    url : contextpath
                                                            + '/form/submitVotehead',
                                                    params : {
                                                        className : Ext.getCmp('class_name').getValue(),
                                                        session : Ext.getCmp('sessionVotehead').getValue(),
                                                        amount : Ext.getCmp('amount').getValue(),
                                                        votehead : Ext.getCmp('votehead').getValue(),
                                                        year : Ext.getCmp('year').getValue(),
                                                        category : Ext.getCmp('category').getValue(),
                                                        _csrf : csrfToken
                                                    },
                                                    success : function(form,
                                                            action) {
                                                        storeVoteheads
                                                                .load({
                                                                    params : {
                                                                        start : 0,
                                                                        limit : 200,
                                                                        _csrf : csrfToken
                                                                    }
                                                                });
                                                        Ext.Msg
                                                                .alert(
                                                                        'Success',
                                                                        'Save successful!');
                                                    },
                                                    failure : function(form,
                                                            action) {
                                                        console
                                                                .log(action.response.responseText);
                                                        Ext.Msg
                                                                .alert(
                                                                        'Failed',
                                                                        action.response.responseText);

                                                    }
                                                });

                                    }
                                },
                                {
                                    text : 'Cancel',
                                    handler : function() {
                                        var form = Ext.getCmp(
                                                'votehead-form-panel')
                                                .getForm();
                                        form.reset();
                                    }
                                } ]
                    } ]
                } ]
    },{
        
        title: '<b><font color="blue"><u>Voteheads Summary</u></font></b>',
        layout: 'fit',
        items:[
               
                   listView
               
               ]
    } ]
};




getSelectedRowIndex =  function(){
    var r = Ext.getCmp('normal-grid').getSelectionModel().getSelected().get('id');
    return r;
  }



Ext.onReady(function(){
    storeVoteheads.load({
    params : {
        start : 0,
        limit : 200,
        _csrf : csrfToken
    }
});
})