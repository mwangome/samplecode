/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.PositionInEntityDao;
import com.mtech.springsecurity.model.PositionInEntity;
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
public class PositionInEntityService {
    @Autowired
    PositionInEntityDao positionInEntityDao;
    
    @Autowired
    AppUtil appUtil;
    public PositionInEntity savePositionInEntity(PositionInEntity positionInEntity){
        positionInEntityDao.savePositionInEntity(positionInEntity);
        return positionInEntity;
    }
    
    public String getPositionInEntityDaoList(){
        List<PositionInEntity> positionInEntityList = positionInEntityDao.getPositionInEntityList();
        JSONObject object = null;
        JSONArray jarray = new JSONArray();
        for(PositionInEntity pie: positionInEntityList){
            object = new JSONObject();
            object.put("id", pie.getId());
            object.put("createdAt", appUtil.formatJSDate(pie.getCreatedAt()));
            object.put("positionName", pie.getPositionName());
            object.put("shortName", pie.getShortName());
            object.put("isActive", pie.isIsActive());
            jarray.add(object);
            
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", positionInEntityList.size());
        wrapper.put("data", jarray);
        return wrapper.toString();
    }
}
