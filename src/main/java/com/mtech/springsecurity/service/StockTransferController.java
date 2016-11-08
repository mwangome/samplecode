/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.dao.StockItemDao;
import com.mtech.springsecurity.dao.StockLedgerDao;
import com.mtech.springsecurity.dao.StoreDao;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.StockItem;
import com.mtech.springsecurity.model.StockLedger;
import com.mtech.springsecurity.model.StockTransfer;
import com.mtech.springsecurity.model.Store;
import com.mtech.springsecurity.util.AppUtil;
import com.mtech.springsecurity.util.NumberValue;
import javax.servlet.http.HttpSession;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author derek
 */
@Controller
public class StockTransferController {
    Logger logger = Logger.getLogger(StockTransferController.class);
    @Autowired
    StockTransferService stService;
    
    @Autowired
    AppUtil appUtil;
    
    @Autowired
    StockItemDao siDao;
    
    @Autowired
    StoreDao stDao;
    
    @Autowired
    SMEEntityDao smeDao;
    
    @Autowired
    StockLedgerService slService;
    
    @Autowired
    StockLedgerDao slDao;
    
    @Autowired
    NumberValue nv;
    
    @RequestMapping(value = {"/transfer/save.action"}, method = RequestMethod.POST)
    @ResponseBody    
    public String saveTransfer(@ModelAttribute StockTransfer transfer,
            @RequestParam(value = "storeFromName") String storeFromName,
            @RequestParam(value = "storeToName") String storeToName,
            @RequestParam(value = "registeredName") String registeredName,
            @RequestParam(value = "stockName") String stockName,
            HttpSession session){
        
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
            
        StockItem findStock = siDao.findStock(stockName, entity);
        Store storeFrom = stDao.findStore(entity, storeFromName);
        Store storeTo = stDao.findStore(entity,storeToName);
        SMEEntity findSMEEntity = smeDao.findSMEEntity(registeredName);
        
        transfer.setStock(findStock);
        transfer.setStoreFrom(storeFrom);
        transfer.setStoreTo(storeTo);
        transfer.setSmeEntity(findSMEEntity);
        
       
        /**
         * deduct where stock had been transfered from
         */
        StockLedger stockLedgerFrom = slService.findStockAvailable(registeredName, storeFromName, stockName);
         /**
         * No stock to transfer 
         */
        if(stockLedgerFrom == null){
            return "{\"success\":false, \"msg\":\"You cannot transfer from " +storeFrom.getStoreName()+ " because there is no " +findStock.getStockName()+ " stock!\"}";
        }
        stockLedgerFrom.setQtyBalance(nv.getNumber(stockLedgerFrom.getQtyBalance()).subtract(nv.getNumber(transfer.getQuantity())));
        
        StockLedger stockLedgerTo = slService.findStockAvailable(registeredName, storeToName, stockName);
        if(stockLedgerTo == null){
            stockLedgerTo = new StockLedger();
            stockLedgerTo.setQtyBalance(transfer.getQuantity());
            stockLedgerTo.setSmeEntity(findSMEEntity);
            stockLedgerTo.setStock(findStock);
            stockLedgerTo.setStore(storeTo);
            stockLedgerTo.setUnitOfIssue(findStock.getUnitOfIssue());
        }else{
            /**
             *  Target store already has stock so we add the transfer
             */
            stockLedgerTo.setQtyBalance(nv.getNumber(stockLedgerTo.getQtyBalance()).add(nv.getNumber(transfer.getQuantity())));
        }
        
        slDao.saveStockLedger(stockLedgerFrom);
        slDao.saveStockLedger(stockLedgerTo);        
        stService.saveStockTransfer(transfer);
        
        return appUtil.streamResponse("transfer").toString();
    }
    
    @RequestMapping(value = {"/transfers/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody    
    public String getTransferList(@ModelAttribute StockTransfer transfer){
        String stockTransferList = stService.getStockTransferList();
        return stockTransferList;
    }
    
    @RequestMapping(value = {"/transfer/formview.action"}, method = RequestMethod.POST)
    @ResponseBody    
    public String findTransfer(@RequestParam(value = "id") Long id){
        String stockTransfer = stService.findStockTransfer(id);
        return stockTransfer;
    }
}
