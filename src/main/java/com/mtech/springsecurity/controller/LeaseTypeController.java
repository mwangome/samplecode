/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.LeaseType;
import com.mtech.springsecurity.service.LeaseTypeService;
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
public class LeaseTypeController {
    @Autowired
    LeaseTypeService ltService;
    
    @Autowired
    AppUtil appUtil;
    
    @RequestMapping(value = {"/leasetype/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveAssetType(@ModelAttribute LeaseType customerType){
        ltService.saveLeaseType(customerType);
        return appUtil.streamResponse("lease type").toString();
    }
    
    @RequestMapping(value = {"/leasetypes/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getCustomerTypeList(){
        String customerType = ltService.getLeaseTypeList();
        return customerType;
    }
    
    @RequestMapping(value = {"/leasetype/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findCustomerType(@RequestParam(value = "id") Long id){
        String leaseType = ltService.findLeaseType(id);
        return leaseType;
    }
}
