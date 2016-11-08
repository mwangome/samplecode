/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccountTransactionsDao;
import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.dao.PaymentDao;
import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.dao.SaleDao;
import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.Receipt;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Sale;
import com.mtech.springsecurity.service.ReceiptService;
import com.mtech.springsecurity.util.AppUtil;
import java.util.List;
import javax.servlet.http.HttpSession;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author derek
 */
@Controller
public class ReceiptController {

    Logger logger = Logger.getLogger(ReceiptController.class);
    @Autowired
    SMEEntityDao smeEntityDao;

    @Autowired
    AppUtil appUtil;

    @Autowired
    ReceiptService receiptService;

    @Autowired
    PaymentDao paymentDao;

    @Autowired
    SaleDao salesDao;

    @Autowired
    AccountTransactionsDao atDao;

    @Autowired
    AccountsDao accDao;

    @RequestMapping(value = "/receipt/save.action")
    @ResponseBody
    public String saveReceipt(@ModelAttribute Receipt receipt,
            @RequestParam(value = "registeredName") String registeredName,
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "salesRefNumber") String salesRefNumber,
            HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        Sale sale = salesDao.findSale(salesRefNumber);

        /**
         * handle account transactions
         */
        String transRef = receipt.getReceiptRef();

        /**
         * can return 2 items cr / dr
         */
        List<AccountTransactions> drCrTransItems = atDao.findAccountTransactions(entity, transRef);
        AccountTransactions drCrTransA = null;
        AccountTransactions drCrTransB = null;

        /**
         * Buying on Credit
         */
        Accounts drAccount = accDao.findAccount(MappedAccountsEnum.Bank.name());
        
        /**
         * Buying cash
         */
        Accounts crAccountCash = accDao.findAccount(MappedAccountsEnum.Debtors.name());
        boolean transExists = false;
        if (drCrTransItems.isEmpty()) {
            drCrTransA = new AccountTransactions();
            drCrTransA.setTransRef(transRef);

            drCrTransB = new AccountTransactions();
            drCrTransB.setTransRef(transRef);

        } else {
            transExists = true;
        }

        drCrTransA.setAccount(drAccount);
        drCrTransB.setAccount(crAccountCash);

        drCrTransA.setDebit(receipt.getReceiptAmt());
        drCrTransB.setCredit(receipt.getReceiptAmt());

        drCrTransA.setTransDate(new java.util.Date());
        drCrTransB.setTransDate(new java.util.Date());

        logger.warn("transaction exists?::" + transExists);
        if (!transExists) {
            drCrTransA.setSmeEntity(entity);
            drCrTransB.setSmeEntity(entity);
            atDao.saveAccountTransactions(drCrTransA);
            atDao.saveAccountTransactions(drCrTransB);
            logger.warn("save attempted::");
        }else{
            logger.warn("save NOT attempted::");
        }

        receipt.setSmeEntity(entity);
        receipt.setSale(sale);
        receiptService.saveReceipt(receipt);

        return appUtil.streamResponse("receipt").toString();
    }

    @RequestMapping(value = "/receipts/gridview.action")
    @ResponseBody
    public String getReceiptList(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String receiptList = receiptService.getReceiptList(entity);
        return receiptList;
    }

    @RequestMapping(value = "/receipt/formview.action")
    @ResponseBody
    public String loadReceipt(@RequestParam(value = "id") Long id) {
        String receiptList = receiptService.findReceipt(id);
        return receiptList;
    }
}
