/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.IdentityTypeDao;
import com.mtech.springsecurity.dao.PositionInEntityDao;
import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.dao.ShareholdingTypeDao;
import com.mtech.springsecurity.model.Director;
import com.mtech.springsecurity.model.IdentityType;
import com.mtech.springsecurity.model.PositionInEntity;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.ShareholdingType;
import com.mtech.springsecurity.service.DirectorService;
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
public class DirectorController {
    @Autowired
    DirectorService directorService;
    
    @Autowired
    SMEEntityDao SMEEntityDao;
    
    @Autowired
    PositionInEntityDao pieDao; 
    
    @Autowired
    IdentityTypeDao itdDao;
    
    @Autowired
    ShareholdingTypeDao stDao;
    
    @RequestMapping(value = {"/director/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveDirector(@ModelAttribute Director director,
            @RequestParam(value = "registeredName", required = true) String registeredName,
            @RequestParam(value = "positionName", required = true) String positionName,
            @RequestParam(value = "idTypeName", required = true) String idTypeName,
            @RequestParam(value = "shareholdingTypeName", required = true) String shareholdingTypeName){
        SMEEntity findSMEEntity = SMEEntityDao.findSMEEntity(registeredName);
        director.setSmeEntity(findSMEEntity);
        PositionInEntity findByPositionName = pieDao.findByPositionName(positionName);
        IdentityType findIdentityType = itdDao.findIdentityType(idTypeName);
        ShareholdingType findShareholdingType = stDao.findShareholdingType(shareholdingTypeName);
        director.setPositionInEntity(findByPositionName);
        director.setIdentityType(findIdentityType);
        director.setShareholdingType(findShareholdingType);
        directorService.saveDirector(director);
        return "{\"success\":true, \"msg\":\"You have successfully saved a director!\"}";
    }
    
    @RequestMapping(value = {"/directors/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getListOfDirectors(){
        String directorsList = directorService.getDirectorsList();
        return directorsList;
    }
}
