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
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class CustomerDaoImpl extends AbstractDao<Long, Customer> implements CustomerDao{

    public TradeCustomer saveCustomer(TradeCustomer customer) {
        persist(customer);
        return customer;
    }
    
    public AssetCustomer saveCustomer(AssetCustomer customer) {
        persist(customer);
        return customer;
    }

    public List<Customer> getCustomerList(SMEEntity entity) {
        Query createQuery = getSession().createQuery("from TradeCustomer ac where ac.entity.id=:entityId");
        createQuery.setParameter("entityId", entity.getId());
        return createQuery.list();
    }
    
    public List<Customer> getAssetCustomers(SMEEntity entity){
        Query createQuery = getSession().createQuery("from AssetCustomer ac where ac.entity.id=:entityId");
        createQuery.setParameter("entityId", entity.getId());
        return createQuery.list();
    }
    
    public Customer findCustomer(String customerName) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from Customer customer where customer.customerName = :customerName");
        createQuery.setParameter("customerName", customerName);
        java.util.List<Customer> list = createQuery.list();
        if(list.isEmpty()) {
            return null;
        }else{
            return list.get(0);
        } 
    }

    
}
