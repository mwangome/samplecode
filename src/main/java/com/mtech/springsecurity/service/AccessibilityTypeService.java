/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AccessibilityTypesDao;
import com.mtech.springsecurity.model.AccessibilityTypes;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class AccessibilityTypeService {

    @Autowired
    AccessibilityTypesDao accessibilityTypesDao;

    public AccessibilityTypes saveAccessibilityType(AccessibilityTypes accessibilityTypes) {
        accessibilityTypes = accessibilityTypesDao.saveAccessibilityType(accessibilityTypes);
        return accessibilityTypes;
    }

    public String getAccessibilityTypeList() {
        java.util.List<AccessibilityTypes> list = accessibilityTypesDao.getAccessibilityTypesList();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (AccessibilityTypes at : list) {
            object = new JSONObject();
            object.put("id", at.getId());
            object.put("accessibilityCode", at.getAccessibilityCode());
            object.put("accessibilityName", at.getAccessibilityName());
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", list.size());
        return wrapper.toString();
    }

    public String findAccessibilityTypeForm(Long id) {
        AccessibilityTypes at = accessibilityTypesDao.findAccessibilityType(id);
        JSONObject object = new JSONObject();
        object.put("id", at.getId());
        object.put("accessibilityCode", at.getAccessibilityCode());
        object.put("accessibilityName", at.getAccessibilityName());
        
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", object);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
}
