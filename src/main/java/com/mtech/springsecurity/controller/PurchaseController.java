/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccountTransactionsDao;
import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.dao.PaymentModeDao;
import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.dao.StockItemDao;
import com.mtech.springsecurity.dao.StoreDao;
import com.mtech.springsecurity.dao.SupplierDao;
import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.enumerate.PaymentModes;
import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.PaymentMode;
import com.mtech.springsecurity.model.Purchase;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.StockItem;
import com.mtech.springsecurity.model.Store;
import com.mtech.springsecurity.model.Supplier;
import com.mtech.springsecurity.service.PurchaseService;
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
public class PurchaseController {

    Logger logger = Logger.getLogger(PurchaseController.class);

    @Autowired
    PurchaseService purchaseService;

    @Autowired
    SMEEntityDao smeEntityDao;

    @Autowired
    StoreDao storeDao;

    @Autowired
    StockItemDao stDao;

    @Autowired
    SupplierDao supplierDao;

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

    @RequestMapping(value = {"/purchase/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String savePurchase(@ModelAttribute Purchase purchase,
            //@RequestParam(value = "registeredName", required = false) String registeredName,
            @RequestParam(value = "supplierName", required = false) String supplierName,
            @RequestParam(value = "storeName", required = false) String storeName,
            @RequestParam(value = "stockName", required = false) String stockName,
            @RequestParam(value = "payModeName", required = false) String payModeName,
            HttpSession session) {
        //SMEEntity sme = 

        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }

        try {
            java.util.Date lastClosedDate = (java.util.Date) session.getAttribute("lastClosedDate");
            java.util.Date purDate = purchase.getPurchaseDate();
            logger.warn(purDate + "::transaction stopped::>" + lastClosedDate);
            if (purDate.before(lastClosedDate)) {
                return "{\"success\":false, \"msg\":\"Transaction stopped! You are not allowed to update transactions of a closed period!\"}";
            }
        } catch (Exception x) {
            logger.warn("transaction stopped::>" + x);
        }

        Store store = storeDao.findStore(entity, storeName);
        StockItem stock = stDao.findStock(stockName, entity);
        Supplier supplier = supplierDao.findSupplier(supplierName);
        PaymentMode paymentMode = payDao.findPaymentMode(payModeName);

        /**
         * handle account transactions
         */
        String transRef = purchase.getInvoiceNumber();

        /**
         * can return 2 items cr / dr
         */
        List<AccountTransactions> drCrTransItems = atDao.findAccountTransactions(entity, transRef);
        AccountTransactions drCrTransA = null;
        AccountTransactions drCrTransB = null;
        AccountTransactions drCrTransTax = null;

        AccountTransactions drCrTransFreightA = null;
        AccountTransactions drCrTransFreightB = null;
        /**
         * Buying on Credit
         */
        Accounts drAccount = accDao.findAccount(MappedAccountsEnum.Purchases.name());
        Accounts crAccount = accDao.findAccount(MappedAccountsEnum.Creditors.name());

        Accounts drAccountFreight = accDao.findAccount(MappedAccountsEnum.Freight_In.getDescription());
        Accounts crAccountFreight = accDao.findAccount(MappedAccountsEnum.Bank.name());
        /**
         * Buying cash
         */
        Accounts crAccountCash = accDao.findAccount(payModeName);
        boolean transExists = false;
        if (drCrTransItems.isEmpty()) {
            drCrTransA = new AccountTransactions();
            drCrTransA.setTransRef(transRef);

            drCrTransB = new AccountTransactions();
            drCrTransB.setTransRef(transRef);

            drCrTransTax = new AccountTransactions();

            drCrTransFreightA = new AccountTransactions();
            drCrTransFreightB = new AccountTransactions();

        } else {
            transExists = true;
        }

        /**
         * handle VAT
         */
        Accounts drAccountTax = accDao.findAccount(MappedAccountsEnum.Tax.name());
        java.math.BigDecimal tax = java.math.BigDecimal.ZERO;
        java.math.BigDecimal purchaseValueLessTax = purchase.getPurchaseValue();
        try {
            tax = purchase.getVat();
            purchaseValueLessTax = purchaseValueLessTax.subtract(nv.getNumber(tax));
            logger.warn("minus tax::" + purchaseValueLessTax);
        } catch (Exception x) {
            logger.warn("Error setting tax::" + x);
        }

        if (PaymentModes.CREDIT.getDescription().equals(payModeName)) {
            drCrTransA.setDebit(purchaseValueLessTax);
            drCrTransB.setCredit(purchase.getPurchaseValue());

            drCrTransB.setAccount(crAccount);
            drCrTransA.setAccount(drAccount);

        } else {
            drCrTransA.setAccount(drAccount);
            drCrTransB.setAccount(crAccountCash);

            drCrTransA.setDebit(purchaseValueLessTax);
            drCrTransB.setCredit(purchase.getPurchaseValue());

        }

        drCrTransTax.setTransRef(transRef);
        drCrTransTax.setTransDate(new java.util.Date());
        drCrTransTax.setDebit(tax);
        drCrTransTax.setAccount(drAccountTax);

        drCrTransA.setTransDate(new java.util.Date());
        drCrTransB.setTransDate(new java.util.Date());

        drCrTransFreightA.setTransDate(new java.util.Date());
        drCrTransFreightB.setTransDate(new java.util.Date());
        drCrTransFreightA.setDebit(purchase.getCarriageInwards());
        drCrTransFreightB.setCredit(purchase.getCarriageInwards());

        drCrTransFreightA.setAccount(drAccountFreight);
        drCrTransFreightB.setAccount(crAccountFreight);
        
        drCrTransFreightA.setTransRef(transRef);
        drCrTransFreightB.setTransRef(transRef);
        
        drCrTransFreightA.setSmeEntity(entity);
        drCrTransFreightB.setSmeEntity(entity);
        drCrTransA.setSmeEntity(entity);
        drCrTransB.setSmeEntity(entity);
        drCrTransTax.setSmeEntity(entity);

        if (!transExists) {
            atDao.saveAccountTransactions(drCrTransA);
            atDao.saveAccountTransactions(drCrTransB);
            atDao.saveAccountTransactions(drCrTransTax);

            atDao.saveAccountTransactions(drCrTransFreightA);
            atDao.saveAccountTransactions(drCrTransFreightB);

        }

        purchase.setSmeEntity(entity);
        purchase.setStore(store);
        purchase.setStock(stock);
        purchase.setSupplier(supplier);
        purchase.setPaymentMode(paymentMode);
        purchaseService.savePurchase(purchase);
        slService.updateStockLedger(entity, purchase);
        return "{\"success\":true, \"msg\":\"You have successfully saved a purchase!\"}";
    }

    @RequestMapping(value = {"/purchases/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getPurchasesList(HttpSession session) {
        //SMEEntity sme = 

        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String purchasesList = purchaseService.getPurchasesList(entity);
        return purchasesList;
    }

    @RequestMapping(value = {"/purchase/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getPurchaseForm(@RequestParam(value = "id") Long id) {
        String purchasesList = purchaseService.getPurchaseForForm(id);
        return purchasesList;
    }

}
