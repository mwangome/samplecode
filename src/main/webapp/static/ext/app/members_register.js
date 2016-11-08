var store = new Ext.data.GroupingStore({
    url: contextpath + '/viewmarkets.action',
    autoLoad: true,
    remoteGroup: true,
    groupField: 'sportName',
    sortInfo: {
        field: 'id',
        direction: 'ASC'
    },
    baseParams: {
        _csrf: csrfToken
    },
    reader: new Ext.data.JsonReader({
        totalProperty: 'totalCount',
        root: 'data',
        idProperty: 'id',
        fields: ['id', 'name', 'sportName', 'description'],
    })
});

store.load({
    params: {start: 0, limit: 20, _csrf: csrfToken}});
var idSelected;
function fillProperties() {
    var _company = "";
    for (var i = 0; i < store.data.items.length; i++) {
        if (idSelected === store.data.itemAt(i).data.id) {
            _company = store.data.itemAt(i).data.company;
        }
    }
    Ext.getCmp("propsGrid").setSource({
        '(name)': 'Properties Grid',
        company: _company,
        created: new Date(Date.parse('10/15/2015'))
    });
}

function resetSelection() {
    idSelected = null;
}
Ext
        .onReady(function () {



            var selectModel = new Ext.grid.CheckboxSelectionModel();

            var grid = new Ext.grid.GridPanel({
                store: store,
                sm: selectModel,
                viewConfig: {
                    forceFit: true
                },
                loadMask: true,
                stripeRows: true,
                //bbar : pagingBar,
                tbar: ['->', new Ext.form.TwinTriggerField({
                        xtype: 'twintriggerfield',
                        trigger1Class: 'x-form-clear-trigger',
                        trigger2Class: 'x-form-search-trigger',
                        onTrigger1Click: function ()
                        {
                            this.setValue('');
                        },
                        onTrigger2Click: function ()
                        {
                            console.log(this.getValue());
                        }
                    })],
                columns: [
                    selectModel, {
                        header: "ID",
                        width: 170,
                        sortable: true,
                        dataIndex: 'id',
                        hidden: true,
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        }
                    }, {
                        header: "Sport Name",
                        hidden: true,
                        width: 170,
                        sortable: true,
                        dataIndex: 'sportName',
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        }
                    }, {
                        header: "Name",
                        width: 150,
                        sortable: true,
                        dataIndex: 'name',
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        }
                    }, {
                        header: "Description",
                        width: 150,
                        sortable: true,
                        dataIndex: 'description',
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        }

                    }

                ],
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Markets" : "Market"]})'
                }), bbar: new Ext.PagingToolbar({
                    pageSize: 20,
                    store: store,
                    method: 'get',
                    displayInfo: true,
                    displayMsg: 'Displaying markets {0} - {1} of {2}',
                    emptyMsg: "No markets found"
                })
            });



            grid.on('cellclick',
                    function (grid, rindx, cindx, e) {
                        // var cf =
                        // Ext.ComponentMgr.create(CourseForm);
                        var id = grid.getStore().getAt(rindx).get(
                                'id');
                        idSelected = id;
                        console.log('==>' + id);
                        fillProperties();
                    });

            grid.on('celldblclick',
                    function (grid, rindx, cindx, e) {
                        // var cf =
                        // Ext.ComponentMgr.create(CourseForm);
                        var id = grid.getStore().getAt(rindx).get(
                                'id');
                        idSelected = id;
                        console.log('double clicked ..' + id);
                        launchMemberForm(idSelected);
                        //fillProperties();
                    });

            //store.load({params:{start:0, limit:25}});
            var viewport = new Ext.Viewport(
                    {
                        layout: "fit",
                        items: [
                            // We add one "main" panel that fills up entire Viewport
                            {
                                layout: "border",
                                /*
                                 * defaults: { bodyStyle: 'padding:10px;', },
                                 */
                                tbar: new Ext.Toolbar(
                                        {
                                            // width: 500,
                                            items: [
                                                {
                                                    xtype: 'box',
                                                    autoEl: {
                                                        tag: 'div',
                                                        html: '<div class="app-msg"><img src="' + contextpath + '/static/images/favicon.png" class="app-img" width=30 height=30/></div>'

                                                    }
                                                },
                                                '-',
                                                {
                                                    xtype: 'splitbutton',
                                                    text: 'Participant',
                                                    iconCls: 'member',
                                                    menu: {
                                                        items: [
                                                            {
                                                                text: '<b>Add a Participant</b>',
                                                                handler: function () {

                                                                    launchMemberForm();
                                                                    resetSelection();
                                                                }
                                                            },
                                                            '-']
                                                    }

                                                }, {
                                                    xtype: 'splitbutton',
                                                    text: 'Markets',
                                                    iconCls: 'member',
                                                    menu: {
                                                        items: [
                                                            {
                                                                text: '<b>Upload Markets</b>',
                                                                handler: function () {

                                                                    requirejs([contextpath + '/static/ext/app/functions/fileUpload.js'], function () {
                                                                        getFiles();
                                                                    }

                                                                    )
                                                                }
                                                            },
                                                            {
                                                                text: '<i>View Report</i>',
                                                                handler: function () {
                                                                    addTab();
                                                                }
                                                            },
                                                            '-']
                                                    }

                                                },
                                                // begin using the
                                                // right-justified button
                                                // container
                                                '->', // same as { xtype:
                                                // 'tbfill' }
                                                {
                                                    xtype: 'textfield',
                                                    name: 'field1',
                                                    emptyText: 'enter search term'
                                                },
                                                {
                                                    xtype: 'tbspacer',
                                                    width: 50
                                                }, // add a 50px space
                                                {
                                                    xtype: 'button',
                                                    text: 'Logout',
                                                    iconCls: 'logout',
                                                    handler: function () {
                                                        window.location.href = contextpath + '/logout'
                                                    }
                                                }]
                                        }),
                                items: [
                                    // create instance immediately
                                    {
                                        // lazily created panel (xtype:'panel'
                                        // is default)
                                        region: 'south',
                                        contentEl: 'south',
                                        split: true,
                                        height: 200,
                                        minSize: 100,
                                        maxSize: 300,
                                        collapsible: true,
                                        collapsed: true,
                                        title: 'Member Contributions',
                                        margins: '0 0 0 0'
                                    },
                                    {
                                        region: 'east',
                                        title: 'Particulars',
                                        collapsible: true,
                                        split: true,
                                        width: 225, // give east and west
                                        // regions a width
                                        minSize: 175,
                                        maxSize: 400,
                                        margins: '0 5 0 0',
                                        layout: 'fit', // specify layout
                                        // manager for items
                                        items: // this TabPanel is wrapped by
                                                // another Panel so the title
                                                // will be applied
                                                new Ext.TabPanel(
                                                        {
                                                            border: false, // already
                                                            // wrapped
                                                            // so don't
                                                            // add
                                                            // another border
                                                            activeTab: 0, // second
                                                            // tab
                                                            // initially
                                                            // active
                                                            tabPosition: 'bottom',
                                                            items: [
                                                                new Ext.grid.PropertyGrid(
                                                                        {
                                                                            title: 'Property Grid',
                                                                            closable: true,
                                                                            id: "propsGrid",
                                                                            source: {
                                                                                "(name)": "Properties Grid",
                                                                                company: "",
                                                                                "created": new Date(Date.parse('10/15/2006'))
                                                                            }
                                                                        })]
                                                        })
                                    },
                                    {
                                        region: 'west',
                                        id: 'west-panel', // see Ext.getCmp()
                                        // below
                                        title: 'Settings',
                                        split: true,
                                        width: 200,
                                        minSize: 175,
                                        maxSize: 400,
                                        collapsible: true,
                                        collapsed: true,
                                        margins: '0 0 0 5',
                                        layout: {
                                            type: 'accordion',
                                            animate: true
                                        },
                                        items: [{
                                                title: 'Navigation',
                                                autoScroll: true,
                                                border: false,
                                                layout: 'fit',
                                                iconCls: 'nav',
                                                items: tree
                                            }]
                                    },
                                    new Ext.TabPanel({
                                        region: 'center', // a center region
                                        // is ALWAYS
                                        id: 'center-panel', // required for
                                        // border layout
                                        deferredRender: false,
                                        activeTab: 0, // first tab initially
                                        // active
                                        items: [{
                                                contentEl: 'center2',
                                                layout: 'fit',
                                                title: 'Markets',
                                                autoScroll: true,
                                                items: [grid]
                                            }]
                                    })]
                            }]
                    });

            var tab_counter = 0;

            function addTab() {
                Ext
                        .getCmp('center-panel')
                        .add(
                                new Ext.BoxComponent(
                                        {
                                            id: 'ihubdash' + (tab_counter++),
                                            title: 'Members List',
                                            closable: true,
                                            autoEl: {
                                                tag: 'iframe',
                                                closable: true,
                                                frameborder: '0',
                                                width: screen.width
                                                        * (90 / 100),
                                                height: screen.height
                                                        * (70 / 100),
                                                src: contextpath + '/viewer'
                                                        //src : 'http://localhost:8889/jasperserver/flow.html?_flowId=viewReportFlow&standAlone=true&_flowId=viewReportFlow&ParentFolderUri=%2Freports%2Fswift_reports&reportUnit=%2Freports%2Fswift_reports%2FmembersList&j_username=jasperadmin&j_password=jasperadmin&decorate=no'
                                            },
                                            listeners: {
                                                afterrender: function () {
                                                    console.log('rendered');

                                                    this.getEl().on('load', function () {
                                                        console.log('loaded');
                                                    });
                                                }
                                            }
                                        })).show();
            }

        });



//json data describing the tree
//json data describing the tree
var json = [
    {"text": "Operations", "id": 100, "leaf": false, "cls": "folder", "children": [
            {"text": "Sport Betting::", "id": 1000, "leaf": false, "cls": "folder", "children":
                        [{"text": "Markets", "id": "100000", "leaf": true, "cls": "file"},
                            {"text": "Participants", "id": "100001", "leaf": true, "cls": "file"},
                            {"text": "Reports", "id": "100002", "leaf": true, "cls": "file"},
                            {"text": "Options", "id": "100003", "leaf": true, "cls": "file"}
                        ]
            },
            {"text": "Home", "id": 2000, "leaf": false, "cls": "folder", "children":
                        [{"text": "Dashboard", "id": "200000", "leaf": true, "cls": "file"}
                        ]
            },
        ]}
];

var tree = new Ext.tree.TreePanel({
    animate: true,
    enableDD: false,
    loader: new Ext.tree.TreeLoader(), // Note: no dataurl, register a TreeLoader to make use of createNode()
    lines: true,
    renderTo: Ext.getBody(),
    root: new Ext.tree.AsyncTreeNode({
        text: 'Applications',
        draggable: false,
        id: 'source',
        children: json
    }),
    listeners: {
        'render': function (tp) {
            tp.getSelectionModel().on('selectionchange', function (tree, node) {
                console.log(node.text);
                if (node.text === 'Markets') {
                    window.location.href = contextpath + '/members'; //
                }
                if (node.text === 'Dashboard') {
                    window.location.href = contextpath + '/home'; //
                }
            })
        }
    },
    rootVisible: true,
});

tree.getRootNode().expand(true);
var treeNode = tree.getRootNode();

treeNode.expandChildNodes(true);