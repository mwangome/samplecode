/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.Tax;
import com.mtech.springsecurity.service.TaxService;
import com.mtech.springsecurity.util.AppUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author mwangome
 */
@Controller
public class TaxController {
    
    @Autowired
    TaxService tService;
    
    @Autowired
    AppUtil appUtil;
    
    @RequestMapping(value = {"/tax/save.action"})
    @ResponseBody
    public String saveTaxes(@ModelAttribute Tax tax){
        tService.saveTax(tax);
        return appUtil.streamResponse("tax").toString();
    }
    
    @RequestMapping(value = {"/tax/gridview.action"})
    @ResponseBody
    public String getTaxesList(){
        String taxList = tService.getTaxList();
        return taxList;
    }
    
    @RequestMapping(value = {"/tax/formview.action"})
    @ResponseBody
    public String findTax(@RequestParam(value = "id") Long id){
        String taxList = tService.findTax(id);
        return taxList;
    }
}
