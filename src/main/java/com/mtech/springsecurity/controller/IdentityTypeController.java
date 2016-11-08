/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.IdentityTypeDao;
import com.mtech.springsecurity.model.IdentityType;
import com.mtech.springsecurity.service.IdentityTypeService;
import java.util.List;
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
public class IdentityTypeController {
    @Autowired
    IdentityTypeService itService;
    
    @RequestMapping(value = "/identitytype/save.action", method = RequestMethod.POST)
    @ResponseBody
    public String saveIdentityType(@ModelAttribute IdentityType identityType){
        itService.saveIdentityType(identityType);
        return "{\"success\":true, \"msg\":\"You successfully saved identity type!\"}";
    }
    
    @RequestMapping(value = "/identitytypes/gridview.action", method = RequestMethod.POST)
    @ResponseBody
    public String getIdentityTypesList(@ModelAttribute IdentityType identityType){
        String identityTypesList = itService.getIdentityTypesList();
        return identityTypesList;
    }
}
