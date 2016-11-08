var helpPanel = new Ext.TabPanel({
    autoTabs: true,
    id: 'help-panel',
    activeTab: 0,
    deferredRender: false,
    border: false
}
)

Ext.getCmp('help-panel').add(
        new Ext.BoxComponent(
                {
                    id: 'help-panel-doc',
                    title: 'Help',
                    autoEl: {
                        tag: 'iframe',
                        closable: false,
                        frameborder: '50',
                        width: screen.width
                                * (90 / 100),
                        height: screen.height
                                * (70 / 100),
                        src: 'https://docs.google.com/document/d/1wo_J7IB4EguojHFZw4O2EodS707wNjVnSOjRNoKuBDg/pub'

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
