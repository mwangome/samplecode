/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.PositionInEntity;
import com.mtech.springsecurity.service.PositionInEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author derek
 */
@Controller
public class PositionInEntityController {
    @Autowired
    PositionInEntityService pieService;
    
    @RequestMapping(value = {"/positioninentity/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String savePositionInEntity(@ModelAttribute PositionInEntity pie){
        pieService.savePositionInEntity(pie);
        return "{\"success\":true,\"msg\":\"You have successfully saved position in entity!\"}";
    }
    
    @RequestMapping(value = {"/positioninentity/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getPositionInEntityList(@ModelAttribute PositionInEntity pie){
        String positionInEntityDaoList = pieService.getPositionInEntityDaoList();
        return positionInEntityDaoList;
    }
}
