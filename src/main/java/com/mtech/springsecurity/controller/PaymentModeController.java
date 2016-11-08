/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.PaymentModeDao;
import com.mtech.springsecurity.model.PaymentMode;
import com.mtech.springsecurity.service.PaymentModeService;
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
public class PaymentModeController {
    @Autowired
    PaymentModeService paymentModeService;
    
    @RequestMapping(value = "/paymode/save.action", method = RequestMethod.POST)
    @ResponseBody
    public String savePaymentMode(@ModelAttribute PaymentMode mode){
        paymentModeService.savePaymentMode(mode);
        return "{\"success\":true, \"msg\":\"You have successfully saved payment mode!\"}";
    }
    
    @RequestMapping(value = "/paymodes/gridview.action", method = RequestMethod.POST)
    @ResponseBody
    public String getPaymentModesList(){
        String paymentModeList = paymentModeService.getPaymentModeList();//getModes();
        return paymentModeList;
    }
    
    @RequestMapping(value = "/paymode/formview.action", method = RequestMethod.POST)
    @ResponseBody
    public String findPaymentModes(@RequestParam(value = "id", required = false) Long id){
        String paymentMode = paymentModeService.getPaymentModeForForm(id);
        return paymentMode;
    }
}
