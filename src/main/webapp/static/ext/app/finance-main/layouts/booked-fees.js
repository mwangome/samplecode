var storeBookedVoteheads = new Ext.data.GroupingStore({
    url : contextpath + '/fina/fetchbooked.action',
    autoLoad : false,
    remoteGroup : true,
    groupField : 'year',
    storeId : 'storeBookedVoteheads',
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
        idProperty : 'id',
        fields : [ 'id', 'session', 'year', 'votehead', 'amount_received', 'amount_booked' ]
    })
});

storeBookedVoteheads.on('beforeload', function(store, operation) {
    operation.params = operation.params || {};
    operation.params.session = Ext.getCmp('session-booked-voteheads') == undefined?'':Ext.getCmp('session-booked-voteheads').getValue();
    operation.params._csrf = csrfToken;
    operation.params.year = Ext.getCmp('year') == undefined?0:Ext.getCmp('year').getValue();
});

var storeSessionsBooks = new Ext.data.GroupingStore({
    url : contextpath + '/form/sessions.action',
    autoLoad : true,
    method : 'POST',
    remoteGroup : true,
    groupField : 'session',
    storeId : 'storeSessionsBooks',
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

storeBookedVoteheads.load({
    params:{
        year : 0,
        session : '' ,
        _csrf : csrfToken
    }
});


var comboSessionBooks = new Ext.form.ComboBox({
    fieldLabel : 'Session',
    name : 'session',
    id : 'session-booked-voteheads',
    anchor : '95%',
    allowBlank : false,
    emptyText : "Select action",
    triggerAction : 'all',
    lazyRender : true,
    mode : 'remote',
    store : this.storeSessionsBooks,
    valueField : 'session',
    displayField : 'session'
});

var selectModel = new Ext.grid.CheckboxSelectionModel();

var grid = new Ext.grid.GridPanel(
        {
            title : 'Book Voteheads',
            store : storeBookedVoteheads,
            id : 'voteheads-booked-grid',
            sm : selectModel,
            closable: true,
            viewConfig : {
                forceFit : true
            },
            loadMask : true,
            stripeRows : true,
            // bbar : pagingBar,
            tbar : [
                    comboSessionBooks ,'-',
                    {
                        fieldLabel : 'Year',
                        xtype: 'textfield',
                        name: 'year',
                        id : 'year',
                        emptyText: 'Year',
                        listeners: {
                            specialkey: function (frm, evt) {
                                if (evt.getKey() == evt.ENTER) {
                                    console.log("something happened!" + frm.getValue());
                                    var session = Ext.getCmp('session-booked-voteheads').getValue();
                                    storeBookedVoteheads.load({
                                        params:{
                                            year : frm.getValue(),
                                            session : session ,
                                            _csrf : csrfToken
                                        }
                                    });
                                }
                            }
                        }
                    },'-',
                    {
                        xtype : 'button',
                        text : 'Journalize Receipts ',
                        iconCls:'silk-money',
                        handler: function(){
                            Ext.Ajax.request({
                                url: contextpath + '/fina/computereceiptstobook.action',
                                method: 'GET',
                                params: {
                                    year: Ext.getCmp('year').getValue(),
                                    _csrf: csrfToken,
                                    session: Ext.getCmp('session-booked-voteheads').getValue()
                                },
                                success: function (response, opts) {
                                    var obj = Ext.decode(response.responseText);
                                    Ext.MessageBox.show({
                                        title: 'Success',
                                        msg: obj.msg,
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                },
                                failure: function (response, opts) {
                                    Ext.MessageBox.show({
                                        title: 'Failed',
                                        msg: "Failed to book transactions!",
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.WARNING
                                    });
                                }
                            })
                        }

                    } ],
            columns : [ selectModel, {
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
                header : "Year",
                width : 170,
                sortable : true,
                dataIndex : 'year',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Session",
                width : 150,
                sortable : true,
                dataIndex : 'session',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Year",
                width : 150,
                sortable : true,
                dataIndex : 'year',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Votehead",
                width : 150,
                sortable : true,
                dataIndex : 'votehead',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Receipts",
                width : 150,
                sortable : true,
                dataIndex : 'amount_received',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }, {
                header : "Booked",
                width : 150,
                sortable : true,
                dataIndex : 'amount_booked',
                editor : {
                    xtype : 'textfield',
                    allowBlank : false
                }
            }

            ],
            view : new Ext.grid.GroupingView(
                    {
                        forceFit : true,
                        groupTextTpl : '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
                    }),
            bbar : new Ext.PagingToolbar({
                pageSize : 25,
                store : storeBookedVoteheads,
                method : 'get',
                displayInfo : true,
                displayMsg : 'Displaying voteheads {0} - {1} of {2}',
                emptyMsg : "No voteheads found"
            })
        });