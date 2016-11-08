/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.PostalCodesDao;
import com.mtech.springsecurity.model.PostalCode;
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
public class PostalCodesService {
    
    @Autowired
    PostalCodesDao codesDao;
    
    @Autowired
    AppUtil appUtil;
    
    public void savePostalCodes(PostalCode postalCode){
        codesDao.savePostalCode(postalCode);
    }
    
    public String getPostalCodes(){
        List<PostalCode> users = codesDao.getPostalCodes();
        JSONObject jObj = new JSONObject();
        JSONArray array = new JSONArray();
        for (PostalCode u : users) {
            JSONObject jObjhold = new JSONObject();
            jObjhold.put("id", u.getId());
            jObjhold.put("codeName", u.getCodeName());
            jObjhold.put("createdAt", appUtil.formatJSDate(u.getCreatedAt()));
            jObjhold.put("isActive", u.getIsActive());
            jObjhold.put("postCode", u.getPostCode());
            array.add(jObjhold);
        }
        jObj.put("data", array);
        return jObj.toString();
    }
}
