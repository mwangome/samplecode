/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccountTransactionsDao;
import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.dao.PaymentModeDao;
import com.mtech.springsecurity.dao.PurchaseDao;
import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.enumerate.PaymentModes;
import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.Payment;
import com.mtech.springsecurity.model.PaymentMode;
import com.mtech.springsecurity.model.Purchase;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.PaymentService;
import com.mtech.springsecurity.util.AppUtil;
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
public class PaymentController {
    
    Logger logger = Logger.getLogger(PaymentController.class);
    
    @Autowired
    PaymentService payService;
    
    @Autowired
    AppUtil appUtil;
    
    @Autowired
    SMEEntityDao smeDao;
    
    @Autowired
    PurchaseDao purDao;
    
    @Autowired
    PaymentModeDao pmDao;
    
    @Autowired
    AccountTransactionsDao transDao;
    
    @Autowired
    AccountsDao accDao;
    
    @RequestMapping(value = {"/payment/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String savePayment(@ModelAttribute Payment payment,
            @RequestParam(value = "item", required  = false) String item,
            @RequestParam(value = "accruals", required  = false) String accruals,
            @RequestParam(value = "transactionDescription", required  = false) String transactionDescription,
            @RequestParam(value = "prepayments", required  = false) String prepayments,
            @RequestParam(value = "invoiceNumber") String invoiceNumber,
            @RequestParam(value = "accountName") String accountName,
            @RequestParam(value = "payModeName") String modeOfPayment,HttpSession session){
        
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        
//        if(true){
//            return "{\"success\":true, \"msg\":\"Is (" +accountName+ ")" +transactionDescription+ "!\"}";
//        }
        
        Purchase purchase = purDao.findPurchase(invoiceNumber);
        PaymentMode findPaymentMode = pmDao.findPaymentMode(modeOfPayment);
        
        /**
         * handle accounts transactions
         */
        String transRef = payment.getPaymentRef();
        if(transRef == null){
            return "{\"success\":false, \"msg\":\"Sorry, transaction stopped! Supply transaction reference then try again.\"}";
        }
        
        /**
         * can return 2 items cr / dr
         */
        List<AccountTransactions> drCrTransItems = transDao.findAccountTransactions(entity, transRef);
        AccountTransactions drCrTransA = null;
        AccountTransactions drCrTransB = null;
        
         if (drCrTransItems.size() == 2) {
            AccountTransactions trans1 = drCrTransItems.get(0);
            AccountTransactions trans2 = drCrTransItems.get(1);
            if(trans1.getDebit() != null){
                drCrTransA = trans1;
                drCrTransB = trans2;
            }else{
                drCrTransA = trans2;
                drCrTransB = trans1;
            }            
        }
       
        Accounts drAccount = null;
        Accounts crAccount = accDao.findAccount(modeOfPayment);
        
        
        
         /**
         * Buying on cash
         */
        Accounts crAccountCash = accDao.findAccount(modeOfPayment);
        boolean transExists = false;
        if(drCrTransItems.isEmpty()||transactionDescription.equalsIgnoreCase("ACCRUALS")||
                transactionDescription.equalsIgnoreCase("PREPAYMENTS")){
            drCrTransA = new AccountTransactions();
            drCrTransA.setTransRef(transRef);
            
            drCrTransB = new AccountTransactions();
            drCrTransB.setTransRef(transRef);
            
        }else{
            transExists = true;
        }
        
        if(transactionDescription.equalsIgnoreCase("ACCRUALS")){
            drAccount = accDao.findAccount(accruals);
            item = "";
            payment.setId(null);
        }if(transactionDescription.equalsIgnoreCase("PREPAYMENTS")){
            drAccount = accDao.findAccount(accountName);
            item = "Expense (Paid)";
            payment.setId(null);
        }
        if(item.equalsIgnoreCase("Item")){
            drAccount = accDao.findAccount(MappedAccountsEnum.Creditors.name());
        }else if(item.equalsIgnoreCase("Expense (Paid)")){
            drAccount = accDao.findAccount(accountName);
            payment.setAccounts(drAccount);
        }else if(item.equalsIgnoreCase("Expense (Accrued)")){
            drAccount = accDao.findAccount(accruals);
            crAccount = accDao.findAccrualExpenseAccount();
            payment.setAccounts(drAccount);
            drCrTransB.setAccount(crAccount);
            logger.warn("setting account::" + crAccount.getAccountName());
        }else if(item.equalsIgnoreCase("Expense (Prepaid)")){
            drAccount = accDao.findAccount(prepayments);
            crAccount = accDao.findPrepaidExpenseAccount();
            payment.setAccounts(drAccount);
            drCrTransB.setAccount(crAccount);
            logger.warn("setting account::" + crAccount.getAccountName());
        }
        
        if(PaymentModes.CREDIT.getDescription().equals(modeOfPayment)&&!transactionDescription.equalsIgnoreCase("ACCRUALS")){
            drCrTransA.setDebit(payment.getPaymentAmt());
            drCrTransB.setCredit(payment.getPaymentAmt());
            
            drCrTransB.setAccount(crAccount);
            drCrTransA.setAccount(drAccount);
            
            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
            
        }else{
            drCrTransA.setAccount(drAccount);
            if(crAccountCash!=null|| transactionDescription.equalsIgnoreCase("ACCRUALS"))
                drCrTransB.setAccount(crAccountCash);
            
            drCrTransA.setDebit(payment.getPaymentAmt());
            drCrTransB.setCredit(payment.getPaymentAmt());
            
            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
        }
        drCrTransA.setSmeEntity(entity);
        drCrTransB.setSmeEntity(entity);
        logger.warn("checking account::" + drCrTransB.getAccount().getAccountName());
        if(!transExists || transactionDescription.equalsIgnoreCase("ACCRUALS")|| 
                transactionDescription.equalsIgnoreCase("PREPAYMENTS")){
            transDao.saveAccountTransactions(drCrTransA);
            transDao.saveAccountTransactions(drCrTransB);
        }
        
        payment.setPaymentDescription(item);
        payment.setSmeEntity(entity);
        payment.setPurchase(purchase);
        payment.setPaymentMode(findPaymentMode);
        payService.savePayment(payment);
        return appUtil.streamResponse("payment").toString();
    }
    
    @RequestMapping(value = {"/payments/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getPaymentsList(HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String listOfPayments = payService.getListOfPayments(entity);
        return listOfPayments;
    }
    
      
    @RequestMapping(value = {"/payment/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findPayment(@RequestParam(value = "id") Long id){
        String listOfPayments = payService.findPurchase(id);
        return listOfPayments;
    }
    
    @RequestMapping(value = {"/paymentsaccruals/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getPaymentsListAccruals(HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String listOfPayments = payService.getListOfAccruals(entity);
        return listOfPayments;
    }
    
    @RequestMapping(value = {"/paymentsprepayments/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getPaymentsListPrepayments(HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String listOfPayments = payService.getListOfPrepayments(entity);
        return listOfPayments;
    }
}
