/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.StockTransfer;

/**
 *
 * @author derek
 */
public interface StockTransferDao {
    StockTransfer saveStockTransfer(StockTransfer stockTransfer);
    
    java.util.List<StockTransfer> getStockTransferList();
    
    StockTransfer findStockTransfered(Long id);
    
    public StockTransfer findStockTransfered(String registeredName,
            String storeName, 
            String stockName);
}
