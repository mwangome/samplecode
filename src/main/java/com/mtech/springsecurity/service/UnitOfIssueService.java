/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.UnitOfIssueDao;
import com.mtech.springsecurity.model.UnitOfIssue;
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
public class UnitOfIssueService {

    @Autowired
    UnitOfIssueDao uoiDao;
    
    @Autowired
    AppUtil appUtil;

    public UnitOfIssue saveUnitOfIssue(UnitOfIssue uoi) {
        UnitOfIssue unitOfIssue = uoiDao.saveUnitOfIssue(uoi);
        return unitOfIssue;
    }

    public String getUnitOfIssueList() {
        List<UnitOfIssue> unitOfIssueList = uoiDao.getUnitOfIssueList();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (UnitOfIssue uoi : unitOfIssueList) {
            object = new JSONObject();
            object.put("id", uoi.getId());
            object.put("createdAt", appUtil.formatJSDate(uoi.getCreatedAt()));
            object.put("uoiCode", uoi.getUoiCode());
            object.put("uoiName", uoi.getUoiName());
            object.put("isActive", uoi.isIsActive());
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("data", jarray);
        wrapper.put("success", true);
        wrapper.put("totalProperty", unitOfIssueList.size());
        return wrapper.toString();
    }

    public String findUnitOfIssue(Long id) {
        UnitOfIssue uoi = uoiDao.findUnitOfIssue(id);
        JSONObject object = new JSONObject();
        object.put("id", uoi.getId());
        object.put("createdAt", appUtil.formatJSDate(uoi.getCreatedAt()));
        object.put("uoiCode", uoi.getUoiCode());
        object.put("uoiName", uoi.getUoiName());
        object.put("isActive", uoi.isIsActive());
        JSONObject wrapper = new JSONObject();
        wrapper.put("data", object);
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
    
    public String findUnitOfIssue(String uoiName) {
        UnitOfIssue uoi = uoiDao.findUnitOfIssue(uoiName);
        JSONObject object = new JSONObject();
        object.put("id", uoi.getId());
        object.put("createdAt", appUtil.formatJSDate(uoi.getCreatedAt()));
        object.put("uoiCode", uoi.getUoiCode());
        object.put("uoiName", uoi.getUoiName());
        object.put("isActive", uoi.isIsActive());
        JSONObject wrapper = new JSONObject();
        wrapper.put("data", object);
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
}
