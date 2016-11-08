/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.LineOfBusinessDao;
import com.mtech.springsecurity.model.LineOfBusiness;
import com.mtech.springsecurity.model.SMEEntity;
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
public class LineOfBusinessService {
    @Autowired
    LineOfBusinessDao lineOfBusinessDao;
    
    public LineOfBusiness saveLineOfBusiness(LineOfBusiness lineOfBusiness){
        lineOfBusiness = lineOfBusinessDao.saveLineOfBusiness(lineOfBusiness);
        return lineOfBusiness;
    }
    
    public String getLinesOfBusiness(SMEEntity entity){
        List<LineOfBusiness> lineOfBusinessList = lineOfBusinessDao.getLineOfBusinessList(entity);
        JSONArray jarray = new JSONArray();
        for(LineOfBusiness lob:lineOfBusinessList){
            JSONObject object = new JSONObject();
            object.put("id", lob.getId());
            object.put("shareOfBusiness", lob.getShareOfBusiness());
            object.put("sicName", lob.getIndustryGroup() == null?"":lob.getIndustryGroup().getIndustry().getSicName());
            object.put("registeredName", lob.getSmeEntity().getRegisteredName());
            object.put("lineOfBusiness", lob.getIndustryGroup() == null?"":lob.getIndustryGroup().getDescription());
            jarray.add(object);
            lob.getLineOfBusiness();
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("totalProperty", lineOfBusinessList.size());
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        return wrapper.toString();
    }
    
    public String getIndustryGroups(SMEEntity entity){
        List<LineOfBusiness> lineOfBusinessList = lineOfBusinessDao.getLineOfBusinessList(entity);
        JSONArray jarray = new JSONArray();
        for(LineOfBusiness lob:lineOfBusinessList){
            JSONObject object = new JSONObject();
            object.put("id", lob.getIndustryGroup().getId());
            object.put("sicName", lob.getIndustryGroup().getName());
            object.put("code", lob.getIndustryGroup().getCode());
            object.put("groupName", lob.getIndustryGroup().getDescription());
            jarray.add(object);
            
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("totalProperty", lineOfBusinessList.size());
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        return wrapper.toString();
    }
}
