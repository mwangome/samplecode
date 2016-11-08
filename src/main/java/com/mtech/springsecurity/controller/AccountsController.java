/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.NorminalAccounts;
import com.mtech.springsecurity.model.RealAccounts;
import com.mtech.springsecurity.service.AccountsService;
import com.mtech.springsecurity.util.AppUtil;
import java.util.logging.Logger;
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
public class AccountsController {

    Logger log = Logger.getLogger(AccountsController.class.getName());
    @Autowired
    AccountsService acService;

    @Autowired
    AccountsDao acDao;

    @Autowired
    AppUtil appUtil;

    @RequestMapping(value = "/bootstrap-accounts", method = RequestMethod.GET)
    @ResponseBody
    public String bootstrap() {
        acService.bootstrapAccounts();
        return "{\"success\":true, \"You have invoked bootstrap on accounts!\"}";
    }

    @RequestMapping(value = "/accounts/viewchartofaccounts", method = RequestMethod.POST)
    @ResponseBody
    public String getChartOfAccounts() {
        String accounts = acService.getChartOfAccounts();
        return accounts;
    }

    @RequestMapping(value = "/account/savenorminal.action", method = RequestMethod.POST)
    @ResponseBody
    public String saveNorminalAccounts(
            @ModelAttribute NorminalAccounts account,
            @RequestParam(value = "parentId", required = false) String parentId) {
        String updateString = " saved ";
        log.warning(String.valueOf("\n=>" + account.getCode()));
        if (parentId == null || parentId.equalsIgnoreCase("")) {
            RealAccounts findByCode = acDao.findByRealAccountByAccountNumber(Integer.parseInt(account.getCode()));
            account.setRealAccount(findByCode);
            log.warning("finding by code:::" + account.getCode() + "::is null?" + String.valueOf(findByCode == null));
        } else {
            RealAccounts findRealAccountById = acDao.findRealAccountById(Long.parseLong(parentId));
            account.setRealAccount(findRealAccountById);
            updateString = " updated ";
            log.warning("finding by id:::" + findRealAccountById.getAccountName());
        }
        NorminalAccounts accounts = acService.saveNorminalAccount(account);
        if (accounts.getRealAccount() != null) {
            return "{\"success\": true, \"msg\":\"You have successfully " + updateString + " the account!\"}";
        } else {
            return "{\"success\": false, \"msg\":\"Account was not saved, select main account and retry!\"}";
        }

    }

    @RequestMapping(value = "/account/getaccount-in-form.action", method = RequestMethod.POST)
    @ResponseBody
    public String getNorminalAccount(@RequestParam(value = "accountNumber") String accountNumber) {
        String norminalsByAccountNumberForForm = acService.getNorminalsByAccountNumberForForm(accountNumber);
        return norminalsByAccountNumberForForm;
    }

    @RequestMapping(value = {"/accounts/get-parents"}, method = RequestMethod.GET)
    @ResponseBody
    public String getAccounts() {
        return acService.getAccounts();
    }

    @RequestMapping(value = {"/accounts/saveaccount.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveAccounts(@ModelAttribute Accounts account) {
        Long parentId = account.getParentId();
        boolean findChildOrParentAccounts = acDao.findChildOrParentAccounts(parentId);
        if (!findChildOrParentAccounts) {
            return "{\"success\":false, \"msg\":\"That level of account is not supported, select a parent account then attempt again!\"}";
        }
        if (account.getId() != null) {
            Accounts findById = acDao.findById(account.getId());
            account.setParentId(findById.getParentId());
        }
        acDao.saveAccounts(account);
        return appUtil.streamResponse("account").toString();
    }

    @RequestMapping(value = {"/accounts/testaccounts.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String testAccs(@RequestParam(value = "id") Long id) {
        boolean findChildOrParentAccounts = acDao.findChildOrParentAccounts(id);
        return "" + findChildOrParentAccounts;
    }

    //findAccountForForm
    @RequestMapping(value = {"/account/fillform.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findAccountForForm(@RequestParam(value = "parentId") Long id) {
        String findChildOrParentAccounts = acService.findAccountForForm(id);
        return findChildOrParentAccounts;
    }

    @RequestMapping(value = {"/accountsexpense/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getChildAccounts(@RequestParam(value = "parentName") String parentName) {
        String exp = acService.findExpensesListJSON(parentName);
        return exp;
    }
    
    @RequestMapping(value = {"/accountsaccruals/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getAccrualsChildAccounts() {
        String exp = acService.getAccrualsAccounts();
        return exp;
    }
    
    @RequestMapping(value = {"/accountsprepaid/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getPrepaidChildAccounts() {
        String exp = acService.getPrepaidAccounts();
        return exp;
    }
    
    @RequestMapping(value = {"/accounts/scripts"}, method = RequestMethod.GET)
    @ResponseBody
    public String testScriptRun() {
        acDao.runScriptTest();
        return "{\"success\":true, \"msg\":\"Scripts run!\"}";
    }
}
