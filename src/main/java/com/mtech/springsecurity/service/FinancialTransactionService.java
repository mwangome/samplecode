/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.FinancialTransactionsDao;
import com.mtech.springsecurity.enumerate.FinancialTransactions;
import com.mtech.springsecurity.model.BankTransaction;
import com.mtech.springsecurity.model.FinancialTransaction;
import com.mtech.springsecurity.model.MobileTransaction;
import com.mtech.springsecurity.util.AppUtil;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author mwangome
 */
@Service
public class FinancialTransactionService {

    @Autowired
    FinancialTransactionsDao ftDao;

    @Autowired
    AppUtil appUtil;

    public String saveBankTransaction(BankTransaction bt) {
        ftDao.saveBankTransaction(bt);
        return appUtil.streamResponse("Bank Transaction").toString();
    }

    public String saveMobileTransaction(MobileTransaction bt) {
        ftDao.saveMobileTransaction(bt);
        return appUtil.streamResponse("Mobile Transaction").toString();
    }

    public String getFinancialTransactions() {
        List<FinancialTransaction> financialTransaction = ftDao.getFinancialTransaction();

        JSONArray array = new JSONArray();
        JSONObject object = null;
        BankTransaction bt = null;
        MobileTransaction mt = null;
        for (FinancialTransaction ft : financialTransaction) {
            object = new JSONObject();
            if (ft instanceof BankTransaction) {
                bt = (BankTransaction) ft;
                object.put("id", ft.getId());
                object.put("referenceNumber", bt.getReferenceNumber());
                object.put("personWithdrawing", bt.getPersonWithdrawing());
                object.put("description", bt.getTransactionType());
                object.put("transactionDate", appUtil.formatJSDate(bt.getTransactionDate()));
                object.put("amount", bt.getAmount());
                object.put("supplierName", bt.getSupplier() == null?"":bt.getSupplier().getSupplierName());
                object.put("customerName",bt.getDebtor() == null?"":bt.getDebtor().getCustomerName());
            }
            if (ft instanceof MobileTransaction) {
                mt = (MobileTransaction) ft;
                object.put("id", ft.getId());
                object.put("referenceNumber", mt.getReferenceNumber());
                object.put("personWithdrawing", mt.getPersonWithdrawing());
                object.put("description", mt.getTransactionType());
                object.put("transactionDate", appUtil.formatJSDate(mt.getTransactionDate()));
                object.put("supplierName",mt.getSupplier() == null?"":mt.getSupplier().getSupplierName());
                object.put("customerName",mt.getDebtor() == null?"":mt.getDebtor().getCustomerName());
                object.put("amount", mt.getAmount());
            }

            array.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", array);
        wrapper.put("totalProperty", financialTransaction.size());
        return wrapper.toString();
    }

    public String getTransactionTypes(String filter) {
        Object[] financialTransaction = FinancialTransactions.getTransactions(filter);

        JSONArray array = new JSONArray();
        JSONObject object = null;
        for (Object ft : financialTransaction) {
            object = new JSONObject();
            object.put("description", ((FinancialTransactions) ft).getDescription());
            array.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", array);
        wrapper.put("totalProperty", financialTransaction.length);
        return wrapper.toString();
    }

    public String findBankTransaction(Long id) {
        FinancialTransaction ft = ftDao.findTransaction(id);
        JSONObject object = new JSONObject();

        BankTransaction bt = null;
        MobileTransaction mt = null;
        if (ft instanceof BankTransaction) {
            bt = (BankTransaction) ft;
            object.put("id", bt.getId());
            object.put("description", bt.getTransactionType());
            object.put("transactionDate", appUtil.formatJSDate(bt.getTransactionDate()));
            object.put("bankBranch", bt.getBankBranch());
            object.put("chequeNumber", bt.getChequeNumber());
            object.put("drawer", bt.getDrawer());
            object.put("referenceNumber", bt.getReferenceNumber());
            object.put("amount", bt.getAmount());
            object.put("supplierName", bt.getSupplier() == null?"":bt.getSupplier().getSupplierName());
            object.put("personWithdrawing", bt.getPersonWithdrawing());
            object.put("supplierName",bt.getSupplier() == null?"":bt.getSupplier().getSupplierName());
            object.put("customerName",bt.getDebtor() == null?"":bt.getDebtor().getCustomerName());
        }if (ft instanceof MobileTransaction) {
            mt = (MobileTransaction) ft;
            object.put("id", mt.getId());
            object.put("description", mt.getTransactionType());
            object.put("transactionDate", appUtil.formatJSDate(mt.getTransactionDate()));
            object.put("bankBranch", "");
            object.put("phoneNumber", mt.getPhoneNumber());
            object.put("mobileOperator", mt.getMobileOperator());
            object.put("referenceNumber", mt.getReferenceNumber());
            object.put("amount", mt.getAmount());
            object.put("personWithdrawing", mt.getPersonWithdrawing());
            object.put("supplierName",mt.getSupplier() == null?"":mt.getSupplier().getSupplierName());
            object.put("customerName",mt.getDebtor() == null?"":mt.getDebtor().getCustomerName());
        }

        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", object);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
}
