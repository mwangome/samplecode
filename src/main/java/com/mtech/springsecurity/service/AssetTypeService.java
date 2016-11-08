/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AssetTypeDao;
import com.mtech.springsecurity.model.AssetType;
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
public class AssetTypeService {

    @Autowired
    AssetTypeDao atDao;

    @Autowired
    AppUtil appUtil;

    public AssetType saveAssetType(AssetType assetType) {
        atDao.saveAssetType(assetType);
        return assetType;
    }

    public String getAssetTypeList() {
        List<AssetType> assetTypeList = atDao.getAssetTypeList();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (AssetType at : assetTypeList) {
            object = new JSONObject();
            object.put("id", at.getId());
            object.put("assetTypeName", at.getAssetTypeName());
            object.put("depreciationRate", at.getDepreciationRate());
            object.put("isActive", at.isIsActive());
            object.put("createdAt", appUtil.formatJSDate(at.getCreatedAt()));
            jarray.add(object);

        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", assetTypeList.size());
        wrapper.put("data", jarray);
        return wrapper.toString();
    }

    public String findAssetType(Long id) {
        AssetType at = atDao.findAssetType(id);
        JSONObject object = new JSONObject();
        object.put("id", at.getId());
        object.put("assetTypeName", at.getAssetTypeName());
        object.put("depreciationRate", at.getDepreciationRate());
        object.put("isActive", at.isIsActive());
        object.put("createdAt", appUtil.formatJSDate(at.getCreatedAt()));

        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        wrapper.put("data", object);
        return wrapper.toString();
    }
}
