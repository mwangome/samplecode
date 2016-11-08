/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.TransactionType;
import com.mtech.springsecurity.service.TransactionTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author derek
 */
@Controller
public class TransactionTypeController {
    @Autowired
    TransactionTypeService ttService;
    
    @RequestMapping(value = {"/transactiontype/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveTransactionType(@ModelAttribute TransactionType transactionType){
        TransactionType saveTransactionType = ttService.saveTransactionType(transactionType);
        return "{\"success\":true, \"msg\":\"You have successfully saved Transaction Type!\"}";
    }
    
     @RequestMapping(value = {"/transactiontypes/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getTransactionTypesList(@ModelAttribute TransactionType transactionType){
        String saveTransactionType = ttService.getTransactionType();
        return saveTransactionType;
    }
    
}
