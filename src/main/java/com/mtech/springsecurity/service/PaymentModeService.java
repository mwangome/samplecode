/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.PaymentModeDao;
import com.mtech.springsecurity.enumerate.PaymentModes;
import com.mtech.springsecurity.model.PaymentMode;
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
public class PaymentModeService {

    @Autowired
    PaymentModeDao paymentModeDao;

    public PaymentMode savePaymentMode(PaymentMode paymentMode) {
        paymentMode = paymentModeDao.savePaymentMode(paymentMode);
        return paymentMode;
    }

    public String getPaymentModeList() {
        List<PaymentMode> paymentModesList = paymentModeDao.getPaymentModesList();

        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (PaymentMode paymentMode : paymentModesList) {
            object = new JSONObject();
            object.put("id", paymentMode.getId());
            object.put("payMode", paymentMode.getPayMode());
            object.put("payModeName", paymentMode.getPayModeName());
            jarray.add(object);

        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", paymentModesList.size());
        return wrapper.toString();
    }

    public String getPaymentModeForForm(Long id) {
        PaymentMode paymentMode = paymentModeDao.findPaymentMode(id);

        JSONObject object = new JSONObject();
        object.put("id", paymentMode.getId());
        object.put("payMode", paymentMode.getPayMode());
        object.put("payModeName", paymentMode.getPayModeName());

        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", object);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
    
    /**
     * 
     * @return 
     */
    public String getModes(){
        PaymentModes[] values = PaymentModes.values();
        
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        int counter = 0;
        for (PaymentModes paymentMode : values) {
            object = new JSONObject();
            object.put("id", counter++);
            object.put("payMode", paymentMode);
            object.put("payModeName", paymentMode.getDescription());
            jarray.add(object);

        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", values.length);
        
        return wrapper.toString();
    }
    
    
    public static void main(String[] args){
        PaymentModeService pms = new PaymentModeService();
        pms.getModes();
    }
}
