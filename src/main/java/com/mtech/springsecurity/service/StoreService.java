/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.StoreDao;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Store;
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
public class StoreService {
    @Autowired
    StoreDao storeDao;
    
    public Store saveStore(Store store){
        store = storeDao.saveStore(store);
        return store;
    }
    
    public String getStoreList(SMEEntity entity){
        List<Store> storeList = storeDao.getStoreList(entity);
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for(Store store:storeList){
            object = new JSONObject();
            object.put("id", store.getId());
            object.put("storeLocation", store.getStoreLocation());
            object.put("storeName", store.getStoreName());
            object.put("storeNumber", store.getStoreNumber());
            jarray.add(object);
        }
        JSONObject wrapper = new  JSONObject();
        wrapper.put("data", jarray);
        wrapper.put("success", true);
        wrapper.put("totalProperty", storeList.size());
        return wrapper.toString();
    }
    
    public String findStore(Long id){
        Store store = storeDao.findStore(id);
        JSONObject object = new  JSONObject();
        object.put("id", store.getId());
        object.put("storeName", store.getStoreName());
        object.put("storeNumber", store.getStoreNumber());
        object.put("storeLocation", store.getStoreLocation());
        
        JSONObject wrapper = new  JSONObject();
        wrapper.put("data", object);
        wrapper.put("success", true);
        return wrapper.toString();
    }
}
