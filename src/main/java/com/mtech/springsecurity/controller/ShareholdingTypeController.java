/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.ShareholdingType;
import com.mtech.springsecurity.service.ShareholdingTypeService;
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
public class ShareholdingTypeController {
    @Autowired
    ShareholdingTypeService shareholdingTypeService;
    
    @RequestMapping(value = {"/shareholdingtype/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveShareholdingType(@ModelAttribute ShareholdingType shareholdingType){
        shareholdingTypeService.saveShareholdingType(shareholdingType);
        return "{\"success\":true, \"msg\":\"You have successfully saved Shareholding Type!\"}";
    }
    
    @RequestMapping(value = {"/shareholdingtypes/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getGridView(){
        String shareholdingTypesList = shareholdingTypeService.getShareholdingTypesList();
        return shareholdingTypesList;
    }
    
    @RequestMapping(value = {"/shareholdingtype/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findShareholdingType(@RequestParam(value = "id") Long id){
        String shareholdingTypes = shareholdingTypeService.findShareholdingType(id);
        return shareholdingTypes;
    }
}
