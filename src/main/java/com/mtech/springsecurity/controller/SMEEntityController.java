/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.SMEEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author derek
 */
@Controller
public class SMEEntityController {

    @Autowired
    SMEEntityService entityService;

    @RequestMapping(value = "/entity/save.action", method = RequestMethod.POST)
    @ResponseBody
    public String save(@ModelAttribute SMEEntity entity, @RequestParam("file") MultipartFile logo) throws Exception {
        try {
            entity.setData(logo.getBytes());
            entity.setFileName(logo.getOriginalFilename());
            entityService.saveSMEEntity(entity);
            return "{\"success\": \"true\", \"msg\":\"SME Entity Saved!\"}";
        } catch (Exception x) {
            return "{\"success\": false, \"msg\":\"You are not allowed to edit the entity!\"}";
        }

    }

    @RequestMapping(value = "/entity/formview.action", method = RequestMethod.POST)
    @ResponseBody
    public String view() throws Exception {
        String entityInfo = entityService.getSMEDetailsJSON();
        return entityInfo;

    }

    @RequestMapping(value = "/entity/comboview.action", method = RequestMethod.POST)
    @ResponseBody
    public String findEntity() throws Exception {
        String entityInfo = entityService.getSMEDetailsComboViewJSON();
        return entityInfo;

    }
    
    @RequestMapping(value = "/entitysearch/formview.action", method = RequestMethod.POST)
    @ResponseBody
    public String findEntity(@RequestParam(value = "id") Long id) throws Exception {
        String entityInfo = entityService.findSMEDetails(id);
        return entityInfo;

    }
    
    @RequestMapping(value = "/entity/gridview.action", method = RequestMethod.POST)
    @ResponseBody
    public String viewGrid() throws Exception {
        String entityInfo = entityService.getSMEDetailsComboViewJSON();
        return entityInfo;

    }
}
