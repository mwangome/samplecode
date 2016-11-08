/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SupplierType;

/**
 *
 * @author derek
 */
public interface SupplierTypeDao {
    
    SupplierType saveSupplierType(SupplierType supplierType);
    
    java.util.List<SupplierType> getSupplierTypeList();
    
    SupplierType findSupplierType(Long id);
    
}
