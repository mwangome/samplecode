/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.ShareholdingTypeDao;
import com.mtech.springsecurity.model.ShareholdingType;
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
public class ShareholdingTypeService {

    @Autowired
    ShareholdingTypeDao shareholdingTypeDao;

    @Autowired
    AppUtil appUtil;

    public ShareholdingType saveShareholdingType(ShareholdingType shareholdingType) {
        shareholdingType = shareholdingTypeDao.saveShareholdingType(shareholdingType);
        return shareholdingType;
    }

    public String getShareholdingTypesList() {
        List<ShareholdingType> shareholdingTypeList = shareholdingTypeDao.getShareholdingTypeList();
        JSONArray jarray = new JSONArray();
        for (ShareholdingType sht : shareholdingTypeList) {
            JSONObject obj = new JSONObject();
            obj.put("createdAt", appUtil.formatJSDate(sht.getCreatedAt()));
            obj.put("id", sht.getId());
            obj.put("shareholdingTypeName", sht.getShareholdingTypeName());
            obj.put("shortName", sht.getShortName());
            obj.put("isActive", sht.isIsActive());
            jarray.add(obj);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", shareholdingTypeList.size());
        wrapper.put("data", jarray);
        return wrapper.toString();
    }

    public String findShareholdingType(Long id) {
        ShareholdingType sht = shareholdingTypeDao.findShareholdingType(id);
        JSONObject obj = new JSONObject();
        obj.put("createdAt", appUtil.formatJSDate(sht.getCreatedAt()));
        obj.put("id", sht.getId());
        obj.put("shareholdingTypeName", sht.getShareholdingTypeName());
        obj.put("shortName", sht.getShortName());
        obj.put("isActive", sht.isIsActive());
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        wrapper.put("data", obj);
        return wrapper.toString();
    }
}
