/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.StockItem;

/**
 *
 * @author derek
 */
public interface StockItemDao {
    
    StockItem saveStockItem(StockItem stockItem);
    
    java.util.List<StockItem> getStockItemsList(SMEEntity entity);
    
    StockItem findStockItem(Long id);
    
    public StockItem findStock(String stockName, SMEEntity entity);
    
    public StockItem findItemByBarcode(SMEEntity entity, String barcode);
}
