/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.CurrencyDao;
import com.mtech.springsecurity.model.Currency;
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
public class CurrencyService {
    @Autowired
    CurrencyDao currencyDao;
    
    @Autowired
    AppUtil appUtil;
    
    public Currency saveCurrency(Currency currency){
        currency = currencyDao.saveCurrency(currency);
        return currency;
    }
    
    public String getCurrencyList(){
        List<Currency> currencyList = currencyDao.getCurrencyList();
        JSONArray jArray = new JSONArray();
        for(Currency currency: currencyList){
            JSONObject object = new JSONObject();
            object.put("currencyCode", currency.getCurrencyCode());
            object.put("currencyName", currency.getCurrencyName());
            object.put("createdAt", appUtil.formatJSDate(currency.getCreatedAt()));
            object.put("isActive", currency.isIsActive());
            object.put("id", currency.getId());
            jArray.add(object);
        }
        
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", currencyList.size());
        wrapper.put("data", jArray);
        return wrapper.toString();
    }
}
