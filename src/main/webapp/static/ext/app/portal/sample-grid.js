/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
SampleGrid = function(limitColumns){

    function italic(value){
        return '<i>' + value + '</i>';
    }

    function change(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

    function pctChange(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '%</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    }


    var columns = [
        {id:'company',header: "Votehead", width: 160, sortable: true, dataIndex: 'company'},
        {header: "Amount", width: 75, sortable: true, renderer: Ext.util.Format.usMoney, dataIndex: 'price'},
        {header: "Received", width: 75, sortable: true, renderer: change, dataIndex: 'change'},
        {header: "% Arrears", width: 75, sortable: true, renderer: pctChange, dataIndex: 'pctChange'},
        {header: "Last Updated", width: 85, sortable: true, renderer: Ext.util.Format.dateRenderer('m/d/Y'), dataIndex: 'lastChange'}
    ];

    if(limitColumns){
        var cs = [];
        for(var i = 0, len = limitColumns.length; i < len; i++){
            cs.push(columns[limitColumns[i]]);
        }
        columns = cs;
    }

    SampleGrid.superclass.constructor.call(this, {
        store: new Ext.data.Store({
            reader: new Ext.data.ArrayReader({}, [
                   {name: 'company'},
                   {name: 'price', type: 'float'},
                   {name: 'change', type: 'float'},
                   {name: 'pctChange', type: 'float'},
                   {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
              ]),
             data: [
                    ['School Bus',71.72,0.02,0.03,'9/1 12:00am'],
                    ['Maintenance',29.01,0.42,1.47,'9/1 12:00am'],
                    ['Boarding Facilities',83.81,0.28,0.34,'9/1 12:00am'],
                    ['Traveling',52.55,0.01,0.02,'9/1 12:00am'],
                    ['Water',64.13,0.31,0.49,'9/1 12:00am'],
                    ['Electricity',31.61,-0.48,-1.54,'9/1 12:00am'],
                    ['Surboninate Salaries',75.43,0.53,0.71,'9/1 12:00am'],
                    ['BOG Allowances',67.27,0.92,1.39,'9/1 12:00am'],
                    ['BOG Teachers',49.37,0.02,0.04,'9/1 12:00am'],
                    ['Games',40.48,0.51,1.28,'9/1 12:00am'],
                    ['Development',68.1,-0.43,-0.64,'9/1 12:00am'],
                    ['Exams',34.14,-0.08,-0.23,'9/1 12:00am'],
                    ['New Buildings',30.27,1.09,3.74,'9/1 12:00am'],
                    ['Recreation',36.53,-0.03,-0.08,'9/1 12:00am'],
                    ['Catering',38.77,0.05,0.13,'9/1 12:00am'],
                    ['Medical Cover',19.88,0.31,1.58,'9/1 12:00am'],
                    ['Miscellaneous',81.41,0.44,0.54,'9/1 12:00am'],
                    ['Caution Fee',64.72,0.06,0.09,'9/1 12:00am']
                      ]
        }),
        columns: columns,
        autoExpandColumn: 'company',
        height:350,
        width:600
    });


}

Ext.extend(SampleGrid, Ext.grid.GridPanel);