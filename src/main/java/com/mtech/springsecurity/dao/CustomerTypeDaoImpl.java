/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.CustomerType;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class CustomerTypeDaoImpl extends AbstractDao<Long, CustomerType> implements CustomerTypeDao{

    public CustomerType saveCustomerType(CustomerType customerType) {
        if(customerType.getId() == null){
            persist(customerType);
        }else{
            merge(customerType);
        }
        return customerType;
    }

    public List<CustomerType> getCustomerTypeList() {
        return getList();
    }

    public CustomerType findCustomerType(Long id) {
        return getByKey(id);
    }
    
}
