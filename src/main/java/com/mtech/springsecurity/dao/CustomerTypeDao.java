/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.CustomerType;

/**
 *
 * @author derek
 */
public interface CustomerTypeDao {
    CustomerType saveCustomerType(CustomerType customerType);
    
    java.util.List<CustomerType> getCustomerTypeList();
    
    CustomerType findCustomerType(Long id);
}
