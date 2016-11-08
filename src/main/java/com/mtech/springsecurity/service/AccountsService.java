/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.enumerate.AccountsEnum;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.NorminalAccounts;
import com.mtech.springsecurity.model.RealAccounts;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class AccountsService {

    Logger logger = Logger.getLogger(AccountsService.class);

    @Autowired
    AccountsDao acDao;

    public void bootstrapAccounts() {
        acDao.bootstrapAccounts();
    }

    public String getChartOfAccounts() {
        java.util.List<RealAccounts> list = acDao.getChartOfAccounts();

        JSONArray accArray = new JSONArray();
        for (RealAccounts account : list) {
            JSONObject acObj = new JSONObject();
            acObj.put("accountName", account.getAccountName());
            acObj.put("accountCode", account.getCode());
            acObj.put("identity", account.getId().intValue());
            acObj.put("accountNumber", String.valueOf(account.getAccountNumber()));

            acObj.put("iconCls", "task-folder");

            //acObj.put("children", "[]");
            java.util.Set<NorminalAccounts> nAccs = account.getNorminalAccounts();
            JSONArray normArray = new JSONArray();

            for (NorminalAccounts na : nAccs) {
                JSONObject normObj = new JSONObject();
                normObj.put("accountName", na.getAccountName());
                normObj.put("accountCode", na.getAccountName().toUpperCase());
                normObj.put("accountNumber", na.getAccountNumber());
                normObj.put("identity", 0);
                normObj.put("leaf", true);
                normObj.put("iconCls", "task");
                normArray.add(normObj);
            }

            if (nAccs.size() > 0) {
                acObj.put("expanded", true);
                acObj.put("children", normArray);
            } else {
                acObj.put("expanded", false);
                acObj.put("children", "[]");
            }

            accArray.add(acObj);
        }

        return accArray.toString();
    }

    public NorminalAccounts saveNorminalAccount(NorminalAccounts account) {
        RealAccounts rlAccounts = acDao.findByCode(String.valueOf(account.getRealAccount().getCode()));
        account.setRealAccount(rlAccounts);
        acDao.saveNorminalAccounts(account);
        return account;
    }

    public String getNorminalsByAccountNumberForForm(String accountNumber) {
        NorminalAccounts norminalAccountName = acDao.findNorminalsByAccountNumber(accountNumber);
        JSONObject jAccount = new JSONObject();

        jAccount.put("accountClass", norminalAccountName.getAccountClass());
        jAccount.put("accountNumber", norminalAccountName.getAccountNumber());
        jAccount.put("accountName", norminalAccountName.getAccountName());
        jAccount.put("description", norminalAccountName.getDescription());
        jAccount.put("code", norminalAccountName.getCode());
        jAccount.put("id", norminalAccountName.getId());
        jAccount.put("parentId", norminalAccountName.getRealAccount() == null ? "" : norminalAccountName.getRealAccount().getId());

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", jAccount);
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }

    public String getAccounts() {
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        /**
         * Update the major accounts
         */
        updateMainAccounts();
        List<Accounts> accountsList = acDao.getAccountsList();
        for (Accounts ae : accountsList) {
            object = new JSONObject();
            object.put("accountCode", ae.getAccountCode());
            object.put("identity", ae.getId());
            object.put("description", ae.getAccountName());
            List<Accounts> subAccounts = acDao.findAccounts(ae.getId());
            if (subAccounts.isEmpty()) {
                object.put("children", "[]");
            } else {
                logger.warn("sublist::" + subAccounts.size());
                JSONObject objectL1 = null;
                JSONArray normArrayL1 = new JSONArray();
                for (Accounts aeL1 : subAccounts) {
                    objectL1 = new JSONObject();
                    objectL1.put("accountCode", aeL1.getAccountCode());
                    objectL1.put("identity", aeL1.getId());
                    objectL1.put("description", aeL1.getAccountName());
                    List<Accounts> subAccountsL1 = acDao.findAccounts(aeL1.getId());
                    if (subAccountsL1.isEmpty()) {
                        objectL1.put("children", "[]");
                        objectL1.put("leaf", true);
                    } else {
                        JSONObject objectL2 = null;
                        JSONArray normArrayL2 = new JSONArray();
                        for (Accounts aeL2 : subAccountsL1) {
                            objectL2 = new JSONObject();
                            objectL2 = new JSONObject();
                            objectL2.put("accountCode", aeL2.getAccountCode());
                            objectL2.put("identity", aeL2.getId());
                            objectL2.put("description", aeL2.getAccountName());
                            List<Accounts> subAccountsL2 = acDao.findAccounts(aeL2.getId());
                            if (subAccountsL2.isEmpty()) {
                                objectL2.put("children", "[]");
                                objectL2.put("leaf", true);
                            } else {
                                objectL2.put("expanded", true);
                            }
                            normArrayL2.add(objectL2);
                        }
                        objectL1.put("children", normArrayL2);
                        objectL1.put("expanded", true);
                    }
                    normArrayL1.add(objectL1);
                }
                object.put("children", normArrayL1);
                object.put("expanded", true);
            }

            jarray.add(object);
        }

        return jarray.toString();
    }

    JSONArray array = new JSONArray();

    public String buildRecursively() {

        List<Accounts> subAccounts = acDao.getAccountsList();
        JSONObject object = new JSONObject();
        for (Accounts ac : subAccounts) {
            logger.warn("account::" + ac.getAccountName());
        }
        buildRecursively();
        return "{\"success\":true, \"msg\":\"Recursive method!\"}";
    }

    public void updateMainAccounts() {
        AccountsEnum[] values = AccountsEnum.values();
        for (AccountsEnum ae : values) {
            Accounts findAccount = acDao.findAccount(ae.getDescription());
            if (findAccount == null) {
                findAccount = new Accounts();
                findAccount.setAccountCode(String.valueOf(ae.getCode()));
                findAccount.setAccountName(ae.getDescription());
                acDao.saveAccounts(findAccount);
            }
        }
    }

    public String findAccountForForm(Long id) {
        Accounts accounts = acDao.findById(id);
        JSONObject jAccount = new JSONObject();

        jAccount.put("accountClass", accounts.getAccountClass());
        jAccount.put("accountName", accounts.getAccountName());
        jAccount.put("accountCode", accounts.getAccountCode());
        jAccount.put("id", accounts.getId());

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", jAccount);
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }

    public List<Accounts>  findExpensesList(String parentName) {
        Accounts parentAccount = acDao.findAccount(parentName);
        List<Accounts> childAccounts = acDao.getChildAccounts(parentAccount.getId());
        String exclude = "Carriage Inwards";
        Accounts accCi = null;
        for (Accounts acc : childAccounts) {
            if (!acc.getAccountName() .equalsIgnoreCase(exclude) ) {
                
            }else{
                accCi = (acc);
            }

        }
        if(accCi!=null){
            childAccounts.remove(accCi);
        }

        return childAccounts;
    }
    
    public String  findExpensesListJSON(String parentName) {
        Accounts parentAccount = acDao.findAccount(parentName);
        List<Accounts> childAccounts = acDao.getChildAccounts(parentAccount.getId());
        String exclude = "Carriage Inwards";
        Accounts accCi = null;
        JSONArray array = new JSONArray();
        JSONObject object  = new JSONObject();
        for (Accounts acc : childAccounts) {
            object = new JSONObject();
            if (!acc.getAccountName() .equalsIgnoreCase(exclude) ) {
                object.put("id", acc.getId());
                object.put("accountCode", acc.getAccountCode());
                object.put("accountName", acc.getAccountName());
                object.put("parentId", acc.getParentId());
                array.add(object);                   
                        
            }else{
                accCi = (acc);
            }

        }
        if(accCi!=null){
            childAccounts.remove(accCi);
        }
        JSONObject wrapper  = new JSONObject();
        wrapper.put("data", array);
        wrapper.put("success", true);
        wrapper.put("totalProperty", childAccounts.size());
        return wrapper.toString();
    }
    
    public String getAccrualsAccounts(){
        List<Accounts> accrualExpenseChildAccounts = acDao.getAccrualExpenseChildAccounts();
        
        JSONArray array = new JSONArray();
        JSONObject object = null;        
        for(Accounts acc: accrualExpenseChildAccounts){
            object = new JSONObject();
            object.put("id", acc.getId());
            object.put("accountName", acc.getAccountName());
            object.put("accountCode", acc.getAccountCode());
            object.put("parentId", acc.getParentId());
            array.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", array);
        wrapper.put("totalProperty", accrualExpenseChildAccounts.size());
        return wrapper.toString();
    }
    
     public String getPrepaidAccounts(){
        List<Accounts> accrualExpenseChildAccounts = acDao.getPrepaidExpenseChildAccounts();
        
        JSONArray array = new JSONArray();
        JSONObject object = null;        
        for(Accounts acc: accrualExpenseChildAccounts){
            object = new JSONObject();
            object.put("id", acc.getId());
            object.put("accountName", acc.getAccountName());
            object.put("accountCode", acc.getAccountCode());
            object.put("parentId", acc.getParentId());
            array.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", array);
        wrapper.put("totalProperty", accrualExpenseChildAccounts.size());
        return wrapper.toString();
    }
}
