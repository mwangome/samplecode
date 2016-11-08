/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;


import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.AnalyticsService;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author mwangome
 */
@Controller
public class AnalyticsController{
    @Autowired
    AnalyticsService anaServe;
    
    
    @RequestMapping(value = {"/analytics/sales-gridview.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getSalesPerMonth(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String salesPerMonth = anaServe.getSalesPerMonth(entity);
        return salesPerMonth;
    }
    
    @RequestMapping(value = {"/analytics/product-gridview.action"}, method = RequestMethod.GET)
    @ResponseBody
    public String getSalesPerProduct(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String salesPerMonth = anaServe.getSalesPerProduct(entity);
        return salesPerMonth;
    }
    
}
