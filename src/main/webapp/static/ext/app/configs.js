var contextpath = getContextPath();
var csrf;
var csrfToken;

var storeCategories;

var entityId;

var entityName;

var baseUrl;

var jasperserver;

//path
var LOAN_CENTER;

var userEnabledLoan;

var userEnabledAccounts;

var loanModuleEnabled;

var accountsModuleEnabled = false;

var lastClosedDate;


Ext.Ajax.request({
    url: contextpath + '/user/getusername.action',
    method: 'POST',
    params: {
        _csrf: csrfToken
    },
    success: function (obj, resp) {
        console.log(obj)
        var json = JSON.parse(obj.responseText);
        entityId = json.entityId;
        entityName = json.entityName;
        baseUrl = json.base_url;
        lastClosedDate = json.lastClosedDate;
        jasperserver = json.jasperserver;
        LOAN_CENTER = json.LOAN_CENTER;
        userEnabledLoan = json.userEnabledLoan;
        userEnabledAccounts = json.userEnabledAccounts;
        loanModuleEnabled = json.userEnabledLoan;
        accountsModuleEnabled = json.accountsModuleEnabled;
        endDate = json.endDate;
    }, failure: function () {

    }
});




function getContextPath() {
    return window.location.pathname.substring(0, window.location.pathname
            .indexOf("/", 2));
}

/**
 * common datasources
 */

var industryGroups = new Ext.data.JsonStore({
    id: 'industrygroup-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/industrygroupsforstock/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'groupName', 'code', 'name']

});


var smeEntitySiteStore = new Ext.data.JsonStore({
    id: 'smeentity-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/entity/comboview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'registeredName', 'createdAt', 'createdAtDisplayed', 'tradingName',
        'regNumber', 'regDate', 'accessName',
        'physicalAddress', 'buildingLr', 'floorNumber',
        'streetName', 'townCode', 'postCode',
        'postNumber', 'emailAddress', 'phoneNumber', 'enabled']

});


var positionInEntityStore = new Ext.data.JsonStore({
    id: 'positioninentity-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/positioninentity/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'positionName', 'shortName', 'createdAt', 'isActive']

});


var expensesStore = new Ext.data.JsonStore({
    id: 'expenses-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/accountsexpense/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
        parentName: 'Operating Expenses'
    },
    root: 'data',
    fields: ['id', 'accountCode', 'accountName', 'parentId']

});

var accountsAccrualsStore = new Ext.data.JsonStore({
    id: 'accountsaccruals-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/accountsaccruals/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'accountCode', 'accountName', 'parentId']

});


var accountsPrepaidStore = new Ext.data.JsonStore({
    id: 'accountsaccruals-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/accountsprepaid/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'accountCode', 'accountName', 'parentId']

});

var shareholdingTypeStore = new Ext.data.JsonStore({
    id: 'shareholdingtype-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/shareholdingtypes/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'shareholdingTypeName', 'shortName', 'createdAt', 'isActive']

});


var identityTypesStore = new Ext.data.JsonStore({
    id: 'identitytype-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/identitytypes/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'typeCode', 'idTypeName', 'createdAt', 'isActive']

});



var stockItemsStore = new Ext.data.JsonStore({
    id: 'stores-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/stockitems/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'tax', 'vatable', 'registeredName', 'stockCode', 'stockName', 'stockNumber', 'unitOfIssue']

});

var suppliersStore = new Ext.data.JsonStore({
    id: 'suppliers-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/suppliers/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'supplierNumber', 'supplierName', 'address', 'town', 'paymentMode']

});


var storesStore = new Ext.data.JsonStore({
    id: 'stores-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/stores/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'storeName', 'storeNumber', 'storeLocation']

});

var payModesStore = new Ext.data.JsonStore({
    id: 'paymodes-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/paymodes/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'payMode', 'payModeName']

});

var customersStore = new Ext.data.JsonStore({
    id: 'customer-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/customers/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'customerNumber', 'customerName', 'address', 'town', 'paymentMode']

});

var assetCustomersStore = new Ext.data.JsonStore({
    id: 'assetcustomer-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/assetcustomers/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'customerNumber', 'customerName', 'address', 'town', 'paymentMode']

});

var assetTypeStore = new Ext.data.JsonStore({
    id: 'assettypes-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/assettypes/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'assetTypeName', 'depreciationRate', 'createdAt', 'isActive']

});

var uoiStore = new Ext.data.JsonStore({
    id: 'uoi-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/uoi/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'uoiCode', 'uoiName', 'createdAt', 'isActive']

});

var purchasesStore = new Ext.data.JsonStore({
    id: 'purchases-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/purchases/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'invoiceNumber','barcode', 'grnNumber', 'quantity', 'payModeName',
        'purchaseDate', 'purchaseValue', 'unitCost', 'supplierName', 'storeName']

});

var salesStore = new Ext.data.JsonStore({
    id: 'sales-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/sales/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'barcode', 'saleDate', 'customerName', 'quantity', 'payModeName',
        'salesRefNumber', 'salesValue', 'unitPrice', 'deliveryNote', 'stockName', 'storeName']

});

var paymentsStore = new Ext.data.JsonStore({
    id: 'payments-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/payments/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'registeredName', 'invoiceRef', 'paymentDate',
        'payModeName', 'paymentAmt', 'paymentRef', 'createdAt', 'isActive']

});

var paymentsAccrualsStore = new Ext.data.JsonStore({
    id: 'paymentsaccruals-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/paymentsaccruals/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'registeredName', 'invoiceRef', 'paymentDate',
        'payModeName', 'paymentAmt', 'paymentRef', 'createdAt', 'isActive']

});

var paymentsPrepaymentsStore = new Ext.data.JsonStore({
    id: 'paymentsprepayments-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/paymentsprepayments/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0,
    },
    root: 'data',
    fields: ['id', 'registeredName', 'invoiceRef', 'paymentDate',
        'payModeName', 'paymentAmt', 'paymentRef', 'createdAt', 'isActive']

});


var leaseTypeStore = new Ext.data.JsonStore({
    id: 'leasetypes-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/leasetypes/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'leaseTypeName', 'createdAt', 'isActive']

});


var branchesStore = new Ext.data.JsonStore({
    id: 'branches-store-id',
    proxy: new Ext.data.HttpProxy({
        url: contextpath + '/branch/gridview.action',
        method: 'POST'
    }),
    baseParams: {
        _csrf: csrfToken,
        start: 0
    },
    root: 'data',
    fields: ['id', 'branchName', 'branchCode', 'accessType', 'createdAt', 'buildingLrNumber', 'emailAddress']

});

var accountsClassStore = new Ext.data.ArrayStore({
    fields: ['accountClass'],
    data: [['Profit and Loss'],
        ['Balance Sheet']] // from states.js
});



Ext.onReady(function () {
    assetTypeStore.load({
        params: {
            _csrf: csrfToken
        }
    });

    customersStore.load();


    smeEntitySiteStore.load();
    positionInEntityStore.load();
    shareholdingTypeStore.load({
        params: {
            _csrf: csrfToken
        }
    });
    identityTypesStore.load();
    suppliersStore.load();

    payModesStore.load();

    uoiStore.load();

    stockItemsStore.load();

    purchasesStore.load();

    salesStore.load();

    storesStore.load();

    assetCustomersStore.load();
    
    industryGroups.load();
    
    paymentsAccrualsStore.load();
    
    paymentsPrepaymentsStore.load();
})