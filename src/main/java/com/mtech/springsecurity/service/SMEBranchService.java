/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.SMEBranchDao;
import com.mtech.springsecurity.model.SMEBranch;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class SMEBranchService {

    @Autowired
    SMEBranchDao branchDao;

    @Autowired
    AppUtil appUtil;

    public SMEBranch saveBranch(SMEBranch branch) {
        branch = branchDao.saveBranch(branch);
        return branch;
    }

    public String getBranches(SMEEntity entity) {
        List<SMEBranch> branches = branchDao.getBranches(entity);

        JSONArray array = new JSONArray();
        for (SMEBranch branch : branches) {
            JSONObject branchObject = new JSONObject();
            branchObject.put("id", branch.getId());
            branchObject.put("branchName", branch.getBranchName());
            branchObject.put("leaseTypeName", branch.getLeaseType() == null ? "" : branch.getLeaseType().getLeaseTypeName());
            branchObject.put("accessType", branch.getAccessType());
            branchObject.put("branchCode", branch.getBranchCode());
            branchObject.put("buildingLrNumber", branch.getBuildingLrNumber());
            branchObject.put("createdAt", appUtil.formatJSDate(branch.getCreatedAt()));
            branchObject.put("emailAddress", branch.getEmailAddress());
            array.add(branchObject);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("data", array);
        wrapper.put("success", true);
        wrapper.put("totalCount", branches.size());
        return wrapper.toString();
    }

    public SMEBranch findBranch(String branchName) {
        return branchDao.findBranch(branchName);
    }

    public String findBranch(Long id) {
        SMEBranch branch = branchDao.findBranch(id);

        JSONObject branchObject = new JSONObject();
        branchObject.put("id", branch.getId());
        branchObject.put("structureType", branch.getStructureType());
        branchObject.put("branchName", branch.getBranchName());
        branchObject.put("leaseTypeName", branch.getLeaseType() == null ? "" : branch.getLeaseType().getLeaseTypeName());
        branchObject.put("accessType", branch.getAccessType());
        branchObject.put("branchCode", branch.getBranchCode());
        branchObject.put("buildingLrNumber", branch.getBuildingLrNumber());
        branchObject.put("createdAt", appUtil.formatJSDate(branch.getCreatedAt()));
        branchObject.put("emailAddress", branch.getEmailAddress());
        
        branchObject.put("floorSize", branch.getFloorSize());
        branchObject.put("storeNumber", branch.getStoreNumber());
        branchObject.put("streetName", branch.getStreetName());
        
        branchObject.put("postCode", branch.getPostCode());
        branchObject.put("townCode", branch.getTownCode());
        branchObject.put("postalNumber", branch.getPostalNumber());
        branchObject.put("registeredName", branch.getEntity() == null?"":branch.getEntity().getRegisteredName());

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", branchObject);
        wrapper.put("success", true);
        wrapper.put("totalCount", 1);
        return wrapper.toString();
    }

}
