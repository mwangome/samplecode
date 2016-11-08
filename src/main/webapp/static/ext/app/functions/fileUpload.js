    var msg = function(title, msg) {
        Ext.Msg.show({
            title: title,
            msg: msg,
            minWidth: 200,
            modal: true,
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK
        });
    };   

 
var fp = new Ext.FormPanel({
        fileUpload: true,
        width: 550,
        height: 150,
        frame: true,
        autoHeight: true,
        bodyStyle: 'padding: 10px 10px 0 10px;',
        labelWidth: 50,
        defaults: {
            anchor: '95%',
            allowBlank: false,
            msgTarget: 'side'
        },
        items: [ {
			xtype : 'hidden',
			name : csrf,
			value:csrfToken ,
			id : 'csrfToken'
		},{
            xtype: 'textfield',
            fieldLabel: 'Upload Name',
            name: 'name'
        },{
            xtype:'datefield',
            fieldLabel: 'Upload Date',
            name: 'depositDate',
            id: 'depositDate',
            anchor:'95%'
        }, {
            xtype: 'fileuploadfield',
            id: 'form-file',
            emptyText: 'Select an xls file',
            fieldLabel: 'Excel File',
            name: 'file',
            anchor:'95%',
            buttonCfg: {
                iconCls: 'upload-icon'
            },
            buttonText: ''
        }],
        buttons: [{
            text: 'Save',
            handler: function() {
                if (fp.getForm().isValid()) {
                    fp.getForm().submit({
                        url: contextpath + '/savefile?&_csrf=' + csrfToken,
                        waitMsg: 'Uploading students...',
                        success: function(fp, o) {
                            msg('Success', 'Processed file "' + o.result.file + '" on the server');
                        }
                    });
                }
            }
        }, {
            text: 'Reset',
            handler: function() {
                fp.getForm().reset();
            }
        }]
    });

var win ;

function getFiles(){
    console.log("step one");
	win = Ext.getCmp('window-upload-contributions');
	if (!win) {
           
	win = new Ext.Window({
			id:'window-upload-contributions',
			layout: 'fit',
			title : 'Students\'s Upload',
	        frame: true,
	        closable: true,
			width : 570,
			height : 210,
			closeAction : 'hide',
			plain : true,

			items : [fp]

		});
	}
         console.log("step two")
	win.show();
}


