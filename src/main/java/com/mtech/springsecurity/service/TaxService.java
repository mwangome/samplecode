/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.TaxDao;
import com.mtech.springsecurity.model.Tax;
import com.mtech.springsecurity.util.AppUtil;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author mwangome
 */
@Service
public class TaxService {

    @Autowired
    TaxDao taxDao;

    @Autowired
    AppUtil appUtil;

    public Tax saveTax(Tax tax) {
        taxDao.saveTax(tax);
        return tax;
    }

    public String getTaxList() {
        List<Tax> taxesList = taxDao.getTaxesList();
        JSONArray array = new JSONArray();
        JSONObject object;
        for (Tax tax : taxesList) {
            object = new JSONObject();
            object.put("id", tax.getId());
            object.put("createdAt", appUtil.formatJSDate(tax.getCreatedAt()));
            object.put("isActive", tax.getIsActive());
            object.put("tax", tax.getTax());
            object.put("taxType", tax.getTaxType());
            array.add(object);
        }

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", array);
        wrapper.put("success", true);
        wrapper.put("totalProperty", taxesList.size());
        return wrapper.toString();
    }

    public String findTax(Long id) {
        Tax tax = taxDao.findTax(id);
        JSONObject object;
        object = new JSONObject();
        object.put("id", tax.getId());
        object.put("createdAt", appUtil.formatJSDate(tax.getCreatedAt()));
        object.put("isActive", tax.getIsActive());
        object.put("tax", tax.getTax());
        object.put("taxType", tax.getTaxType());

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", object);
        wrapper.put("success", true);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
}
