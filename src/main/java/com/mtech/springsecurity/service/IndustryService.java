/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.model.Industry;
import com.mtech.springsecurity.util.AppUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mtech.springsecurity.dao.IndustryDao;
import com.mtech.springsecurity.model.IndustryGroup;
import java.util.Set;

/**
 *
 * @author derek
 */
@Service
public class IndustryService {
    @Autowired
    IndustryDao industryCodeDao;
    
    @Autowired
    AppUtil appUtil;
    
    public Industry saveIndustryCode(Industry industryCode){
        industryCodeDao.saveIndustryCode(industryCode);
        return industryCode;
    }
    
    public String getIndustryCodesList(){
        java.util.List<Industry> codes = industryCodeDao.getIndustryCodesList();
        JSONArray jarray = new JSONArray();
        for(Industry code: codes){
            JSONObject object = new JSONObject();
            object.put("createdAt", appUtil.formatJSDate(code.getCreatedAt()));
            object.put("id", code.getId());
            object.put("sicCode", code.getSicCode());
            object.put("sicName", code.getSicName());
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("totalProperty", codes.size());
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        return wrapper.toString();
    }
    
    public String findIndustryGrps(String industryName){
        Industry industry = industryCodeDao.findIndustryCode(industryName);
        Set<IndustryGroup> industryGroups = industry.getIndustryGroups();
        JSONArray jarray = new JSONArray();
        for(IndustryGroup code: industryGroups){
            JSONObject object = new JSONObject();
            object.put("createdAt", appUtil.formatJSDate(code.getCreatedAt()));
            object.put("id", code.getId());
            object.put("description", code.getDescription());
            object.put("code", code.getCode());
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("totalProperty", industryGroups.size());
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        return wrapper.toString();
    }
}
