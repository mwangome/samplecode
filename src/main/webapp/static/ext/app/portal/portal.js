/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.onReady(function () {


    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    var tools = [{
            id: 'gear',
            handler: function () {
                Ext.Msg.alert('Message', 'The Settings tool was clicked.');
            }
        }, {
            id: 'close',
            handler: function (e, target, panel) {
                panel.ownerCt.remove(panel, true);
            }
        }];

    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [new Ext.Panel({
                layout: 'fit',
                region: 'north',
                height: 32,
                items: [toolBar]
            }), {
                region: 'west',
                id: 'west-panel',
                title: 'Options',
                split: true,
                width: 200,
                minSize: 175,
                maxSize: 400,
                collapsible: true,
                collapsed: true,
                margins: '5 0 5 5',
                cmargins: '5 5 5 5',
                layout: 'accordion',
                layoutConfig: {
                    animate: true
                },
                items: [{
                        title: 'Navigation',
                        autoScroll: true,
                        border: false,
                        layout: 'fit',
                        iconCls: 'nav',
                        items: tree
                    }, {
                        title: 'Settings',
                        border: false,
                        layout: 'fit',
                        autoScroll: true,
                        iconCls: 'settings',
                        items: settingsTree
                    }]
            }, {
                xtype: 'portal',
                region: 'center',
                margins: '5 5 5 0',
                items: [{
                        columnWidth: .49,
                        style: 'padding:10px 0 10px 10px',
                        items: [{
                                title: 'Revenue Chart 1',
                                tools: tools,
                                html: '<div id="chart-container">FusionCharts XT will load here!</div>'
                            }]
                    }, {
                        columnWidth: .49,
                        style: 'padding:10px 0 10px 10px',
                        items: [{
                                title: 'Revenue Chart 2',
                                tools: tools,
                                html: '<div id="chart-container-doughnut3d">FusionCharts XT will load here!</div>'
                            } ]
                    }]


            }]
    });



    Ext.Ajax.request({
        url: contextpath + '/user/getusername.action',
        method: 'POST',
        params: {
            _csrf: csrfToken
        },
        success: function (obj, resp) {
            console.log(obj)
            var json = JSON.parse(obj.responseText);
            //Ext.getCmp('logout').setText('Logout (' + json.name + ')');
            entityId = json.entityId;
            entityName = json.entityName;
            baseUrl = json.base_url;
            jasperserver = json.jasperserver;
            //Ext.getCmp('tree-panel').setTitle('SMEs Finance (' + entityName + ')');
            //accountsModuleEnabled ? Ext.getCmp('accounts-transactions').enable(true) : Ext.getCmp('accounts-transactions').disable(true)

            Ext.Ajax.request({
                url: contextpath + '/analytics/sales-gridview.action',
                method: 'GET',
                params: {
                    _csrf: csrfToken
                },
                success: function (obj, resp) {
                    console.log(obj)
                    var json = JSON.parse(obj.responseText);
                    console.log(json.data);
                    FusionCharts.ready(function () {
                        var revenueChart = new FusionCharts({
                            type: 'column2d',
                            renderAt: 'chart-container',
                            width: '550',
                            height: '500',
                            dataFormat: 'json',
                            dataSource: {
                                "chart": {
                                    "caption": "Monthly revenue for current year",
                                    "subCaption": "Sales per month",
                                    "xAxisName": "Month",
                                    "yAxisName": "Revenues (In KES)",
                                    "numberPrefix": "KES",
                                    "paletteColors": "#0075c2",
                                    "bgColor": "#ffffff",
                                    "borderAlpha": "20",
                                    "canvasBorderAlpha": "0",
                                    "usePlotGradientColor": "0",
                                    "plotBorderAlpha": "10",
                                    "placevaluesInside": "1",
                                    "rotatevalues": "1",
                                    "valueFontColor": "#ffffff",
                                    "showXAxisLine": "1",
                                    "xAxisLineColor": "#999999",
                                    "divlineColor": "#999999",
                                    "divLineIsDashed": "1",
                                    "showAlternateHGridColor": "0",
                                    "subcaptionFontBold": "0",
                                    "subcaptionFontSize": "14"
                                },
                                "data": json.data,
                                "trendlines": [
                                    {
                                        "line": [
                                            {
                                                "startvalue": "700000",
                                                "color": "#1aaf5d",
                                                "valueOnRight": "1",
                                                "displayvalue": "Monthly Target"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }).render();
                    });


                    FusionCharts.ready(function () {
                        var revenueChart = new FusionCharts({
                            type: 'doughnut3d',
                            renderAt: 'chart-container-doughnut3d',
                            width: '650',
                            height: '500',
                            dataFormat: 'json',
                            dataSource: {
                                "chart": {
                                    "caption": "Split of Revenue by Product Categories",
                                    "subCaption": "Sales per product",
                                    "numberPrefix": "$",
                                    "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                                    "bgColor": "#ffffff",
                                    "showBorder": "0",
                                    "use3DLighting": "0",
                                    "showShadow": "0",
                                    "enableSmartLabels": "0",
                                    "startingAngle": "310",
                                    "showLabels": "0",
                                    "showPercentValues": "1",
                                    "showLegend": "1",
                                    "legendShadow": "0",
                                    "legendBorderAlpha": "0",
                                    "decimals": "0",
                                    "captionFontSize": "14",
                                    "subcaptionFontSize": "14",
                                    "subcaptionFontBold": "0",
                                    "toolTipColor": "#ffffff",
                                    "toolTipBorderThickness": "0",
                                    "toolTipBgColor": "#000000",
                                    "toolTipBgAlpha": "80",
                                    "toolTipBorderRadius": "2",
                                    "toolTipPadding": "5",
                                },
                                "data": json.product
                            }
                        }).render();
                    });

                }, failure: function () {

                }
            });
        }, failure: function () {

        }
    });





});


var json = [
    {"text": "Finance Records::", "id": 1000, "leaf": false, "cls": "folder", "children":
                [{"text": "Finance", "id": "100000", "leaf": true, "cls": "file"},
//{"text" : "Reports", "id" : "100002", "leaf" : true, "cls" : "file"},
//{"text" : "Options", "id" : "100003", "leaf" : true, "cls" : "file"}
                ]
    },
    {"text": "Home", "id": 2000, "leaf": false, "cls": "folder", "children":
                [{"text": "Dashboard", "id": "200000", "leaf": true, "cls": "file"}
                ]
    },
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
                if (node.text === 'Finance') {
                    window.location.href = contextpath + '/mainmenu'; //
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

var settingsJson = [
    {"text": "Settings", "id": 101, "leaf": false, "cls": "folder", "children": [
            {"text": "Student Section::", "id": 1001, "leaf": false, "cls": "folder", "children":
                        [{"text": "Classes", "id": "100001", "leaf": true, "cls": "file"},
                            {"text": "Participants", "id": "100002", "leaf": true, "cls": "file"},
                            {"text": "Reports", "id": "100003", "leaf": true, "cls": "file"},
                            {"text": "Options", "id": "100004", "leaf": true, "cls": "file"}
                        ]
            },
            {"text": "Finance Section", "id": 2001, "leaf": false, "cls": "folder", "children":
                        [{"text": "Dashboard", "id": "200001", "leaf": true, "cls": "file"}
                        ]
            },
        ]}
];

var settingsTree = new Ext.tree.TreePanel({
    animate: true,
    enableDD: false,
    loader: new Ext.tree.TreeLoader(), // Note: no dataurl, register a TreeLoader to make use of createNode()
    lines: true,
    renderTo: Ext.getBody(),
    root: new Ext.tree.AsyncTreeNode({
        text: 'Applications',
        draggable: false,
        id: 'source2',
        children: settingsJson
    }),
    listeners: {
        'render': function (tp) {
            tp.getSelectionModel().on('selectionchange', function (tree, node) {
                console.log(node.text);
                if (node.text === 'Finance') {
                    window.location.href = contextpath + '/finance'; //
                }
                if (node.text === 'Dashboard') {
                    window.location.href = contextpath + '/home'; //
                }
                if (node.text === 'Classes') {
                    window.location.href = contextpath + '/settings'; //
                }
            })
        }
    },
    rootVisible: true,
});

settingsTree.getRootNode().expand(true);
var settingsTreeNode = settingsTree.getRootNode();

settingsTreeNode.expandChildNodes(true);

var toolBar = new Ext.Toolbar({
    items: [
        {
            xtype: 'box',
            autoEl: {
                tag: 'div',
                html: '<img src="' + contextpath + '/static/images/metrologo_half.png" width="24" height="24" />'

            }
        }, '-', {
            xtype: 'button',
            text: 'Main Menu',
            iconCls: 'member',
            handler: function () {
                window.location.href = contextpath + '/mainmenu'
            }
        },
        '->', // add a 50px space
        {
            xtype: 'button',
            text: 'Logout',
            iconCls: 'logout',
            handler: function () {
                window.location.href = contextpath + '/logout'
            }
        }]
});