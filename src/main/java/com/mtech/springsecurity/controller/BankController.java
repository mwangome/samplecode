/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.BankDao;
import com.mtech.springsecurity.model.Bank;
import com.mtech.springsecurity.model.BankBranch;
import com.mtech.springsecurity.service.BankService;
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
public class BankController {
    @Autowired
    BankService bankService;
    
    @Autowired
    BankDao bankDao;
    
    @RequestMapping(value = {"/banks/gridview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getBanks() {
        String banks = bankService.getBankList();
        return banks;
    }
    
    @RequestMapping(value = {"/bank-branches/gridview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getBankBranches() {
        String banks = bankService.getBankBranchesList();
        return banks;
    }
    
    @RequestMapping(value={"/save/bank.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveBank(@ModelAttribute Bank bank){
        bankService.saveBank(bank);
        return "{\"success\":true, \"msg\":\"Bank has been saved successfully!\"}";
    }
    
    @RequestMapping(value={"/save/bank-branch.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveBankBranch(@ModelAttribute BankBranch bankBranch,
            @RequestParam(value = "bankId") Long bankId){
        
        Bank bank = bankDao.findBank(bankId);
        bankBranch.setBank(bank);
        bankService.saveBankBranch(bankBranch);
        return "{\"success\":true, \"msg\":\"Bank branch has been saved successfully!\"}";
    }
}
