/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.model.Industry;
import com.mtech.springsecurity.model.LineOfBusiness;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.LineOfBusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.mtech.springsecurity.dao.IndustryDao;
import com.mtech.springsecurity.dao.IndustryGroupDao;
import com.mtech.springsecurity.model.IndustryGroup;
import javax.servlet.http.HttpSession;

/**
 *
 * @author derek
 */
@Controller
public class LineOfBusinessController {

    @Autowired
    LineOfBusinessService lineOfBusinessService;

    @Autowired
    SMEEntityDao smeService;

    @Autowired
    IndustryDao icd;
    
    @Autowired
    IndustryGroupDao igDao;

    @RequestMapping(value = {"/lineofbusiness/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveLineOfBusiness(@ModelAttribute LineOfBusiness lob,
            @RequestParam(value = "description", required = true) String groupName,
            @RequestParam(value = "registeredName", required = true) String registeredName) {
        SMEEntity smeEntity = smeService.findSMEEntity(registeredName);

        IndustryGroup industryCode = igDao.findIndustryGroupByName(groupName);

        lob.setSmeEntity(smeEntity);
        lob.setIndustryGroup(industryCode);
        lineOfBusinessService.saveLineOfBusiness(lob);
        return "{\"success\":true, \"msg\":\"Line of Business successfully saved!\"}";
    }

    @RequestMapping(value = {"/lineofbusiness/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String viewLineOfBusinessGrid(HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity");
        String linesOfBusiness = lineOfBusinessService.getLinesOfBusiness(entity);
        return linesOfBusiness;
    }
}
