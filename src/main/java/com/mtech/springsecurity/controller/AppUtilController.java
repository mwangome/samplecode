/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.service.AccountsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author derek
 */
@Controller 
public class AppUtilController {
    @Autowired
    AccountsService as;
    
    @Autowired
    AccountsDao aDao;
    
    @RequestMapping(value = {"/app/test"}, method = RequestMethod.GET)
    @ResponseBody
    public String getTestResult(){
        String buildRecursively = as.buildRecursively();
        return buildRecursively;
    }
}
