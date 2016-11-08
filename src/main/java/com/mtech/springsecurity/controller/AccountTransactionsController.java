/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.AccountTransactionsService;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author derek
 */
@Controller
public class AccountTransactionsController {
    @Autowired
    AccountTransactionsService atService;
    
    @Autowired
    SMEEntityDao entityDao;
    
    @RequestMapping(value = {"/accounttransactions/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getAccountTransactions(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String accountTransactions = atService.getAccountTransactions(entity);
        return accountTransactions;
    }
    
    @RequestMapping(value = {"/balances/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getAccountBalances(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String accountTransactions = atService.getAccountTransactionsAggregate(entity);
        return accountTransactions;
    }
    
    @RequestMapping(value = {"/accounttransactions/getgridview.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getAccountTransactionsList(@RequestParam(value = "_registeredName") String registeredName,HttpSession session){
        registeredName = registeredName.replaceAll("_", " ");
        SMEEntity entity = entityDao.findSMEEntity(Long.parseLong(registeredName));        
        String accountTransactions = atService.getAccountTransactions(entity);
        return accountTransactions;
    }
    
}
