/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.model.IndustryGroup;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mtech.springsecurity.dao.IndustryGroupDao;

/**
 *
 * @author mwangome
 */
@Service
public class IndustryGroupService {
    @Autowired
    IndustryGroupDao idDao;
    
    public String getIndustryDivisions(){
        List<IndustryGroup> listOfDivisions = idDao.getListOfGroups();
        JSONArray array = new JSONArray();
        JSONObject object;
        for(IndustryGroup iDiv:listOfDivisions){
            object = new JSONObject();
            object.put("id", iDiv.getId());
            object.put("code", iDiv.getCode());
            object.put("groupName", iDiv.getDescription());
            array.add(object);
        }
        
        JSONObject wrapper = new JSONObject();
        wrapper.put("data", array);
        wrapper.put("success", true);
        wrapper.put("totalProperty", listOfDivisions.size());
        return wrapper.toString();
    }
}
