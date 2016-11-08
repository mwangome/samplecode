/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.CustomerTypeDao;
import com.mtech.springsecurity.model.CustomerType;
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
public class CustomerTypeService {

    @Autowired
    CustomerTypeDao ctDao;

    @Autowired
    AppUtil appUtil;
    
    public CustomerType saveCustomerType(CustomerType customerType){
        ctDao.saveCustomerType(customerType);
        return customerType;
    }

    public String getCustomerTypeList() {
        List<CustomerType> customerTypeList = ctDao.getCustomerTypeList();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (CustomerType ct : customerTypeList) {
            object = new JSONObject();
            object.put("id", ct.getId());
            object.put("createdBy", ct.getCreatedBy());
            object.put("customerTypeName", ct.getCustomerTypeName());
            object.put("createdAt", appUtil.formatJSDate(ct.getCreatedAt()));
            jarray.add(object);

        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", customerTypeList.size());
        wrapper.put("data", jarray);
        return wrapper.toString();
    }

    public String findCustomerType(Long id) {
        CustomerType ct = ctDao.findCustomerType(id);
        JSONObject object = new JSONObject();
        object.put("id", ct.getId());
        object.put("createdBy", ct.getCreatedBy());
        object.put("customerTypeName", ct.getCustomerTypeName());
        object.put("createdAt", appUtil.formatJSDate(ct.getCreatedAt()));

        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        wrapper.put("data", object);
        return wrapper.toString();
    }
}
