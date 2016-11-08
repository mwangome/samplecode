/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.StockItemDao;
import com.mtech.springsecurity.dao.TaxDao;
import com.mtech.springsecurity.enumerate.TaxTypes;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.StockItem;
import com.mtech.springsecurity.model.Tax;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class StockItemService {

    @Autowired
    StockItemDao stockItemDao;
    
    @Autowired
    TaxDao taxDao;

    public StockItem saveStockItem(StockItem stockItem) {
        stockItemDao.saveStockItem(stockItem);
        return stockItem;
    }

    public String getStockItemsList(SMEEntity entity) {
        List<StockItem> stockItemsList = stockItemDao.getStockItemsList(entity);
        Tax taxType = taxDao.findTax(TaxTypes.VAT.getDescription());
        JSONArray array = new JSONArray();
        JSONObject object = null;
        for (StockItem stockItem : stockItemsList) {
            object = new JSONObject();
            object.put("id", stockItem.getId());
            object.put("tax", taxType == null?"0":taxType.getTax());
            object.put("vatable", stockItem.isVatable());
            object.put("stockCode", stockItem.getStockCode());
            object.put("barcode", stockItem.getBarcode());
            object.put("description", stockItem.getDescription());
            object.put("groupName", stockItem.getIndustryGroup().getName());
            object.put("vatable", stockItem.isVatable());
            object.put("stockName", stockItem.getStockName());
            object.put("unitOfIssue", stockItem.getUnitOfIssue() == null?"":stockItem.getUnitOfIssue().getUoiName());
            object.put("registeredName", stockItem.getSmeEntity() == null ? "" : stockItem.getSmeEntity().getRegisteredName());
            array.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("data", array);
        wrapper.put("success", true);
        wrapper.put("totalProperty", stockItemsList.size());
        return wrapper.toString();
    }

    public String findStockItem(Long id) {
        StockItem stockItem = stockItemDao.findStockItem(id);
        JSONObject object = new JSONObject();
        object.put("id", stockItem.getId());
        object.put("stockCode", stockItem.getStockCode());
        object.put("barcode", stockItem.getBarcode());
        object.put("groupName", stockItem.getIndustryGroup().getName());
        object.put("vatable", stockItem.isVatable());
        object.put("stockName", stockItem.getStockName());
        object.put("uoiName", stockItem.getUnitOfIssue() == null?"":stockItem.getUnitOfIssue().getUoiName());
        object.put("registeredName", stockItem.getSmeEntity() == null ? "" : stockItem.getSmeEntity().getRegisteredName());
        object.put("description", stockItem.getDescription());
        object.put("vatable", stockItem.isVatable());
        JSONObject wrapper = new JSONObject();
        wrapper.put("data", object);
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
    
    public String findItemByBarcode(SMEEntity entity, String barcode) {
        StockItem item = stockItemDao.findItemByBarcode(entity, barcode);
        return item.getStockName();
    }
}
