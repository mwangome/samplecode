/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Supplier;
import java.util.List;

/**
 *
 * @author derek
 */
public interface SupplierDao {
    Supplier saveSupplier(Supplier supplier);
    
    public List<Supplier> getSupplierList(SMEEntity entity);
    
    public Supplier findSupplier(String supplierName);
}
