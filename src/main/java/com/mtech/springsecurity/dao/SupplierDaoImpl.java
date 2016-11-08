/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Supplier;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class SupplierDaoImpl extends AbstractDao<Long, Supplier> implements SupplierDao {

    public Supplier saveSupplier(Supplier supplier) {
        persist(supplier);
        return supplier;
    }

    public List<Supplier> getSupplierList(SMEEntity entity) {
        Query createQuery = getSession().createQuery("from Supplier supplier where supplier.entity.id = :entityId");
        createQuery.setParameter("entityId", entity.getId());
        return getList();
    }
    
    public Supplier findSupplier(String supplierName) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from Supplier supplier where supplier.supplierName = :supplierName");
        createQuery.setParameter("supplierName", supplierName);
        java.util.List<Supplier> list = createQuery.list();
        if(list.isEmpty()) {
            return null;
        }else{
            return list.get(0);
        } 
    }
    
}
