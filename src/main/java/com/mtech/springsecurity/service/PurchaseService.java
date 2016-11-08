/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.PurchaseDao;
import com.mtech.springsecurity.model.Purchase;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import com.mtech.springsecurity.util.NumberValue;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class PurchaseService {

    @Autowired
    PurchaseDao purchaseDao;

    @Autowired
    AppUtil appUtil;
    
    @Autowired
    NumberValue nv;

    public Purchase savePurchase(Purchase purchase) {
        purchase = purchaseDao.savePurchase(purchase);
        return purchase;
    }

    public String getPurchasesList(SMEEntity entity) {
        List<Purchase> purchasesList = purchaseDao.getPurchasesList(entity);
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (Purchase purchase : purchasesList) {
            object = new JSONObject();
            object.put("id", purchase.getId());
            object.put("vat", purchase.getVat());
            object.put("barcode", purchase.getBarcode());
            object.put("grnNumber", purchase.getGrnNumber());
            object.put("carriageInwards", purchase.getCarriageInwards());
            object.put("invoiceNumber", purchase.getInvoiceNumber());
            object.put("documentName", purchase.getDocumentName());
            
            object.put("vat", appUtil.formatNumber(nv.getNumber(purchase.getVat())));
            
            object.put("quantity", purchase.getQuantity());
            object.put("payModeName", purchase.getPaymentMode() == null ? "" : purchase.getPaymentMode().getPayModeName());
            object.put("purchaseDate", appUtil.formatJSDate(purchase.getPurchaseDate()));
            object.put("purchaseValue", purchase.getPurchaseValue());
            object.put("unitCost", purchase.getUnitCost());
            object.put("supplierName", purchase.getSupplier() == null ? "" : purchase.getSupplier().getSupplierName());
            object.put("storeName", purchase.getStore() == null ? "" : purchase.getStore().getStoreName());
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("data", jarray);
        wrapper.put("success", true);
        wrapper.put("totalProperty", purchasesList.size());
        return wrapper.toString();
    }

    public String getPurchaseForForm(Long id) {
        Purchase purchase = purchaseDao.findPurchase(id);

        JSONObject object = null;
        object = new JSONObject();
        object.put("id", purchase.getId());
        object.put("grnNumber", purchase.getGrnNumber());
        object.put("barcode", purchase.getBarcode());
        object.put("invoiceNumber", purchase.getInvoiceNumber());
        object.put("documentName", purchase.getDocumentName());
        object.put("carriageInwards", purchase.getCarriageInwards());
        object.put("quantity", purchase.getQuantity());
        object.put("registeredName", purchase.getSmeEntity() == null ? "" : purchase.getSmeEntity().getRegisteredName());
        object.put("payModeName", purchase.getPaymentMode() == null ? "" : purchase.getPaymentMode().getPayModeName());
        object.put("purchaseDate", appUtil.formatJSDate(purchase.getPurchaseDate()));
        object.put("purchaseValue", purchase.getPurchaseValue());
        
        object.put("vat", appUtil.formatNumber(nv.getNumber(purchase.getVat())));
        
        object.put("unitCost", purchase.getUnitCost());
        object.put("supplierName", purchase.getSupplier() == null ? "" : purchase.getSupplier().getSupplierName());
        object.put("storeName", purchase.getStore() == null ? "" : purchase.getStore().getStoreName());
        object.put("stockName", purchase.getStock() == null ? "" : purchase.getStock().getStockName());

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", object);
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
}
