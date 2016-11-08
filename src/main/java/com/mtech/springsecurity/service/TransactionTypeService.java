/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.TransactionTypeDao;
import com.mtech.springsecurity.model.TransactionType;
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
public class TransactionTypeService {
    @Autowired
    TransactionTypeDao transactionTypeDao;
    
    @Autowired
    AppUtil appUtil;
    
    public TransactionType saveTransactionType(TransactionType transactionType){
        transactionTypeDao.saveTransactionType(transactionType);
        return transactionType;
    }
    
    public String getTransactionType(){
        List<TransactionType> transactionTypeList = transactionTypeDao.getTransactionTypeList();
        JSONObject jobj = null;
        JSONArray jarray = new JSONArray();
        for(TransactionType tt: transactionTypeList){
            jobj = new JSONObject();
            jobj.put("createdAt", appUtil.formatJSDate(tt.getCreatedAt()));
            jobj.put("id", tt.getId());
            jobj.put("tranName", tt.getTranName());
            jobj.put("tranShortName", tt.getTranShortName());
            jarray.add(jobj);
        }
        
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", transactionTypeList.size());
        wrapper.put("data", jarray);
        return wrapper.toString();
    }
}
