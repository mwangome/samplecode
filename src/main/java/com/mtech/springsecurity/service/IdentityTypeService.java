/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.IdentityTypeDao;
import com.mtech.springsecurity.model.IdentityType;
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
public class IdentityTypeService {
    @Autowired
    IdentityTypeDao identityTypeDao;
    
    @Autowired
    AppUtil appUtil;
    
    public IdentityType saveIdentityType(IdentityType identityType){
        identityTypeDao.saveIdentityType(identityType);
        return identityType;
    }
    
    public String getIdentityTypesList(){
        List<IdentityType> identityTypesList = identityTypeDao.getIdentityTypesList();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for(IdentityType it:identityTypesList){
            object = new JSONObject();
            object.put("id", it.getId());
            object.put("createdAt", appUtil.formatJSDate(it.getCreatedAt()));
            object.put("idTypeName", it.getIdTypeName());
            object.put("typeCode", it.getTypeCode());
            object.put("isActive", it.isIsActive());
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", identityTypesList.size());
        wrapper.put("data", jarray);
        return wrapper.toString();
    }
}
