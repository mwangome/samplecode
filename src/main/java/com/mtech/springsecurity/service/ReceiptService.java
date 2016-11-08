/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.ReceiptDao;
import com.mtech.springsecurity.model.Receipt;
import com.mtech.springsecurity.model.SMEEntity;
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
public class ReceiptService {

    @Autowired
    ReceiptDao receiptDao;
    
    @Autowired
    AppUtil appUtil;

    public Receipt saveReceipt(Receipt receipt) {
        receipt = receiptDao.saveReceipt(receipt);
        return receipt;
    }

    public String getReceiptList(SMEEntity entity) {
        List<Receipt> receiptsList = receiptDao.getReceiptsList(entity);
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (Receipt r : receiptsList) {
            object = new JSONObject();
            object.put("id", r.getId());
            object.put("createdAt", appUtil.formatJSDate(r.getCreatedAt()));
            object.put("salesRefNumber", r.getSale()== null?"": r.getSale().getSalesRefNumber());
            object.put("receiptAmt", r.getReceiptAmt());
            object.put("receiptDate", appUtil.formatJSDate(r.getReceiptDate()));
            object.put("receiptMode", r.getReceiptMode());
            object.put("receiptRef", r.getReceiptRef());
            object.put("isActive", r.isIsActive());
            object.put("registeredName", r.getSmeEntity() == null?"":r.getSmeEntity().getRegisteredName());
            jarray.add(object);
        }

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", jarray);
        wrapper.put("success", true);
        wrapper.put("totalProperty", receiptsList.size());
        return wrapper.toString();
    }

    public String findReceipt(Long id) {
        Receipt r = receiptDao.findReceipt(id);
        JSONObject object = null;
        object = new JSONObject();
        object.put("id", r.getId());
        object.put("createdAt", appUtil.formatJSDate(r.getCreatedAt()));
        object.put("salesRefNumber", r.getSale()== null?"": r.getSale().getSalesRefNumber());
        object.put("receiptAmt", r.getReceiptAmt());
        object.put("receiptDate", appUtil.formatJSDate(r.getReceiptDate()));
        object.put("receiptMode", r.getReceiptMode());
        object.put("receiptRef", r.getReceiptRef());
        object.put("isActive", r.isIsActive());
        object.put("registeredName", r.getSmeEntity() == null?"":r.getSmeEntity().getRegisteredName());

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", object);
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
}
