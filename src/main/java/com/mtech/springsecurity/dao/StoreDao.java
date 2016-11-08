/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Store;

/**
 *
 * @author derek
 */
public interface StoreDao {
    Store saveStore(Store store);
    
    java.util.List<Store> getStoreList(SMEEntity entity);
    
    public Store findStore(SMEEntity entity, String storeName);
    
    public Store findStore(Long id);
}
