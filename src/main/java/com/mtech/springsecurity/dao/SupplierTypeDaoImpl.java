/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SupplierType;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class SupplierTypeDaoImpl extends AbstractDao<Long, SupplierType> implements SupplierTypeDao{

    public List<SupplierType> getSupplierTypeList() {
        return getList();
    }

    public SupplierType findSupplierType(Long id) {
        return getByKey(id);
    }

    public SupplierType saveSupplierType(SupplierType supplierType) {
        if(supplierType.getId() == null){
            persist(supplierType);
        }else{
            merge(supplierType);
        }
        
        return supplierType;
    }
    
}
