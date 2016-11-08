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

Ext.QuickTips.init();

// NOTE: This is an example showing simple state management. During development,
// it is generally best to disable state management as dynamically-generated ids
// can change across page loads, leading to unpredictable results.  The developer
// should ensure that stable state ids are set for stateful components in real apps.    
var Class = Ext.data.Record.create([
    {
        name: 'id',
        type: 'int'
    }, {
        name: 'className',
        type: 'string'
    }, {
        name: 'streamName',
        type: 'string'
    }]);

var writer = new Ext.data.JsonWriter({
    encode: true,
    writeAllFields: true
});
var indexRemoved;
var proxy = new Ext.data.HttpProxy({
    api: {
        read: contextpath + '/form/view.action',
        create: contextpath + '/form/create.action',
        update: contextpath + '/form/update.action',
        destroy: contextpath + '/form/delete.action'
    }
});

var reader = new Ext.data.JsonReader({
    totalProperty: 'totalCount',
    successProperty: 'success',
    idProperty: 'id',
    root: 'data',
    //messageProperty: 'message', // <-- New "messageProperty" meta-data

    baseParams: {
        _csrf: csrfToken
    }
},
Class);

var actionPerformed;

// hideous function to generate employee data

var storeClassReg = new Ext.data.GroupingStore({
    id: 'MyStore',
    reader: reader,
    proxy: proxy,
    writer: writer,
    autoSave: false,
    sortInfo: {
        field: 'className',
        direction: 'ASC'
    },
    baseParams: {
        start: 0,
        limit: 25,
        _csrf: csrfToken,
        action:"-"
    }, listeners: {
        load: function (t, records, options) {
            console.log('test ok');

        }
    }
});


storeClassReg.load({params: {
        start: 0,
        limit: 25,
        _csrf: csrfToken
    }});
var editor = new Ext.ux.grid.RowEditor({
    saveText: 'Add'
});

var bot = new Ext.PagingToolbar({
    pageSize: 25,
    store: storeClassReg,
    method: 'get',
    displayInfo: true,
    displayMsg: 'Displaying classes {0} - {1} of {2}',
    emptyMsg: "No classes found"
});

var gridClass = new Ext.grid.GridPanel({
    store: storeClassReg,
    width: 600,
    region: 'center',
    margins: '0 5 5 5',
    autoExpandColumn: 'className',
    plugins: [editor],
    view: new Ext.grid.GroupingView({
        markDirty: false
    }),
    tbar: [ {
            ref: '../removeBtn',
            iconCls: 'icon-user-delete',
            text: 'Remove Class',
            disabled: true,
            handler: function () {
                editor.stopEditing();
                var s = gridClass.getSelectionModel().getSelections();
                for (var i = 0, r; r = s[i]; i++) {
                    var cName = r.get("className");
                    console.log("Class Name::" + cName);
                    var index = Ext.StoreMgr.lookup("MyStore").findExact('className', cName);
                    console.log("index::" + index);
                    storeClassReg.removeAt(index);
                    indexRemoved = index;
                    gridClass.getView().refresh();
                    console.log("remove::" + storeClassReg.getCount());
                    actionPerformed = "remove";
                }

            }
        }, {
            ref: '../saveBtn',
            iconCls: 'icon-save',
            text: 'Save Classes',
            handler: function () {
                editor.stopEditing();
                console.log("before::save::" + storeClassReg.getCount());
               
                if (actionPerformed == "add") {
                    storeClassReg.save();
                } else {
                    var size = storeClassReg.data.items.length;
                    var myArray = [];
                    for (var i = 0; i < size; i++) {
                        myArray.push(
                                storeClassReg.data.items[i].json
                                );
                    }

                    Ext.Ajax.request({
                        url: contextpath + '/form/create.action',
                        method: 'POST',
                        params: {
                            action: "remove",
                            _csrf: csrfToken,
                            data: JSON.stringify(myArray)
                        },
                        success: function (response, opts) {
                            var obj = Ext.decode(response.responseText);
                            console.dir(obj);
                        },
                        failure: function (response, opts) {
                            console.log('server-side failure with status code ' + response.status);
                        }
                    })
                }


                //gridClass.refreshBtn.handler.call(gridClass.refreshBtn.scope, gridClass.refreshBtn, Ext.EventObject)
            }

        }, {
            ref: '../refreshBtn',
            iconCls: 'icon-user',
            text: 'Refresh Class',
            hidden: true,
            handler: function () {
                fetch();

            }
        }], bbar: bot,
    columns: [
        new Ext.grid.RowNumberer(), {
            id: 'id',
            header: 'id',
            dataIndex: 'id',
            width: 220,
            sortable: true,
            hidden: true
        }, {
            id: 'className',
            header: 'Class',
            dataIndex: 'className',
            width: 220,
            sortable: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            header: 'Stream',
            dataIndex: 'streamName',
            width: 150,
            sortable: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }]
});
gridClass.getSelectionModel().on('selectionchange', function (sm) {
    gridClass.removeBtn.setDisabled(sm.getCount() < 1);
});
storeClassReg.load({params: {
        start: 0,
        limit: 25,
        _csrf: csrfToken
    },
    callback: function (records, options, success) {
        if (success) {
            console.log("callback:::");
        }
    }
});
var win;

function getClassEditor() {
    console.log("step one");
    win = Ext.getCmp('window-edit-class');
    if (!win) {

        win = new Ext.Window({
            id: 'window-edit-class',
            layout: 'fit',
            title: 'Add Class',
            frame: true,
            closable: true,
            width: 670,
            height: 510,
            closeAction: 'hide',
            plain: true,
            items: [gridClass]

        });
    }
    console.log("step two")
    win.show();
}


function fetch() {
    gridClass.getStore().reload();
}