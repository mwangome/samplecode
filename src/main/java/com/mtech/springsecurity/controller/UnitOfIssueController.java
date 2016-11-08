/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.UnitOfIssueDao;
import com.mtech.springsecurity.model.UnitOfIssue;
import com.mtech.springsecurity.service.UnitOfIssueService;
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
public class UnitOfIssueController {
    @Autowired
    UnitOfIssueService uoiService;
    
    
    
    @RequestMapping(value = {"/uoi/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveUnitOfIssue(@ModelAttribute UnitOfIssue uoi){        
        uoiService.saveUnitOfIssue(uoi);
        return "{\"success\":true , \"msg\":\"You have successfully saved unit of issue!\"}";
    }
    
    @RequestMapping(value = {"/uoi/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getUnitOfIssueList(@ModelAttribute UnitOfIssue uoi){
        String unitOfIssueList = uoiService.getUnitOfIssueList();
        return unitOfIssueList;
    }
    
    @RequestMapping(value = {"/uoi/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findUnitOfIssue(@RequestParam(value = "id") Long id){
        String unitOfIssue = uoiService.findUnitOfIssue(id);
        return unitOfIssue;
    }
}
