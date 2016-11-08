/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Store;
import com.mtech.springsecurity.service.StoreService;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author derek
 */
@Controller
public class StoreController {
    @Autowired
    StoreService storeService;
    
    @RequestMapping(value = {"/store/save.action"})
    @ResponseBody
    public String saveStore(
            @ModelAttribute Store store,
            HttpSession session){
        
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        store.setSmeEntity(entity);
        storeService.saveStore(store);
        return "{\"success\":true, \"msg\":\"You have successfully saved a store!\"}";
    }
    @RequestMapping(value = {"/stores/gridview.action"})
    @ResponseBody
    public String getStoresList(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String storeList = storeService.getStoreList(entity);
        return storeList;
    }
    
    @RequestMapping(value = {"/store/getstore-in-form.action"})
    @ResponseBody
    public String getStoresForm(@RequestParam(value = "id", required = false) Long id){
        String form = storeService.findStore(id);
        return form;
    }
    
}
