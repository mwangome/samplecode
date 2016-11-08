/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AccountTransactionsDao;
import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.enumerate.DrCrEnum;
import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import com.mtech.springsecurity.util.NumberValue;
import java.math.BigDecimal;
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
public class AccountTransactionsService {

    @Autowired
    AccountTransactionsDao atDao;

    @Autowired
    AccountsDao accDao;

    @Autowired
    AppUtil appUtil;

    @Autowired
    NumberValue nv;

    public String getAccountTransactions(SMEEntity entity) {
        List<AccountTransactions> accountTransactionsList = atDao.getAccountTransactionsList(entity);

        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (AccountTransactions at : accountTransactionsList) {
            object = new JSONObject();
            object.put("id", at.getId());
            object.put("transRef", at.getTransRef());
            object.put("transDate", appUtil.formatJSDate(at.getTransDate()));
            object.put("accountName", at.getAccount() == null ? "" : at.getAccount().getAccountName());
            object.put("debit", at.getDebit() == null ? "" : at.getDebit());
            object.put("credit", at.getCredit() == null ? "" : at.getCredit());
            jarray.add(object);
        }

        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", accountTransactionsList.size());
        return wrapper.toString();
    }

    public String getAccountTransactionsAggregate(SMEEntity entity) {
        List<AccountTransactions> accountTransactionsList = atDao.getAccountTransactionsList(entity);

        JSONArray jarray = new JSONArray();
        JSONObject object = null;

        javax.swing.table.DefaultTableModel model = new javax.swing.table.DefaultTableModel(
                new Object[][]{},
                new String[]{
                    "Account", "Dr", "Cr"
                }
        );
        for (AccountTransactions at : accountTransactionsList) {
            object = new JSONObject();
            object.put("id", at.getId());
            object.put("transDate", appUtil.formatJSDate(at.getTransDate()));
            object.put("accountName", at.getAccount() == null ? "" : at.getAccount().getAccountName());
            object.put("debit", at.getDebit());
            object.put("credit", at.getCredit());
            model = process(model, new Object[]{at.getAccount().getAccountName(), at.getDebit(), at.getCredit()});
            jarray.add(object);
        }

        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", accountTransactionsList.size());
        return viewTable(model);
    }

    public java.math.BigDecimal getAggregateForAccount(SMEEntity entity, String account) {
        List<AccountTransactions> accountTransactionsList = atDao.getAccountTransactionsList(entity);

        JSONArray jarray = new JSONArray();
        JSONObject object = null;

        javax.swing.table.DefaultTableModel model = new javax.swing.table.DefaultTableModel(
                new Object[][]{},
                new String[]{
                    "Account", "Dr", "Cr"
                }
        );
        for (AccountTransactions at : accountTransactionsList) {
            object = new JSONObject();
            object.put("id", at.getId());
            object.put("transDate", appUtil.formatJSDate(at.getTransDate()));
            object.put("accountName", at.getAccount().getAccountName());
            object.put("debit", at.getDebit() == null ? "-" : appUtil.formatNumber(nv.getNumber(at.getDebit())));
            object.put("credit", at.getCredit() == null ? "-" : appUtil.formatNumber(nv.getNumber(at.getCredit())));
            model = process(model, new Object[]{at.getAccount().getAccountName(), at.getDebit(), at.getCredit()});
            jarray.add(object);
        }

        for (int i = 0; i < model.getRowCount(); i++) {
            String accountName = model.getValueAt(i, 0).toString();
            if (account.equalsIgnoreCase(accountName)) {
                java.math.BigDecimal num1 = nv.getNumber(model.getValueAt(i, 1)).compareTo(nv.getNumber(model.getValueAt(i, 2))) < 0 ? java.math.BigDecimal.ZERO : (nv.getNumber(model.getValueAt(i, 1)).subtract(nv.getNumber(model.getValueAt(i, 2))));
                java.math.BigDecimal num2 = nv.getNumber(model.getValueAt(i, 2)).compareTo(nv.getNumber(model.getValueAt(i, 1))) < 0 ? java.math.BigDecimal.ZERO : (nv.getNumber(model.getValueAt(i, 2)).subtract(nv.getNumber(model.getValueAt(i, 1))));
                return num1.compareTo(num2) < 0 ? num2 : num1;
            }

        }

        return java.math.BigDecimal.ZERO;
    }

    public java.math.BigDecimal getAggregateForAccountDrCr(SMEEntity entity, String account, String drCrBalance) {
        List<AccountTransactions> accountTransactionsList = atDao.getAccountTransactionsList(entity);
        BigDecimal drBalance = BigDecimal.ZERO;
        BigDecimal crBalance = BigDecimal.ZERO;
        for (AccountTransactions at : accountTransactionsList) {
            if (account.equalsIgnoreCase(at.getAccount().getAccountName())) {
                drBalance = drBalance.add(nv.getNumber(at.getDebit()));
                crBalance = crBalance.add(nv.getNumber(at.getCredit()));
            }

        }
        if (drCrBalance.equalsIgnoreCase(DrCrEnum.Cr.name())) {
            return nv.getNumber(crBalance).subtract(nv.getNumber(drBalance));
        }
        if (drCrBalance.equalsIgnoreCase(DrCrEnum.Dr.name())) {
            return nv.getNumber(drBalance).subtract(nv.getNumber(crBalance));
        }
        return BigDecimal.ZERO;
    }

    /**
     * Only add for a given column Dr or Cr only
     *
     * @param entity
     * @param account
     * @param drCrBalance
     * @return
     */
    public java.math.BigDecimal getAggregateForAccount(SMEEntity entity, String account, String drCrBalance) {
        List<AccountTransactions> accountTransactionsList = atDao.getAccountTransactionsList(entity);
        BigDecimal drBalance = BigDecimal.ZERO;
        BigDecimal crBalance = BigDecimal.ZERO;
        for (AccountTransactions at : accountTransactionsList) {
            if (account.equalsIgnoreCase(at.getAccount().getAccountName())) {
                drBalance = drBalance.add(nv.getNumber(at.getDebit()));
                crBalance = crBalance.add(nv.getNumber(at.getCredit()));
            }

        }
        if (drCrBalance.equalsIgnoreCase(DrCrEnum.Cr.name())) {
            return nv.getNumber(crBalance);
        }
        if (drCrBalance.equalsIgnoreCase(DrCrEnum.Dr.name())) {
            return nv.getNumber(drBalance);
        }
        return BigDecimal.ZERO;
    }

    public java.math.BigDecimal getAccountTransactionsAggregate(SMEEntity entity, String AccountName) {
        List<AccountTransactions> accountTransactionsList = atDao.getAccountTransactionsList(entity);
        java.math.BigDecimal aggregateAmount = java.math.BigDecimal.ZERO;
        for (AccountTransactions at : accountTransactionsList) {
            if (AccountName.equalsIgnoreCase(at.getAccount().getAccountName())) {
                if (at.getAccount().getAccountName().equalsIgnoreCase(MappedAccountsEnum.Tax.getDescription())) {
                    aggregateAmount = aggregateAmount.add(nv.getNumber(at.getDebit()));
                } else {
                    aggregateAmount = aggregateAmount.add(nv.getNumber(at.getDebit())).add(nv.getNumber(at.getCredit()));
                }
            }
        }

        return aggregateAmount;
    }

    /**
     *
     * @param model
     * @param row
     * @return
     */
    javax.swing.table.DefaultTableModel process(javax.swing.table.DefaultTableModel model, Object[] row) {
        boolean entryFound = false;
        int rows = model.getRowCount();

        String sString = row[0].toString();
        for (int i = 0; i < rows; i++) {
            String account = model.getValueAt(i, 0).toString();
            if (account.equalsIgnoreCase(sString)) {
                Object dr = model.getValueAt(i, 1);
                Object cr = model.getValueAt(i, 2);

                BigDecimal drTot = nv.getNumber(dr).add(nv.getNumber(row[1]));
                BigDecimal crTot = nv.getNumber(cr).add(nv.getNumber(row[2]));
                model.setValueAt(drTot, i, 1);
                model.setValueAt(crTot, i, 2);
                entryFound = true;
            }
        }
        if (!entryFound) {
            model.addRow(row);
        }
        return model;
    }

    String viewTable(javax.swing.table.DefaultTableModel model) {
        BigDecimal drTotal = BigDecimal.ZERO;
        BigDecimal crTotal = BigDecimal.ZERO;

        JSONArray array = new JSONArray();

        /**
         * Add
         */
        for (int i = 0; i < model.getRowCount(); i++) {
            JSONObject object = new JSONObject();
            object.put("id", (i + 1));
            object.put("accountName", model.getValueAt(i, 0) == null ? "-" : model.getValueAt(i, 0));
            object.put("debit", nv.getNumber(model.getValueAt(i, 1)).compareTo(nv.getNumber(model.getValueAt(i, 2))) < 0 ? "-" : appUtil.formatNumber(nv.getNumber(model.getValueAt(i, 1)).subtract(nv.getNumber(model.getValueAt(i, 2)))));
            object.put("credit", nv.getNumber(model.getValueAt(i, 2)).compareTo(nv.getNumber(model.getValueAt(i, 1))) < 0 ? "-" : appUtil.formatNumber(nv.getNumber(model.getValueAt(i, 2)).subtract(nv.getNumber(model.getValueAt(i, 1)))));

            drTotal = drTotal.add(nv.getNumber(nv.getNumber(model.getValueAt(i, 1)).compareTo(nv.getNumber(model.getValueAt(i, 2))) < 0 ? "-" : String.valueOf(nv.getNumber(model.getValueAt(i, 1)).subtract(nv.getNumber(model.getValueAt(i, 2))))));
            crTotal = crTotal.add(nv.getNumber(nv.getNumber(model.getValueAt(i, 2)).compareTo(nv.getNumber(model.getValueAt(i, 1))) < 0 ? "-" : String.valueOf(nv.getNumber(model.getValueAt(i, 2)).subtract(nv.getNumber(model.getValueAt(i, 1))))));
            array.add(object);
        }

        JSONObject tobject = new JSONObject();
        tobject.put("debit", "<b><u>" + appUtil.formatNumber(drTotal) + "</u></b>");
        tobject.put("credit", "<b><u>" + appUtil.formatNumber(crTotal) + "</u></b>");
        array.add(tobject);

        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", array);
        wrapper.put("totalProperty", model.getRowCount());

        return wrapper.toString();
    }

    public BigDecimal computePrepayments(SMEEntity entity) {
        List<Accounts> prepaidExpenseChildAccounts = accDao.getPrepaidExpenseChildAccounts();
        List<AccountTransactions> accountTransactionsList = atDao.getAccountTransactionsList(entity);
        BigDecimal prepayments = BigDecimal.ZERO;
        for(AccountTransactions at:accountTransactionsList){
            Accounts account = at.getAccount();
            for(Accounts preAcct: prepaidExpenseChildAccounts){
                if(preAcct.getId().compareTo(account.getId()) == 0){
                    prepayments = prepayments.add(nv.getNumber(at.getDebit()));
                }
            }
        }
        return prepayments;
    }
    
    public BigDecimal computeAccruals(SMEEntity entity) {
        List<Accounts> prepaidExpenseChildAccounts = accDao.getAccrualExpenseChildAccounts();
        List<AccountTransactions> accountTransactionsList = atDao.getAccountTransactionsList(entity);
        BigDecimal accruals = BigDecimal.ZERO;
        for(AccountTransactions at:accountTransactionsList){
            Accounts account = at.getAccount();
            for(Accounts preAcct: prepaidExpenseChildAccounts){
                if(preAcct.getId().compareTo(account.getId()) == 0){
                    accruals = accruals.add(nv.getNumber(at.getDebit()));
                }
            }
        }
        return accruals;
    }
    
    public BigDecimal computeGainLossDisposal(SMEEntity entity){
        
        BigDecimal gain = getAggregateForAccount(entity, MappedAccountsEnum.Gain.getDescription(), DrCrEnum.Cr.name());
        BigDecimal loss = getAggregateForAccount(entity, MappedAccountsEnum.Loss.getDescription(), DrCrEnum.Dr.name());
        
        return nv.getNumber(gain).subtract(loss);
    }

}
