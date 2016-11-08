/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.AssetType;
import com.mtech.springsecurity.service.AssetTypeService;
import com.mtech.springsecurity.util.AppUtil;
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
public class AssetTypeController {
    @Autowired
    AssetTypeService atService;
    
    @Autowired
    AppUtil appUtil;
    
    @RequestMapping(value = {"/assettype/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveAssetType(@ModelAttribute AssetType assetType){
        atService.saveAssetType(assetType);
        return appUtil.streamResponse("asset type").toString();
    }
    
    @RequestMapping(value = {"/assettypes/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getAssetTypeList(){
        String assetTypeList = atService.getAssetTypeList();
        return assetTypeList;
    }
    
    @RequestMapping(value = {"/assettype/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findAssetType(@RequestParam(value = "id") Long id){
        String assetType = atService.findAssetType(id);
        return assetType;
    }
}
