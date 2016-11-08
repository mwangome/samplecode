/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.Industry;
import com.mtech.springsecurity.service.IndustryGroupService;
import com.mtech.springsecurity.service.IndustryService;
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
public class IndustryController {
    @Autowired
    IndustryService industryCodeService;
    
    @Autowired
    IndustryGroupService igService;
    
    @RequestMapping(value={"/industry-code/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveIndustryCode(@ModelAttribute Industry industryCode){
        industryCodeService.saveIndustryCode(industryCode);
        return "{\"success\":true, \"msg\":\"Industry Code successfully saved!\"}";
    }
    
    @RequestMapping(value={"/industry-code/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getIndustryCodeGridView(){
        String industryCodesList = industryCodeService.getIndustryCodesList();
        return industryCodesList;
    }
    
    @RequestMapping(value={"/industrygroup/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getIndustryGroup(){
        String industryCodesList = igService.getIndustryDivisions();
        return industryCodesList;
    }
    
    @RequestMapping(value={"/searchindustrygroup/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findIndustryGroup(@RequestParam(value = "industryName")String industryName){
        String industryCodesList = industryCodeService.findIndustryGrps(industryName);
        return industryCodesList;
    }
}
