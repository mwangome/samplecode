/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.StockItem;
import com.mtech.springsecurity.model.StockLedger;
import java.util.List;

/**
 *
 * @author derek
 */
public interface StockLedgerDao {
    
    StockLedger saveStockLedger(StockLedger stockLedger);
    
    java.util.List<StockLedger> getStockLedgerList(SMEEntity entity);
        
    StockLedger getLastStockLedgerRecord(SMEEntity entity);
    
    StockLedger getLastStockLedgerRecord(SMEEntity entity,String stockName);
    
    public java.math.BigDecimal  stockBalance(SMEEntity entity, String stockName);
    
    public StockLedger findStockAvailable(String registeredName,
            String storeName, 
            String stockName);
    
    public List<StockLedger> getStockLedgerList(SMEEntity entity, StockItem stock);
}
