/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.LegalTypeDao;
import com.mtech.springsecurity.model.LegalType;
import com.mtech.springsecurity.model.PostalCode;
import com.mtech.springsecurity.util.AppUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class LegalTypeService {
    @Autowired
    LegalTypeDao legalTypeDao;
    
    @Autowired
    AppUtil appUtil;
    
    public LegalType saveLegalType(LegalType legalType){
        legalType = legalTypeDao.saveLegalType(legalType);
        return legalType;
    }
    
    public String getLegalTypesList(){
        java.util.List<LegalType> list = legalTypeDao.getLegalTypes();
        JSONObject jObj = new JSONObject();
        JSONArray array = new JSONArray();
        for (LegalType u : list) {
            JSONObject jObjhold = new JSONObject();
            jObjhold.put("id", u.getId());
            jObjhold.put("accessName", u.getAccessName());
            jObjhold.put("createdAt", appUtil.formatJSDate(u.getCreatedAt()));
            jObjhold.put("isActive", u.isIsActive());
            array.add(jObjhold);
        }
        jObj.put("data", array);
        return jObj.toString();
    }
}
