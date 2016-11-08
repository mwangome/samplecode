var accountingPeriodsStore = new Ext.data.JsonStore({
    id: 'accountingperiods-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/aps/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'startDate', 'endDate', 'status', 'sequence'],
    sortInfo: {
            field: 'id',
            direction: 'ASC'
        }

});

accountingPeriodsStore.load();

var apSelectModel = new Ext.grid.CheckboxSelectionModel();
var accountingPeriodsGrid = new Ext.grid.GridPanel(
        {
            store: accountingPeriodsStore,
            height: 200,
            title: 'Periods',
            minSize: 75,
            maxSize: 250,
            id: 'ap-grid-panel',
            sm: apSelectModel,
            viewConfig: {
                forceFit: true
            }, listeners: {
                cellclick: function (grd, rowIndex, colIndex, e) {

                }
            },
            loadMask: true,
            stripeRows: true,
            tbar: [{
                    text: 'Start Date'
            },{
                    text: 'Start Date',
                    anchor: '50%',
                    xtype: 'datefield',
                    id: 'startDate'

                }, '-', {
                    xtype: 'button',
                    text: 'Generate Periods',
                    iconCls: 'silk-comment-add',
                    handler: function () {
                        var date = Ext.getCmp('startDate').getValue();
                        var fDate = date.format('m/d/Y');
                        Ext.Ajax.request({
                            url: contextpath + '/ap/savelist.action',
                            method: 'POST',
                            params: {
                                _csrf: csrfToken,
                                startDate: fDate
                            },
                            success: function (obj, resp) {
                                console.log(obj)
                                var json = JSON.parse(obj.responseText);
                                console.log(json);
                                Ext.MessageBox.show({
                                    title: 'Server message',
                                    msg: json.msg,
                                    icon: Ext.MessageBox.INFO,
                                    buttons: Ext.MessageBox.OK
                                });
                                accountingPeriodsStore.load();
                            }, failure: function () {
                                Ext.MessageBox.show({
                                    title: 'Server message',
                                    msg: 'Save attempt failed!',
                                    icon: Ext.MessageBox.WARNING,
                                    buttons: Ext.MessageBox.OK
                                })
                            }
                        });

                    }

                }, '-', {
                    xtype: 'button',
                    text: 'Close period',
                    iconCls: 'silk-book',
                    handler: function () {
                        var id = Ext.getCmp('ap-grid-panel').getSelectionModel().getSelected().get('id');
                        Ext.Ajax.request({
                            url: contextpath + '/ap/close.action',
                            method: 'POST',
                            params: {
                                _csrf: csrfToken,
                                id: id
                            },
                            success: function (obj, resp) {
                                console.log(obj)
                                var json = JSON.parse(obj.responseText);
                                console.log(json);
                                Ext.MessageBox.show({
                                    title: 'Server message',
                                    msg: json.msg,
                                    icon: Ext.MessageBox.INFO,
                                    buttons: Ext.MessageBox.OK
                                });
                                accountingPeriodsStore.load();
                            }, failure: function () {
                                Ext.MessageBox.show({
                                    title: 'Server message',
                                    msg: 'Save attempt failed!',
                                    icon: Ext.MessageBox.WARNING,
                                    buttons: Ext.MessageBox.OK
                                })
                            }
                        });

                    }

                }],
            columns: [apSelectModel, {
                    header: 'Id',
                    width: 160,
                    sortable: true,
                    hidden: true,
                    dataIndex: 'id'
                }, {
                    header: 'Start Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'startDate'
                }, {
                    header: 'End Date',
                    width: 75,
                    sortable: true,
                    dataIndex: 'endDate'
                }, {
                    header: 'Sequence',
                    width: 75,
                    sortable: true,
                    dataIndex: 'sequence'
                }, {
                    header: 'Status',
                    width: 75,
                    sortable: true,
                    dataIndex: 'status'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 25,
                store: accountingPeriodsStore,
                method: 'get',
                displayInfo: true,
                displayMsg: 'Displaying period(s) {0} - {1} of {2}',
                emptyMsg: "No period(s) found"
            })
        });
