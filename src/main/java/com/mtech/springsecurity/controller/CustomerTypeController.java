/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.CustomerType;
import com.mtech.springsecurity.service.CustomerTypeService;
import com.mtech.springsecurity.util.AppUtil;
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
public class CustomerTypeController {
     @Autowired
    CustomerTypeService ctService;
    
    @Autowired
    AppUtil appUtil;
    
    @RequestMapping(value = {"/customertype/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveAssetType(@ModelAttribute CustomerType customerType){
        ctService.saveCustomerType(customerType);
        return appUtil.streamResponse("customer type").toString();
    }
    
    @RequestMapping(value = {"/customertypes/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getCustomerTypeList(){
        String customerType = ctService.getCustomerTypeList();
        return customerType;
    }
    
    @RequestMapping(value = {"/customertype/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findCustomerType(@RequestParam(value = "id") Long id){
        String assetType = ctService.findCustomerType(id);
        return assetType;
    }
}
