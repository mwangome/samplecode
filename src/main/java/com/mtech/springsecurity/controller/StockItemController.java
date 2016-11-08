/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.IndustryGroupDao;
import com.mtech.springsecurity.dao.PurchaseDao;
import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.dao.StockItemDao;
import com.mtech.springsecurity.dao.StockLedgerDao;
import com.mtech.springsecurity.dao.StoreDao;
import com.mtech.springsecurity.dao.SupplierDao;
import com.mtech.springsecurity.dao.UnitOfIssueDao;
import com.mtech.springsecurity.dao.UserDao;
import com.mtech.springsecurity.model.IndustryGroup;
import com.mtech.springsecurity.model.Purchase;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.StockItem;
import com.mtech.springsecurity.model.Store;
import com.mtech.springsecurity.model.Supplier;
import com.mtech.springsecurity.model.UnitOfIssue;
import com.mtech.springsecurity.model.User;
import com.mtech.springsecurity.service.LineOfBusinessService;
import com.mtech.springsecurity.service.StockItemService;
import com.mtech.springsecurity.service.StockLedgerService;
import java.math.BigDecimal;
import java.util.List;
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
public class StockItemController {
    
    Logger logger = Logger.getLogger(StockItemController.class);
    
    @Autowired
    StockItemService stockItemService;
    
    @Autowired
    SMEEntityDao sMEEntityDao;
    
    @Autowired
    UnitOfIssueDao uoiDao;
    
    @Autowired
    StockLedgerService slDao;
    
    @Autowired
    StockLedgerDao lDao;
    
    @Autowired
    StockLedgerService slService;
    
    @Autowired
    IndustryGroupDao igDao;
    
    @Autowired
    LineOfBusinessService lobService;
    
    @Autowired
    UserDao userDao;
    
    @Autowired
    StockItemDao stockDao;
    
    @Autowired
    PurchaseDao purDao;
    
    @Autowired
    StoreDao storeDao;
    
    @Autowired
    SupplierDao supplierDao;
    
    @RequestMapping(value = {"/stockitem/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveItemStock(@ModelAttribute StockItem stockItem,
            @RequestParam(value = "registeredName", required = true) String registeredName,
            @RequestParam(value = "uoiName", required = true) String uoiName,
            @RequestParam(value = "groupName", required = false) String groupName){
        SMEEntity findSMEEntity = sMEEntityDao.findSMEEntity(registeredName);
        UnitOfIssue findUnitOfIssue = uoiDao.findUnitOfIssue(uoiName);
        IndustryGroup industryGrp = igDao.findIndustryGroupByName(groupName);
        if(industryGrp==null){
            return "{\"success\":fail, \"msg\":\"Operations Industry should be set!\"}";
        }
        stockItem.setIndustryGroup(industryGrp);
        stockItem.setSmeEntity(findSMEEntity);
        stockItem.setUnitOfIssue(findUnitOfIssue);
        stockItemService.saveStockItem(stockItem);
        return "{\"success\":true, \"msg\":\"You successfully saved stock!\"}";
    }
    @RequestMapping(value = {"/stockitems/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getItemStockList(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String stockItemsList = stockItemService.getStockItemsList(entity);
        return stockItemsList;
    }
    
    @RequestMapping(value = {"/stockitem/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String viewStockItem(@RequestParam(value = "id") Long id){
        String stockItems = stockItemService.findStockItem(id);
        return stockItems;
    }
    
    @RequestMapping(value = {"/stockledgers/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getStockLedger(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String stockLedger = slDao.getStockLedger(entity);
        return stockLedger;
    }
    
    @RequestMapping(value = {"/stockledgers/stockbalance.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getStockBalance(@RequestParam(value = "stockName") String stockName, HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        BigDecimal stockBalalance = lDao.stockBalance(entity, stockName);
        return "{\"success\":true, \"msg\":\"stock balance::" +stockBalalance+ "!\"}";
    }
    
    @RequestMapping(value = {"/stockledger/costofsales.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getCostOfSale(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        return slService.getCostOfSale(entity);
    }
    
    @RequestMapping(value = {"/industrygroupsforstock/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getIndustryGroups(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        return lobService.getIndustryGroups(entity);
    }
    
    @RequestMapping(value = {"/barcode/inventory.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getBarcode(@RequestParam(value = "barcode")String barcode, @RequestParam(value = "email")String email){
        User userObject = userDao.findByUsername(email);
        SMEEntity entity = userObject.getSmeEntity();
        StockItem item = stockDao.findItemByBarcode(entity, barcode);
        logger.warn("Barcode: " + barcode);
        
        Purchase purchase = new Purchase();
        purchase.setSmeEntity(userObject.getSmeEntity());
        purchase.setStock(item);
        
        List<Store> storeList = storeDao.getStoreList(entity);
        purchase.setStore(storeList.get(0));
        purchase.setCarriageInwards(BigDecimal.ZERO);
        purchase.setDocumentName("BARCODE");
        purchase.setUnitCost(BigDecimal.ZERO);
        purchase.setQuantity(BigDecimal.ONE);
        
        List<Supplier> supplierList = supplierDao.getSupplierList(entity);
        
        supplierDao.getSupplierList(entity);
        purchase.setSupplier(supplierList.get(0));
        
        purchase.setVat(BigDecimal.ZERO);
        
        purDao.savePurchase(purchase);
        
        return "{\"success\":true, \"msg\":\"" +item.getStockName()+ "\"}";
    }
    
    
    
    @RequestMapping(value = {"/purchasebarcode/item.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getItem(@RequestParam(value = "barcode") String barcode, HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String item = stockItemService.findItemByBarcode(entity,
                barcode);
        return item;
    }
    
}
