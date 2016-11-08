/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccessibilityTypesDao;
import com.mtech.springsecurity.model.AccessibilityTypes;
import com.mtech.springsecurity.service.AccessibilityTypeService;
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
public class AccessibilityTypesController {
    
    @Autowired
    AccessibilityTypeService atServe;
    
    @RequestMapping(value = {"/accessibilitytype/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveAccessibilityType(@ModelAttribute AccessibilityTypes at){
        atServe.saveAccessibilityType(at);    
        return "{\"success\":true, \"msg\":\"You have successfully saved accessibility type!\"}";
    }
    
    @RequestMapping(value = {"/accessibilitytypes/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getAccessibilityTypeList(){
        String accessibilityTypeList = atServe.getAccessibilityTypeList();
        return accessibilityTypeList;
    }
    
    @RequestMapping(value = {"/accessibilitytype/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getAccessibilityTypeList(@RequestParam(value = "id") Long id){
        String accessibilityType = atServe.findAccessibilityTypeForm(id);
        return accessibilityType;
    }
}
