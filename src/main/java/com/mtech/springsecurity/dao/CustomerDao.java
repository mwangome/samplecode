/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.AssetCustomer;
import com.mtech.springsecurity.model.TradeCustomer;
import com.mtech.springsecurity.model.Customer;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;

/**
 *
 * @author derek
 */
public interface CustomerDao {
    Customer saveCustomer(TradeCustomer customer);
    
    Customer saveCustomer(AssetCustomer customer);
    
    java.util.List<Customer> getCustomerList(SMEEntity entity);
    
    public Customer findCustomer(String customerName);
    
    public List<Customer> getAssetCustomers(SMEEntity entity);
}
