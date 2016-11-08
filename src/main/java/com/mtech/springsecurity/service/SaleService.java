/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.SaleDao;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Sale;
import com.mtech.springsecurity.util.AppUtil;
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
public class SaleService {

    @Autowired
    SaleDao saleDao;

    @Autowired
    AppUtil appUtil;

    public Sale saveSale(Sale sale) {
        saleDao.saveSale(sale);
        return sale;
    }

    public String getSalesList(SMEEntity entity) {
        List<Sale> salesList = saleDao.getSalesList(entity);
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (Sale sale : salesList) {
            object = new JSONObject();
            object.put("id", sale.getId());
            object.put("vat", sale.getVat());
            object.put("barcode", sale.getBarcode());
            object.put("customerName", sale.getCustomer() == null ? "" : sale.getCustomer().getCustomerName());
            object.put("deliveryNote", sale.getDeliveryNote());
            object.put("payModeName", sale.getPaymentMode() == null ? "" : sale.getPaymentMode().getPayModeName());
            object.put("quantity", sale.getQuantity());
            object.put("saleDate", appUtil.formatJSDate(sale.getSaleDate()));
            object.put("salesValue", sale.getSalesValue());
            object.put("salesRefNumber", sale.getSalesRefNumber());
            object.put("unitPrice", sale.getUnitPrice());
            object.put("registeredName", sale.getSmeEntity() == null ? "" : sale.getSmeEntity().getRegisteredName());
            object.put("storeName", sale.getStore() == null ? "" : sale.getStore().getStoreName());
            object.put("stockName", sale.getStock() == null ? "" : sale.getStock().getStockName());
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("data", jarray);
        wrapper.put("success", true);
        wrapper.put("totalProperty", salesList.size());
        return wrapper.toString();
    }

    public String findSale(Long id) {
        Sale sale = saleDao.findSale(id);
        JSONObject object = new JSONObject();
        object.put("id", sale.getId());
        object.put("vat", sale.getVat());
        object.put("barcode", sale.getBarcode());
        object.put("customerName", sale.getCustomer() == null ? "" : sale.getCustomer().getCustomerName());
        object.put("deliveryNote", sale.getDeliveryNote());
        object.put("payModeName", sale.getPaymentMode() == null ? "" : sale.getPaymentMode().getPayModeName());
        object.put("quantity", sale.getQuantity());
        object.put("saleDate", appUtil.formatJSDate(sale.getSaleDate()));
        object.put("salesValue", sale.getSalesValue());
        object.put("salesRefNumber", sale.getSalesRefNumber());
        object.put("unitPrice", sale.getUnitPrice());
        object.put("registeredName", sale.getSmeEntity() == null ? "" : sale.getSmeEntity().getRegisteredName());
        object.put("storeName", sale.getStore() == null ? "" : sale.getStore().getStoreName());
        object.put("stockName", sale.getStock() == null ? "" : sale.getStock().getStockName());

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", object);
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }

}
