/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccountTransactionsDao;
import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.dao.CustomerDao;
import com.mtech.springsecurity.dao.SupplierDao;
import com.mtech.springsecurity.enumerate.FinancialTransactions;
import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.enumerate.PaymentModes;
import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.BankTransaction;
import com.mtech.springsecurity.model.Customer;
import com.mtech.springsecurity.model.MobileTransaction;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Supplier;
import com.mtech.springsecurity.service.FinancialTransactionService;
import com.mtech.springsecurity.service.StatementOfFinancialPositionService;
import java.util.List;
import javax.servlet.http.HttpSession;
import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author mwangome
 */
@Controller
public class FinancialTransactionController {

    Logger logger = Logger.getLogger(FinancialTransactionController.class);

    @Autowired
    FinancialTransactionService ftService;

    @Autowired
    SupplierDao supplierDao;

    @Autowired
    CustomerDao customerDao;

    @Autowired
    AccountTransactionsDao transDao;

    @Autowired
    AccountsDao accDao;

    @Autowired
    StatementOfFinancialPositionService sofpDao;

    @RequestMapping(value = {"/banktransaction/save.action"})
    @ResponseBody
    public String saveBankTransaction(@ModelAttribute BankTransaction bt,
            @RequestParam(value = "customerName") String customerName,
            @RequestParam(value = "supplierName") String supplierName,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }

        String transactionType = bt.getTransactionType();

        /**
         * handle accounts transactions
         */
        String transRef = bt.getReferenceNumber();

        /**
         * can return 2 items cr / dr
         */
        List<AccountTransactions> drCrTransItems = transDao.findAccountTransactions(entity, transRef);
        AccountTransactions drCrTransA = null;
        AccountTransactions drCrTransB = null;

        /**
         * Mobile Money deposit
         */
        Accounts drAccount = accDao.findAccount(PaymentModes.Bank.getDescription());
        Accounts crAccountCash = accDao.findAccount(MappedAccountsEnum.Debtors.name());

        /**
         * Mobile Money deposit
         */
        Accounts drAccountWd = accDao.findAccount(MappedAccountsEnum.Creditors.name());
        Accounts crAccountCashWd = accDao.findAccount(PaymentModes.Bank.getDescription());

        boolean transExists = false;
        if (drCrTransItems.isEmpty()) {
            drCrTransA = new AccountTransactions();
            drCrTransA.setTransRef(transRef);

            drCrTransB = new AccountTransactions();
            drCrTransB.setTransRef(transRef);

        } else {
            transExists = true;
        }
        /**
         * Debtor Transactions
         */
        if (FinancialTransactions.BANK_DEPOSIT.getDescription().equalsIgnoreCase(transactionType)
                || FinancialTransactions.MOBILE_DEPOSIT.getDescription().equalsIgnoreCase(transactionType)) {
            Customer customer = customerDao.findCustomer(customerName);
            bt.setDebtor(customer);
            logger.warn(":::customer:::" + customer.getCustomerName());

            /**
             * handling accounts
             */
            drCrTransA.setAccount(drAccount);
            drCrTransB.setAccount(crAccountCash);

            drCrTransA.setDebit(bt.getAmount());
            drCrTransB.setCredit(bt.getAmount());

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
        } else {
            /**
             * Creditor Transactions
             */
            Supplier supplier = supplierDao.findSupplier(supplierName);
            bt.setSupplier(supplier);
            logger.warn(":::supplier:::" + supplier.getSupplierName());

            /**
             * handling accounts
             */
            drCrTransA.setAccount(drAccountWd);
            drCrTransB.setAccount(crAccountCashWd);

            drCrTransA.setDebit(bt.getAmount());
            drCrTransB.setCredit(bt.getAmount());

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
        }

        drCrTransA.setSmeEntity(entity);
        drCrTransB.setSmeEntity(entity);
        if (!transExists) {
            transDao.saveAccountTransactions(drCrTransA);
            transDao.saveAccountTransactions(drCrTransB);
        }

        String saveBankTransaction = ftService.saveBankTransaction(bt);
        return saveBankTransaction;
    }

    
    @RequestMapping(value = {"/cashtransaction/save.action"})
    @ResponseBody
    public String saveCashTransaction(@ModelAttribute BankTransaction bt,
            @RequestParam(value = "customerName") String customerName,
            @RequestParam(value = "supplierName") String supplierName,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }

        String transactionType = bt.getTransactionType();

        /**
         * handle accounts transactions
         */
        String transRef = bt.getReferenceNumber();

        /**
         * can return 2 items cr / dr
         */
        List<AccountTransactions> drCrTransItems = transDao.findAccountTransactions(entity, transRef);
        AccountTransactions drCrTransA = null;
        AccountTransactions drCrTransB = null;

        /**
         * Mobile Money deposit
         */
        Accounts drAccount = accDao.findAccount(PaymentModes.CASH.getDescription());
        Accounts crAccountCash = accDao.findAccount(MappedAccountsEnum.Debtors.name());

        /**
         * Mobile Money deposit
         */
        Accounts drAccountWd = accDao.findAccount(MappedAccountsEnum.Creditors.name());
        Accounts crAccountCashWd = accDao.findAccount(PaymentModes.Bank.getDescription());

        boolean transExists = false;
        if (drCrTransItems.isEmpty()) {
            drCrTransA = new AccountTransactions();
            drCrTransA.setTransRef(transRef);

            drCrTransB = new AccountTransactions();
            drCrTransB.setTransRef(transRef);

        } else {
            transExists = true;
        }
        /**
         * Debtor Transactions
         */
        if (FinancialTransactions.CASH_DEPOSIT.getDescription().equalsIgnoreCase(transactionType)
                || FinancialTransactions.MOBILE_DEPOSIT.getDescription().equalsIgnoreCase(transactionType)) {
            Customer customer = customerDao.findCustomer(customerName);
            bt.setDebtor(customer);
            logger.warn(":::customer:::" + customer.getCustomerName());

            /**
             * handling accounts
             */
            drCrTransA.setAccount(drAccount);
            drCrTransB.setAccount(crAccountCash);

            drCrTransA.setDebit(bt.getAmount());
            drCrTransB.setCredit(bt.getAmount());

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
        } else {
            /**
             * Creditor Transactions
             */
            Supplier supplier = supplierDao.findSupplier(supplierName);
            bt.setSupplier(supplier);
            logger.warn(":::supplier:::" + supplier.getSupplierName());

            /**
             * handling accounts
             */
            drCrTransA.setAccount(drAccountWd);
            drCrTransB.setAccount(crAccountCashWd);

            drCrTransA.setDebit(bt.getAmount());
            drCrTransB.setCredit(bt.getAmount());

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
        }

        drCrTransA.setSmeEntity(entity);
        drCrTransB.setSmeEntity(entity);
        if (!transExists) {
            transDao.saveAccountTransactions(drCrTransA);
            transDao.saveAccountTransactions(drCrTransB);
        }

        String saveBankTransaction = ftService.saveBankTransaction(bt);
        return saveBankTransaction;
    }
    
    @RequestMapping(value = {"/mobiletransaction/save.action"})
    @ResponseBody
    public String saveMobileTransaction(@ModelAttribute MobileTransaction mt,
            @RequestParam(value = "customerName") String customerName,
            @RequestParam(value = "supplierName") String supplierName,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }

        String transactionType = mt.getTransactionType();

        /**
         * handle accounts transactions
         */
        String transRef = mt.getReferenceNumber();

        /**
         * can return 2 items cr / dr
         */
        List<AccountTransactions> drCrTransItems = transDao.findAccountTransactions(entity, transRef);
        AccountTransactions drCrTransA = null;
        AccountTransactions drCrTransB = null;

        /**
         * Mobile Money deposit
         */
        Accounts drAccount = accDao.findAccount(PaymentModes.MOBILE.getDescription());
        Accounts crAccountCash = accDao.findAccount(MappedAccountsEnum.Debtors.name());

        /**
         * Mobile Money deposit
         */
        Accounts drAccountWd = accDao.findAccount(MappedAccountsEnum.Creditors.name());
        Accounts crAccountCashWd = accDao.findAccount(PaymentModes.MOBILE.getDescription());

        boolean transExists = false;
        if (drCrTransItems.isEmpty()) {
            drCrTransA = new AccountTransactions();
            drCrTransA.setTransRef(transRef);

            drCrTransB = new AccountTransactions();
            drCrTransB.setTransRef(transRef);

        } else {
            transExists = true;
        }
        /**
         * Debtor Transactions
         */
        if (FinancialTransactions.BANK_DEPOSIT.getDescription().equalsIgnoreCase(transactionType)
                || FinancialTransactions.MOBILE_DEPOSIT.getDescription().equalsIgnoreCase(transactionType)) {
            Customer customer = customerDao.findCustomer(customerName);
            logger.warn(":::customer:::" + customer.getCustomerName());
            mt.setDebtor(customer);

            /**
             * handling accounts
             */
            drCrTransA.setAccount(drAccount);
            drCrTransB.setAccount(crAccountCash);

            drCrTransA.setDebit(mt.getAmount());
            drCrTransB.setCredit(mt.getAmount());

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
        } else {
            /**
             * Creditor Transactions
             */
            Supplier supplier = supplierDao.findSupplier(supplierName);
            logger.warn(":::supplier:::" + supplier.getSupplierName());
            mt.setSupplier(supplier);

            /**
             * handling accounts
             */
            drCrTransA.setAccount(drAccountWd);
            drCrTransB.setAccount(crAccountCashWd);

            drCrTransA.setDebit(mt.getAmount());
            drCrTransB.setCredit(mt.getAmount());

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
        }

        drCrTransA.setSmeEntity(entity);
        drCrTransB.setSmeEntity(entity);
        if (!transExists) {
            transDao.saveAccountTransactions(drCrTransA);
            transDao.saveAccountTransactions(drCrTransB);
        }

        String saveMobileTransaction = ftService.saveMobileTransaction(mt);
        return saveMobileTransaction;
    }

    @RequestMapping(value = {"/financialtransactions/gridview.action"})
    @ResponseBody
    public String getTransactions(@ModelAttribute MobileTransaction bt) {
        String saveMobileTransaction = ftService.getFinancialTransactions();
        return saveMobileTransaction;
    }

    @RequestMapping(value = {"/financialtransaction/type.action"})
    @ResponseBody
    public String getTransactionsTypes(@RequestParam(value = "filter") String filter) {
        String type = ftService.getTransactionTypes(filter);
        return type;
    }

    @RequestMapping(value = {"/financialtransaction/formview.action"})
    @ResponseBody
    public String findBankTransaction(@RequestParam(value = "id") Long id) {
        String type = ftService.findBankTransaction(id);
        return type;
    }

    @RequestMapping(value = {"/sofp/gridview.action"})
    @ResponseBody
    public String getBalanceSheet(
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String type = sofpDao.prepareStatementOfFinancialPosition(entity);
        return type;
    }
}
