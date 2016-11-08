/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.LeaseTypeDao;
import com.mtech.springsecurity.model.LeaseType;
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
public class LeaseTypeService {

    @Autowired
    LeaseTypeDao ltDao;

    @Autowired
    AppUtil appUtil;

    public LeaseType saveLeaseType(LeaseType leaseType) {
        ltDao.saveLeaseType(leaseType);
        return leaseType;
    }

    public String getLeaseTypeList() {
        List<LeaseType> leaseTypeList = ltDao.getLeaseTypeList();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (LeaseType ct : leaseTypeList) {
            object = new JSONObject();
            object.put("id", ct.getId());
            object.put("createdBy", ct.getCreatedBy());
            object.put("leaseTypeName", ct.getLeaseTypeName());
            object.put("isActive", ct.isIsActive());
            object.put("createdAt", appUtil.formatJSDate(ct.getCreatedAt()));
            jarray.add(object);

        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", leaseTypeList.size());
        wrapper.put("data", jarray);
        return wrapper.toString();
    }

    public String findLeaseType(Long id) {
        LeaseType ct = ltDao.findLeaseType(id);
        JSONObject object = new JSONObject();
        object.put("id", ct.getId());
        object.put("createdBy", ct.getCreatedBy());
        object.put("leaseTypeName", ct.getLeaseTypeName());
        object.put("createdAt", appUtil.formatJSDate(ct.getCreatedAt()));
        object.put("isActive", ct.isIsActive());
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        wrapper.put("data", object);
        return wrapper.toString();
    }
}
