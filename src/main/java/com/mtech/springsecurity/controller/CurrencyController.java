/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.Currency;
import com.mtech.springsecurity.service.CurrencyService;
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
public class CurrencyController {
    @Autowired
    CurrencyService currencyService;
    
    @RequestMapping(value = {"/currency/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveCurrency(@ModelAttribute Currency currency ){
        currencyService.saveCurrency(currency);
        return "{\"success\":true, \"msg\":\"You have successfully added currency\"}";
    }
    
    //
    @RequestMapping(value = {"/currencies/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getCurrencyGridview(@ModelAttribute Currency currency ){
        String currencies = currencyService.getCurrencyList();
        return currencies;
    }
}
