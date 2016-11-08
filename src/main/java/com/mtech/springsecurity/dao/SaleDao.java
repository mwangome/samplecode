/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Sale;
import java.util.List;

/**
 *
 * @author derek
 */
public interface SaleDao {
    
    Sale saveSale(Sale sale);
    
    public List<Sale> getSalesList(SMEEntity entity);
    
    Sale findSale(Long id);
    
    Sale findSale(String salesRefNumber);
    
    public List<Sale> getSalesList(SMEEntity entity, String stockName);
    
}
