var cacheId = undefined;

var store = new Ext.data.GroupingStore({
    url : contextpath + '/view.action',
    autoLoad : true,
    remoteGroup : true,
    groupField : 'company',
    storeId : 'myStore',
    sortInfo : {
        field : 'company',
        direction : 'ASC'
    },
    baseParams : {
        _csrf : csrfToken
    },
    reader : new Ext.data.JsonReader({
        totalProperty : 'totalCount',
        root : 'data',
        idProperty : 'id',
        fields : [ 'id', 'firstName', 'lastName', 'otherNames', 'gender',
                'company', 'partNumber' ]
    })
});


store.load({
    params : {
        start : 0,
        limit : 25,
        _csrf : csrfToken
    }
});

var selectModelStudentReg = new Ext.grid.CheckboxSelectionModel();

var grid = new Ext.grid.GridPanel(
        {
            store : store,
            id : 'students-grid',
            sm : selectModelStudentReg,
            viewConfig : {
                forceFit : true
            },
            loadMask : true,
            stripeRows : true,
            // bbar : pagingBar,
            tbar : [
                    {
                        xtype : 'splitbutton',
                        text : 'Student',
                        iconCls : 'member',
                        handler : function() {

                            launchMemberForm();
                            resetSelection();
                        },
                        menu : {
                            items : [
                                    {
                                        text : 'Add a Student',
                                        handler : function() {

                                            launchMemberForm();
                                            resetSelection();
                                        }
                                    },
                                    '-',
                                    {
                                        text : 'Upload Students',
                                        handler : function() {

                                            requirejs(
                                                    [ contextpath
                                                            + '/static/ext/app/functions/fileUpload.js' ],
                                                    function() {
                                                        getFiles();
                                                    }

                                            )
                                        }
                                    }, '-', {
                                        text : '<i>View Class List</i>',
                                        handler : function() {
                                            var contentClassList = new Ext.BoxComponent({

                                                id : 'report-class-list',
                                                title : 'Students List',
                                                closable : true,
                                                autoEl : {
                                                    tag : 'iframe',
                                                    id : 'class-list-frame', 
                                                    closable : true,
                                                    frameborder : '0',
                                                    width : screen.width * (90 / 100),
                                                    height : screen.height * (70 / 100),
                                                    src : contextpath + '/viewer?&reload=true&reportName=membersList&connectionType=SQL&id=&',
                                                    autoLoad: true
                                                 },
                                                listeners : {
                                                    afterrender : function() {
                                                        console.log('rendered');

                                                        this.getEl().on('load', function() {
                                                                    console.log('loaded');
                                                                    Ext.getCmp('tree-panel').getSelectionModel().select(Ext.getCmp('tree-panel').getNodeById("absolute"));
                                                                    Ext.getCmp('tree-panel').fireEvent('itemclick', null, Ext.getCmp('tree-panel').getNodeById("absolute"));

                                                                });
                                                    }
                                                }
                                            });
                                            
                                            addTab(Ext.getCmp('absolute-panel'), Ext.getCmp('report-class-list'), 'Students List Report')
                                                    
                                        }
                                    } ]
                        }

                    },{
                        text: 'Fee',
                        xtype: 'splitbutton',
                        handler: function(){
                            requirejs(
                                    [ contextpath
                                            + '/static/ext/app/finance-main/layouts/pay-fee.js' ],
                                    function() {
                                        console.log('require::' );
                                        var stIdSelected = getSelectedStudentRecord().get('id');
                                        var stNameSelected = getSelectedStudentRecord().get('firstName');
                                        try{
                                            if(Ext.getCmp('student-fee-form').header){
                                                Ext.getCmp('student-fee-form').header.setStyle('color', 'rgb(0,0,139)');
                                            } 
                                        }catch(e){
                                            
                                        }
                                                                                         
                                        getPaymentForm(stIdSelected, stNameSelected);
                                        
                                    }

                            )
                        },
                        iconCls:'silk-money',
                        menu:[
                              {
                                  text: 'Pay Fee',
                                  handler: function(){
                                      requirejs(
                                              [ contextpath
                                                      + '/static/ext/app/finance-main/layouts/pay-fee.js' ],
                                              function() {
                                                  console.log('require::' );
                                                  var stIdSelected = getSelectedStudentRecord().get('id');
                                                  var stNameSelected = getSelectedStudentRecord().get('firstName');
                                                  try{
                                                      if(Ext.getCmp('student-fee-form').header){
                                                          Ext.getCmp('student-fee-form').header.setStyle('color', 'rgb(0,0,139)');
                                                      } 
                                                  }catch(e){
                                                      
                                                  }
                                                                                                   
                                                  getPaymentForm(stIdSelected, stNameSelected);
                                                  
                                              }

                                      )
                                  }
                              }, {
                                  text: 'List of Receipts',
                                  handler: function(){
                                      requirejs(
                                              [ contextpath
                                                      + '/static/ext/app/finance-main/layouts/booked-fees.js' ],
                                              function() {
                                                  addTab(Ext.getCmp('absolute-panel'), Ext.getCmp('voteheads-booked-grid'), 'Book Voteheads')
                                              }

                                      )
                                  }
                              }
                              ]
                    }, '->', new Ext.form.TwinTriggerField({
                        xtype : 'twintriggerfield',
                        trigger1Class : 'x-form-clear-trigger',
                        trigger2Class : 'x-form-search-trigger',
                        emptyText : 'Reg No',
                        onTrigger1Click : function() {
                            this.setValue('');
                        },
                        onTrigger2Click : function() {
                            var partNumber = this.getValue();
                            store.load({
                                params : {
                                    start : 0,
                                    limit : 25,
                                    _csrf : csrfToken,
                                    partNumber : partNumber
                                }
                            });
                        },
                        listeners : {
                            specialkey : function(f, e) {
                                if (e.getKey() == e.ENTER) {
                                    var partNumber = this.getValue();
                                    store.load({
                                        params : {
                                            start : 0,
                                            limit : 25,
                                            _csrf : csrfToken,
                                            partNumber : partNumber
                                        }
                                    });
                                }
                            }
                        }
                    }) ],
            columns : [ selectModelStudentReg, {
                header : "Reg. No.",
                width : 170,
                sortable : true,
                dataIndex : 'partNumber',
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
                dataIndex : 'lastName',
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
            }, {
                header : "Form",
                width : 150,
                hidden : true,
                sortable : true,
                dataIndex : 'company',
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
                store : store,
                method : 'get',
                displayInfo : true,
                displayMsg : 'Displaying members {0} - {1} of {2}',
                emptyMsg : "No members found"
            })
        });
grid.on('cellclick', function(grid, rindx, cindx, e) {
    // var cf =
    // Ext.ComponentMgr.create(CourseForm);
    var id = grid.getStore().getAt(rindx).get('id');
    idSelected = id;
    if(!cacheId){
        cacheId = idSelected;
    }
    fillProperties();
});

grid.on('celldblclick', function(grid, rindx, cindx, e) {
    // var cf =
    // Ext.ComponentMgr.create(CourseForm);
    var id = grid.getStore().getAt(rindx).get('id');
    idSelected = id;
    console.log('double clicked ..' + id);
    launchMemberForm(idSelected);
    // fillProperties();
});

var index = 0;
var absolute = new Ext.TabPanel({
    id : 'absolute-panel',
    resizeTabs : true, // turn on tab resizing
    minTabWidth : 115,
    tabWidth : 135,
    enableTabScroll : true,
    activeTab : 0,
    autoDestroy: false,
    
    listeners: {
            remove: function(tabPanel,tab) {
                    Ext.Msg.alert('Closed ' + tab.id, 'Removed!');
                    if(tab.id == 'pay-fee-panel'||tab.id == 'voteheads-booked-grid'){
                        
                    }else{
                        tab.destroy();
                    }
               }
    },
    defaults : {
        autoScroll : true,
        listeners: {
            activate: function(tab, eOpts) {
                //alert(tab.title + ' activate');
                try{
                    receiptsStore.load(
                            {
                                params:{
                                    _csrf : csrfToken,
                                    partNumber : getSelectedStudentRecord().get('partNumber')
                                }
                            }        
                            );
                    if(cacheId!=getSelectedStudentRecord().get('id')){
                        var form = Ext.getCmp('student-fee-form').getForm().reset();
                        fillVoteheads();
                        cacheId = getSelectedStudentRecord().get('id');
                    }
                    
                }catch(e){
                    
                }
               
            }
        }
    },
    plugins : new Ext.ux.TabCloseMenu(),
    items : [ {
        title : 'Students Register',
        iconCls : 'tabs',
        layout : 'fit',
        id : 'student-register-grid',
        closable : false,
        items : [ grid ]
    } ]
});

var idSelected;
function fillProperties() {
    var _company = "";
    for (var i = 0; i < store.data.items.length; i++) {
        if (idSelected === store.data.itemAt(i).data.id) {
            _company = store.data.itemAt(i).data.company;
        }
    }
    Ext.getCmp("propsGrid").setSource({
        '(name)' : 'Properties Grid',
        Class : _company,
        created : new Date(Date.parse('10/15/2015'))
    });
}

function resetSelection() {
    idSelected = null;
}
var initId = '';
function getSelectedStudentRecord(){  
    var recModel = Ext.getCmp('students-grid').getSelectionModel();
    if(recModel.hasSelection()){ 
        if(initId == recModel.getSelected().get('id')){
            console.log('same student selected ...')
        }if(initId != recModel.getSelected().get('id')){
            console.log('changing student selected ...');
            try{Ext.getCmp('receipt-list-grid').getSelectionModel().clearSelections();}catch(e){}
        }
        initId = recModel.getSelected().get('id')
        return recModel.getSelected();
    }else{
        Ext.MessageBox.show({
            title: 'Select',
            msg: 'Select student record first.',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
    }
    
    return undefined;
}


