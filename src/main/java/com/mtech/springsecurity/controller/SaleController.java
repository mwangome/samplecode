/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccountTransactionsDao;
import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.dao.CustomerDao;
import com.mtech.springsecurity.dao.PaymentModeDao;
import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.dao.StockItemDao;
import com.mtech.springsecurity.dao.StoreDao;
import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.enumerate.PaymentModes;
import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.Customer;
import com.mtech.springsecurity.model.PaymentMode;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Sale;
import com.mtech.springsecurity.model.StockItem;
import com.mtech.springsecurity.model.Store;
import com.mtech.springsecurity.service.SaleService;
import com.mtech.springsecurity.service.StockLedgerService;
import com.mtech.springsecurity.util.NumberValue;
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
public class SaleController {

    Logger logger = Logger.getLogger(PurchaseController.class);
    
    @Autowired
    SaleService saleService;

    @Autowired
    SMEEntityDao smeEntityDao;

    @Autowired
    StoreDao storeDao;

    @Autowired
    StockItemDao stDao;

    @Autowired
    CustomerDao customerDao;

    @Autowired
    PaymentModeDao payDao;

    @Autowired
    StockLedgerService slService;

    @Autowired
    AccountTransactionsDao atDao;

    @Autowired
    AccountsDao accDao;
    
    @Autowired
    NumberValue nv;

    @RequestMapping(value = {"/sale/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveSale(@ModelAttribute Sale sale,
            @RequestParam(value = "registeredName", required = false) String registeredName,
            @RequestParam(value = "customerName", required = false) String customerName,
            @RequestParam(value = "storeName", required = false) String storeName,
            @RequestParam(value = "stockName", required = false) String stockName,
            @RequestParam(value = "payModeName", required = false) String payModeName,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        
        try{
            java.util.Date lastClosedDate = (java.util.Date)session.getAttribute("lastClosedDate");
            java.util.Date transDate = sale.getSaleDate();
            if(transDate.before(lastClosedDate)){
                return "{\"success\":false, \"msg\":\"Transaction stopped! You are not allowed to update transactions of a closed period!\"}";
            }
        }catch(Exception x){
            logger.warn("" + x);
        }

        Store store = storeDao.findStore(entity, storeName);
        StockItem stock = stDao.findStock(stockName, entity);
        Customer customer = customerDao.findCustomer(customerName);
        PaymentMode paymentMode = payDao.findPaymentMode(payModeName);

        /**
         * handle accounts transactions
         */
        String transRef = sale.getSalesRefNumber();

        /**
         * can return 2 items cr / dr
         */
        List<AccountTransactions> drCrTransItems = atDao.findAccountTransactions(entity, transRef);
        AccountTransactions drCrTransA = null;
        AccountTransactions drCrTransB = null;
        AccountTransactions drCrTransTax = null;

        /**
         * Selling on Credit
         */
        Accounts drAccount = accDao.findAccount(MappedAccountsEnum.Debtors.name());
        Accounts crAccount = accDao.findAccount(MappedAccountsEnum.Sales.name());

        /**
         * Selling on cash
         */
        Accounts crAccountCash = accDao.findAccount(payModeName);
        boolean transExists = false;
        if (drCrTransItems.isEmpty()) {
            drCrTransA = new AccountTransactions();
            drCrTransA.setTransRef(transRef);

            drCrTransB = new AccountTransactions();
            drCrTransB.setTransRef(transRef);
            
            drCrTransTax = new AccountTransactions();
            drCrTransTax.setTransRef(transRef);
        } else {
            transExists = true;
        }
        
        /**
         * handle VAT
         */
        Accounts crAccountTax = accDao.findAccount(MappedAccountsEnum.Tax.name());
        java.math.BigDecimal tax = java.math.BigDecimal.ZERO;
        java.math.BigDecimal saleValueLessTax = sale.getSalesValue();
        try {
            tax = sale.getVat();
            saleValueLessTax = saleValueLessTax.subtract(nv.getNumber(tax));
            logger.warn("minus tax::" + saleValueLessTax);
        } catch (Exception x) {
            logger.warn("Error setting tax::" + x);
        }

        if (PaymentModes.CREDIT.getDescription().equals(payModeName)) {
            drCrTransA.setDebit(sale.getSalesValue());
            drCrTransB.setCredit(saleValueLessTax);

            drCrTransB.setAccount(crAccount);
            drCrTransA.setAccount(drAccount);

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());

        } else {
            drCrTransA.setAccount(crAccountCash);
            drCrTransB.setAccount(crAccount);//crediting sales

            drCrTransA.setDebit(sale.getSalesValue());
            drCrTransB.setCredit(saleValueLessTax);

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
        }
        
        drCrTransTax.setTransRef(transRef);
        drCrTransTax.setTransDate(new java.util.Date());
        drCrTransTax.setCredit(tax);
        drCrTransTax.setAccount(crAccountTax);
        drCrTransTax.setSmeEntity(entity);
        drCrTransA.setSmeEntity(entity);
        drCrTransB.setSmeEntity(entity);

        if (!transExists) {
            atDao.saveAccountTransactions(drCrTransA);
            atDao.saveAccountTransactions(drCrTransB);
            atDao.saveAccountTransactions(drCrTransTax);
        }

        sale.setSmeEntity(entity);
        sale.setStock(stock);
        sale.setStore(store);
        sale.setPaymentMode(paymentMode);
        sale.setCustomer(customer);
        saleService.saveSale(sale);
        slService.updateStockLedger(entity, sale);
        return "{\"success\":true, \"msg\":\"You have successfully saved sale!\"}";
    }

    @RequestMapping(value = {"/sales/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getSalesList(HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String salesList = saleService.getSalesList(entity);
        return salesList;
    }

    @RequestMapping(value = {"/sale/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getSalesFormLoad(@RequestParam(value = "id", required = true) Long id) {
        String salesList = saleService.findSale(id);
        return salesList;
    }
}
