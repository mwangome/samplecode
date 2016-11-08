/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.CustomerDao;
import com.mtech.springsecurity.dao.SupplierDao;
import com.mtech.springsecurity.model.Customer;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Supplier;
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
public class SetupService {
    @Autowired
    SupplierDao supplierDao;
    
    @Autowired
    CustomerDao customerDao;
    
    
    public String getSuppliersList(SMEEntity entity){
        List<Supplier> supplierList = supplierDao.getSupplierList(entity);
        JSONArray supplierArray = new JSONArray();
        for(Supplier supplier:supplierList){
            JSONObject object = new JSONObject();
            object.put("id", supplier.getId());
            object.put("address", supplier.getAddress());
            object.put("town", supplier.getTown());
            object.put("paymentMode", supplier.getPaymentMode());
            object.put("supplierName", supplier.getSupplierName());
            object.put("supplierNumber", supplier.getSupplierNumber());
            supplierArray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalCount", supplierList.size());
        wrapper.put("data", supplierArray);
        return wrapper.toString();
    }
    
     public String getCustomersList(SMEEntity entity){
        List<Customer> customersList = customerDao.getCustomerList(entity);
        JSONArray supplierArray = new JSONArray();
        for(Customer customer:customersList){
            JSONObject object = new JSONObject();
            object.put("id", customer.getId());
            object.put("address", customer.getAddress());
            object.put("town", customer.getTown());
            object.put("paymentMode", customer.getPaymentMode());
            object.put("customerName", customer.getCustomerName());
            object.put("customerNumber", customer.getCustomerNumber());
            supplierArray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalCount", customersList.size());
        wrapper.put("data", supplierArray);
        return wrapper.toString();
    }
     
     public String getAssetCustomersList(SMEEntity entity){
        List<Customer> customersList = customerDao.getAssetCustomers(entity);
        JSONArray supplierArray = new JSONArray();
        for(Customer customer:customersList){
            JSONObject object = new JSONObject();
            object.put("id", customer.getId());
            object.put("address", customer.getAddress());
            object.put("town", customer.getTown());
            object.put("paymentMode", customer.getPaymentMode());
            object.put("customerName", customer.getCustomerName());
            object.put("customerNumber", customer.getCustomerNumber());
            supplierArray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalCount", customersList.size());
        wrapper.put("data", supplierArray);
        return wrapper.toString();
    }
}
