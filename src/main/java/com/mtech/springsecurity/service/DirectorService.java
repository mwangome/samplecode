/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.DirectorDao;
import com.mtech.springsecurity.model.Director;
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
public class DirectorService {
    @Autowired
    DirectorDao directorDao;
    
    public Director saveDirector(Director director){
        directorDao.saveDirector(director);
        return director;
    }
    public String getDirectorsList(){   
        List<Director> listOfDirectors = directorDao.getListOfDirectors();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for(Director dir: listOfDirectors){
            object = new JSONObject();
            object.put("id", dir.getId());
            object.put("directorName", dir.getDirectorName());
            object.put("identityNumber", dir.getIdentityNumber());
            object.put("identityType", dir.getIdentityType().getIdTypeName());
            object.put("phoneNumber", dir.getPhoneNumber());
            object.put("positionInEntity", dir.getPositionInEntity().getPositionName());
            object.put("residenceLease", dir.getResidenceLease());
            object.put("shareholding", dir.getShareholding());
            object.put("residenceTown", dir.getResidenceTown());
            object.put("shareholdingType", dir.getShareholdingType().getShareholdingTypeName());
            jarray.add(object);
        }
        
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", listOfDirectors.size());
        wrapper.put("data", jarray);
        return wrapper.toString();
    }
}
