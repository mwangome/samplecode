/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.StockTransferDao;
import com.mtech.springsecurity.model.StockTransfer;
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
public class StockTransferService {

    @Autowired
    StockTransferDao stockTransferDao;
    
    @Autowired
    AppUtil appUtil;

    public StockTransfer saveStockTransfer(StockTransfer stockTransfer) {
        stockTransfer = stockTransferDao.saveStockTransfer(stockTransfer);
        return stockTransfer;
    }

    public String getStockTransferList() {
        List<StockTransfer> stockTransferList = stockTransferDao.getStockTransferList();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (StockTransfer st : stockTransferList) {
            object = new JSONObject();
            object.put("id", st.getId());
            object.put("createdBy", st.getCreatedBy());
            object.put("deliveryNote", st.getDeliveryNote());
            object.put("receiptNote", st.getReceiptNote());
            object.put("quantity", st.getQuantity());
            object.put("storeFromName", st.getStoreFrom().getStoreName());
            object.put("storeToName", st.getStoreTo().getStoreName());
            object.put("receiptDate", appUtil.formatJSDate(st.getReceiptDate()));
            object.put("receivedBy", st.getReceivedBy());
            object.put("stockName", st.getStock().getStockName());
            object.put("transferDate", appUtil.formatJSDate(st.getTransferDate()));
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", stockTransferList.size());
        return wrapper.toString();
    }

    public String findStockTransfer(Long id) {
        StockTransfer st = stockTransferDao.findStockTransfered(id);
        JSONObject object = null;
        object = new JSONObject();
        object.put("id", st.getId());
        object.put("registeredName", st.getSmeEntity().getRegisteredName());
        object.put("createdBy", st.getCreatedBy());
        object.put("deliveryNote", st.getDeliveryNote());
        object.put("receiptNote", st.getReceiptNote());
        object.put("quantity", st.getQuantity());
        object.put("storeFromName", st.getStoreFrom().getStoreName());
        object.put("storeToName", st.getStoreTo().getStoreName());

        object.put("receiptDate", appUtil.formatJSDate(st.getReceiptDate()));
        object.put("receivedBy", st.getReceivedBy());
        object.put("stockName", st.getStock().getStockName());
        object.put("transferDate", appUtil.formatJSDate(st.getTransferDate()));

        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", object);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
    
    public StockTransfer findStockTransfered(String registeredName,
            String storeName, 
            String stockName){
        return stockTransferDao.findStockTransfered(registeredName, storeName, stockName);
    }
}
