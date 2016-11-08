/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.SupplierTypeDao;
import com.mtech.springsecurity.model.SupplierType;
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
public class SupplierTypeService {

    @Autowired
    SupplierTypeDao stDao;

    public SupplierType saveSupplierType(SupplierType st) {
        stDao.saveSupplierType(st);
        return st;
    }

    public String getSupplierTypeList() {
        List<SupplierType> supplierTypeList = stDao.getSupplierTypeList();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (SupplierType st : supplierTypeList) {
            object = new JSONObject();
            object.put("supplierType", st.getSupplierType());
            object.put("typeName", st.getTypeName());
            object.put("id", st.getId());
            object.put("registeredName", st.getSmeEntity() == null ? "" : st.getSmeEntity().getRegisteredName());
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", supplierTypeList.size());
        return wrapper.toString();
    }

    public String findSupplierType(Long id) {
        SupplierType st = stDao.findSupplierType(id);
        JSONObject object = new JSONObject();
        object.put("supplierType", st.getSupplierType());
        object.put("typeName", st.getTypeName());
        object.put("id", st.getId());
        object.put("registeredName", st.getSmeEntity() == null ? "" : st.getSmeEntity().getRegisteredName());

        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", object);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
}
