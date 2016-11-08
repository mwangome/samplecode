/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.SMESiteDao;
import com.mtech.springsecurity.model.SMESite;
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
public class SMESiteService {

    @Autowired
    SMESiteDao siteDao;

    @Autowired
    AppUtil appUtil;

    public SMESite saveSite(SMESite site) {
        siteDao.saveSite(site);
        return site;
    }

    public String getSMEList() {
        List<SMESite> sites = siteDao.getSites();
        JSONArray jarray = new JSONArray();
        for (SMESite site : sites) {
            JSONObject jobj = new JSONObject();
            jobj.put("id", site.getId());
            jobj.put("registeredName", site.getSmeEntity() == null ? "" : site.getSmeEntity().getRegisteredName());
            jobj.put("accessType", site.getAccessType());
            jobj.put("dateOccupied", appUtil.formatJSDate(site.getDateOccupied()));
            jobj.put("structureType", site.getStructureType());
            jobj.put("phoneNumber", site.getPhoneNumber());
            jarray.add(jobj);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalCount", sites.size());
        wrapper.put("data", jarray);
        return wrapper.toString();
    }

    public String findSmeSite(Long id) {
        SMESite site = siteDao.findSite(id);
        JSONObject jobj = new JSONObject();
        jobj.put("id", site.getId());
        jobj.put("registeredName", site.getSmeEntity() == null ? "" : site.getSmeEntity().getRegisteredName());
        jobj.put("accessType", site.getAccessType());
        jobj.put("dateOccupied", appUtil.formatJSDate(site.getDateOccupied()));
        jobj.put("structureType", site.getStructureType());
        jobj.put("phoneNumber", site.getPhoneNumber());
        jobj.put("floorSize", site.getFloorSize());
        jobj.put("emailAddress", site.getEmailAddress());
        jobj.put("postCode", site.getPostCode());
        jobj.put("occupationType", site.getOccupationType());
        jobj.put("postNumber", site.getPostNumber());
        jobj.put("townCode", site.getTownCode());
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("totalCount", 1);
        wrapper.put("data", jobj);
        return wrapper.toString();
    }
}
