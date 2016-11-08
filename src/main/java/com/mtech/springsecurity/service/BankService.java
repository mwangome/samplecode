/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.BankDao;
import com.mtech.springsecurity.model.Bank;
import com.mtech.springsecurity.model.BankBranch;
import com.mtech.springsecurity.util.AppUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class BankService {
    @Autowired
    BankDao bankDao;
    
    @Autowired
    AppUtil appUtil;
    
    public Bank saveBank(Bank bank){
        bank = bankDao.saveBank(bank);
        return bank;
    }
    
    public BankBranch saveBankBranch(BankBranch bank){
        bank = bankDao.saveBankBranch(bank);
        return bank;
    }
    
    public String getBankList(){
        java.util.List<Bank> list = bankDao.getBanksList();
        JSONArray array = new JSONArray();
        for(Bank bank: list){
            JSONObject obj = new JSONObject();
            obj.put("id", bank.getId());
            obj.put("bankCode", bank.getBankCode());
            obj.put("createdBy", bank.getCreatedBy());
            obj.put("bankName", bank.getBankName());
            obj.put("bankTownId", bank.getBankTownId());
            obj.put("createdAt", appUtil.formatJSDate(bank.getCreatedAt()));
            obj.put("postalCode", bank.getPostalCode());
            obj.put("postalNumber", bank.getPostalNumber());
            array.add(obj);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", list.size());
        wrapper.put("data", array);
        return wrapper.toString();
    }
    
    public String getBankBranchesList(){
        java.util.List<BankBranch> list = bankDao.getBankBranchesList();
        JSONArray array = new JSONArray();
        for(BankBranch bank: list){
            JSONObject obj = new JSONObject();
            obj.put("id", bank.getId());
            obj.put("branchCode", bank.getBranchCode());
            obj.put("building", bank.getBuilding());
            obj.put("street", bank.getStreet());
            obj.put("branchName", bank.getBranchName());
            obj.put("branchTownId", bank.getBranchTownId());
            obj.put("createdAt", appUtil.formatJSDate(bank.getCreatedAt()));
            obj.put("postalCode", bank.getPostalCode());
            obj.put("postalNumber", bank.getPostalNumber());
            array.add(obj);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", list.size());
        wrapper.put("data", array);
        return wrapper.toString();
    }
}
