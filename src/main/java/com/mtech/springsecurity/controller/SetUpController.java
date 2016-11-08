/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.model.TradeCustomer;
import com.mtech.springsecurity.model.AssetCustomer;
import com.mtech.springsecurity.dao.CustomerDao;
import com.mtech.springsecurity.dao.LeaseTypeDao;
import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.dao.SupplierDao;
import com.mtech.springsecurity.model.LeaseType;
import com.mtech.springsecurity.model.SMEBranch;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.SMESite;
import com.mtech.springsecurity.model.Supplier;
import com.mtech.springsecurity.service.IndustryGroupService;
import com.mtech.springsecurity.service.LegalTypeService;
import com.mtech.springsecurity.service.PostalCodesService;
import com.mtech.springsecurity.service.SMEBranchService;
import com.mtech.springsecurity.service.SMESiteService;
import com.mtech.springsecurity.service.SetupService;
import com.mtech.springsecurity.service.TownCodeService;
import javax.servlet.http.HttpSession;
import org.jboss.logging.Logger;
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
public class SetUpController {

    Logger logger = Logger.getLogger(SetUpController.class.getName());

    @Autowired
    PostalCodesService postalCodeService;

    @Autowired
    TownCodeService townCodeService;

    @Autowired
    LegalTypeService legalTypeService;

    @Autowired
    SMESiteService siteService;

    @Autowired
    SMEEntityDao smeDao;

    @Autowired
    SMEBranchService branchService;

    @Autowired
    CustomerDao customerDao;

    @Autowired
    SupplierDao supplierDao;

    @Autowired
    SetupService setupService;

    @Autowired
    LeaseTypeDao ltDao;
    
    @Autowired
    IndustryGroupService idService;

    /**
     * Save postal view
     *
     * @return
     */
    @RequestMapping(value = {"/postal/codeview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getPostalCodes() {
        String statuses = postalCodeService.getPostalCodes();
        return statuses;
    }

    @RequestMapping(value = {"/town/codeview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getTownCodes() {
        String statuses = townCodeService.getTownCodes();
        return statuses;
    }

    @RequestMapping(value = {"/legal/typeview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getLegalTypes() {
        String legalTypes = legalTypeService.getLegalTypesList();
        return legalTypes;
    }

    @RequestMapping(value = {"/site/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveSite(@ModelAttribute SMESite site,
            @RequestParam("registeredName") String registeredName) {
        SMEEntity entityDb = smeDao.findSMEEntity(registeredName);
        site.setSmeEntity(entityDb);
        siteService.saveSite(site);
        return "{\"success\":true, \"msg\":\"Site has been saved successfully!\"}";
    }

    @RequestMapping(value = {"/branch/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveBranch(@ModelAttribute SMEBranch branch,
            @RequestParam("registeredName") String registeredName,
            @RequestParam("leaseTypeName") String leaseTypeName) {
        SMEEntity entityDb = smeDao.findSMEEntity(registeredName);
        LeaseType leaseType = ltDao.findLeaseType(leaseTypeName);
        branch.setEntity(entityDb);
        branch.setLeaseType(leaseType);
        branchService.saveBranch(branch);
        return "{\"success\":true, \"msg\":\"Branch has been saved successfully!\"}";
    }

    @RequestMapping(value = {"/site/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findSmeSite(@RequestParam(value = "id") Long id) {
        String findSmeSite = siteService.findSmeSite(id);
        return findSmeSite;
    }

    @RequestMapping(value = {"/site/gridview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getSites() {
        String legalTypes = siteService.getSMEList();
        return legalTypes;
    }

    @RequestMapping(value = {"/branch/gridview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getBranches(HttpSession session) {
        //SMEEntity sme = 

        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String branches = branchService.getBranches(entity);
        return branches;
    }

    @RequestMapping(value = {"/branch/formview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String findBranch(@RequestParam(value = "id") Long id) {

        String branches = branchService.findBranch(id);
        return branches;
    }

    @RequestMapping(value = {"/supplier/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveSupplier(@ModelAttribute Supplier supplier,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        supplier.setEntity(entity);
        supplierDao.saveSupplier(supplier);
        return "{\"success\":true, \"msg\":\"Supplier has been saved successfully!\"}";
    }

    @RequestMapping(value = {"/customer/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveCustomer(@ModelAttribute TradeCustomer customer,HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        customer.setEntity(entity);
        customerDao.saveCustomer(customer);
        return "{\"success\":true, \"msg\":\"Customer has been saved successfully!\"}";
    }
    
     @RequestMapping(value = {"/assetcustomer/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveAssetCustomer(@ModelAttribute AssetCustomer customer,HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        customer.setEntity(entity);
        customerDao.saveCustomer(customer);
        return "{\"success\":true, \"msg\":\"Customer has been saved successfully!\"}";
    }

    @RequestMapping(value = {"/customers/gridview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getCustomers(HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String customers = setupService.getCustomersList(entity);
        return customers;
    }
    
    @RequestMapping(value = {"/assetcustomers/gridview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getAssetCustomers(HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String customers = setupService.getAssetCustomersList(entity);
        return customers;
    }

    @RequestMapping(value = {"/suppliers/gridview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getSuppliers(HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String suppliers = setupService.getSuppliersList(entity);
        return suppliers;
    }
    
    @RequestMapping(value = {"/industrydivision/gridview.action"}, method = RequestMethod.POST) //
    @ResponseBody
    public String getIndustryDivision() {
        String divisions = idService.getIndustryDivisions();
        return divisions;
    }

}
