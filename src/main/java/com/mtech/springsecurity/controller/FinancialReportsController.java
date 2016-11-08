/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.AccountTransactionsService;
import com.mtech.springsecurity.service.IncomeStatementService;
import com.mtech.springsecurity.service.StatementOfFinancialPositionService;
import javax.servlet.http.HttpSession;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author mwangome
 */
@Controller
public class FinancialReportsController {
    Logger logger = Logger.getLogger(FinancialReportsController.class);
    @Autowired
    IncomeStatementService incomeStmtService;
    
    @Autowired
    AccountTransactionsService atService;
    
    @Autowired
    SMEEntityDao entityDao;
    
    @Autowired
    StatementOfFinancialPositionService sofpDao;
    
    @RequestMapping(value = {"/incomestatement/gridview.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getIncomeStatement(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        logger.warn("calling income statement::");
        String inc = incomeStmtService.prepareIncomeStatement(entity);
        return inc;
    }
    
    @RequestMapping(value = {"/incomestatementhtml/gridview.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getIncomeStatementReport(@RequestParam(value = "entityId") String entityId){
        SMEEntity entity = entityDao.findSMEEntity(Long.parseLong(entityId));
        logger.warn("calling html income statement::");
        String inc = incomeStmtService.prepareHTMLIncomeStatement(entity);
        return "{\"success\":true, \"msg\":\"" +inc+ "\"}";
    }
    
    @RequestMapping(value = {"/incomestatementhtmltable/gridview.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getIncomeStatementTable(@RequestParam(value = "entityId") String entityId){
        SMEEntity entity = entityDao.findSMEEntity(Long.parseLong(entityId));
        logger.warn("calling html income statement::");
        String inc = incomeStmtService.prepareHTMLIncomeStatement(entity);
        return inc ;
    }
    
    
    @RequestMapping(value = {"/trialbalance/gridview.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getTrialBalance(@RequestParam(value = "entityId") String entityId){
        SMEEntity entity = entityDao.findSMEEntity(Long.parseLong(entityId));
        String accountTransactions = atService.getAccountTransactionsAggregate(entity);
        return accountTransactions;
    }
    
    @RequestMapping(value = {"/balancesheet/gridview.action"})
    @ResponseBody
    public String getBalanceSheet(@RequestParam(value = "entityId") String entityId){
        SMEEntity entity = entityDao.findSMEEntity(Long.parseLong(entityId));
        String type = sofpDao.prepareStatementOfFinancialPosition(entity);
        return type;
    }
    
}
