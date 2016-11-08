/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Purchase;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;

/**
 *
 * @author derek
 */
public interface PurchaseDao {
    
    Purchase savePurchase(Purchase purchase);
    
    public List<Purchase> getPurchasesList(SMEEntity entity);
    
    Purchase findPurchase(Long id);
    
    public List<Purchase> getPurchasesList(String stockName, String storeName, String registeredName);
    
    public Purchase findPurchase(String invoiceNumber);
    
}
