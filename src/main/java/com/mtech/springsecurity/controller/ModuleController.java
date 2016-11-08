/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.Module;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.ModuleService;
import javax.servlet.http.HttpSession;
import net.sf.json.JSONArray;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author mwangome
 */
@Controller
public class ModuleController {

    Logger logger = Logger.getLogger(ModuleController.class);
    @Autowired
    ModuleService modServ;

    @RequestMapping(value = {"/modules/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String viewModules() {
        String modules = modServ.getModules();
        return modules;
    }

    @RequestMapping(value = {"/moduleuser/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveModule(@ModelAttribute Module module,
            @RequestParam(value = "data") String data,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        JSONArray fromObject = JSONArray.fromObject("[" + data + "]");
        module.setEntity(entity);
        String saveModule = modServ.saveModule(module, fromObject);
        return saveModule;
    }

    @RequestMapping(value = {"/moduleusers/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getModuleUsers(
            @RequestParam(value = "moduleName") String moduleName,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String moduleUsers = modServ.getModelUsers(moduleName, entity);
        return moduleUsers;
    }

    @RequestMapping(value = {"/module/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findModule(
            @RequestParam(value = "moduleName") String moduleName,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String moduleUsers = modServ.findModule(moduleName, entity);
        return moduleUsers;
    }

}
