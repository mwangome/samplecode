/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.SupplierType;
import com.mtech.springsecurity.service.SupplierTypeService;
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
public class SupplierTypeController {
    @Autowired
    SupplierTypeService stService;
    
    @Autowired
    SMEEntityDao smeEntityDao;
    
    @RequestMapping(value = {"/suppliertype/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveSupplierType(@ModelAttribute SupplierType st,
            @RequestParam(value = "registeredName") String registeredName){
        SMEEntity smeEntity = smeEntityDao.findSMEEntity(registeredName);
        st.setSmeEntity(smeEntity);
        stService.saveSupplierType(st);
        return "{\"success\":true, \"msg\":\"You have successfully saved a supplier type!\"}";
    }
    
    @RequestMapping(value = {"/suppliertypes/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getSupplierTypesList(){
        String supplierTypeList = stService.getSupplierTypeList();
        return supplierTypeList;
    }
    
    @RequestMapping(value = {"/suppliertype/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getSupplierTypeFormView(@RequestParam(value = "id") Long id){
        String supplierType = stService.findSupplierType(id);
        return supplierType;
    }
}
