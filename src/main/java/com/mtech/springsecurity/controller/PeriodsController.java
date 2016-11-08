/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccountingPeriodDao;
import com.mtech.springsecurity.enumerate.PeriodStatus;
import com.mtech.springsecurity.model.AccountingPeriod;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.AccountingPeriodService;
import com.mtech.springsecurity.util.AppUtil;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author mwangome
 */
@Controller
public class PeriodsController {
    @Autowired
    AccountingPeriodService apService;
    
    @Autowired
    AppUtil appUtil;
    @Autowired
    AccountingPeriodDao apDao;
    
    @RequestMapping(value = {"/ap/savelist.action"})
    @ResponseBody
    public String savePeriods(@RequestParam(value = "startDate") java.util.Date startDate,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        apService.initPeriods(entity, startDate);
        return appUtil.streamResponse("accounting periods").toString();
    }
    
    @RequestMapping(value = {"/aps/gridview.action"})
    @ResponseBody
    public String getPeriods(HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String periods = apService.getPeriods(entity);
        return periods;
    }
    
    @RequestMapping(value = {"/ap/close.action"})
    @ResponseBody
    public String closePeriod(@RequestParam(value = "id") Long id){
        AccountingPeriod accountingPeriod = apDao.findAccountingPeriod(id);
        accountingPeriod.setStatus(PeriodStatus.CLOSED);
        apDao.saveAccountingPeriod(accountingPeriod);
        return "{\"success\":true, \"msg\":\"You have successfully closed a period!\"}";
    }
}
