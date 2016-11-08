/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.TownCodeDao;
import com.mtech.springsecurity.model.PostalCode;
import com.mtech.springsecurity.model.TownCode;
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
public class TownCodeService {
    @Autowired
    TownCodeDao codeDao;
    
    public TownCode saveTownCode(TownCode code){
        TownCode savedCode = codeDao.saveTownCode(code);
        return savedCode;
    }
    
     public String getTownCodes(){
        List<TownCode> users = codeDao.getTownCodes();
        JSONObject jObj = new JSONObject();
        JSONArray array = new JSONArray();
        for (TownCode u : users) {
            JSONObject jObjhold = new JSONObject();
            jObjhold.put("id", u.getId());
            jObjhold.put("townCode", u.getTownCode());
            jObjhold.put("townName", u.getTownName());
            array.add(jObjhold);
        }
        jObj.put("data", array);
        return jObj.toString();
    }
}
