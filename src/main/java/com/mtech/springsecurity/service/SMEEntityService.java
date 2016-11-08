package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class SMEEntityService {

    @Autowired
    SMEEntityDao entityDao;

    @Autowired
    AppUtil util;

    public SMEEntity saveSMEEntity(SMEEntity entity) {
        entityDao.saveSMEEntity(entity);
        return entity;
    }

    public String getSMEDetailsJSON() {
        SMEEntity idet = entityDao.findSMEEntity();
        JSONObject job = new JSONObject();
        try {
            job.put("totalCount", 1);
            job.put("success", true);
        } catch (JSONException jx) {
            System.out.println(jx.getMessage());
        }

        net.sf.json.JSONObject jobi = new net.sf.json.JSONObject();

        try {
            jobi.put("id", idet.getId());
            jobi.put("createdAtDisplayed", util.formatJSDate(idet.getCreatedAt()));
            jobi.put("createdAt", util.formatJSDate(idet.getCreatedAt()));
            jobi.put("registeredName", idet.getRegisteredName());
            jobi.put("tradingName", idet.getTradingName());
            jobi.put("regNumber", idet.getRegNumber());
            jobi.put("regDateDisplayed", util.formatJSDate(idet.getRegDate()));
            jobi.put("accessName", idet.getLegalType());

            jobi.put("physicalAddress", idet.getPhysicalAddress());
            jobi.put("buildingLr", idet.getBuildingLr());
            jobi.put("floorNumber", idet.getFloorNumber());
            jobi.put("streetName", idet.getStreetName());
            
            jobi.put("code", idet.getCode());
            
            jobi.put("townCode", idet.getTownCode());
            jobi.put("postCode", idet.getPostCode());
            jobi.put("postNumber", idet.getPostNumber());
            jobi.put("emailAddress", idet.getEmailAddress());
            jobi.put("phoneNumber", idet.getPhoneNumber());
            jobi.put("enabled", idet.getEnabled());
        } catch (Exception jx) {
            System.out.println(jx.getMessage());
        }

        try {
            job.put("data", jobi);
        } catch (JSONException jx) {
            System.out.println(jx.getMessage());
        }

        return job.toString();
    }

    public String findSMEDetails(Long id) {
        SMEEntity idet = entityDao.findSMEEntity(id);
        JSONObject job = new JSONObject();
        try {
            job.put("totalCount", 1);
            job.put("success", true);
        } catch (JSONException jx) {
            System.out.println(jx.getMessage());
        }

        net.sf.json.JSONObject jobi = new net.sf.json.JSONObject();

        try {
            jobi.put("id", idet.getId());
            jobi.put("createdAtDisplayed", util.formatJSDate(idet.getCreatedAt()));
            jobi.put("createdAt", util.formatJSDate(idet.getCreatedAt()));
            jobi.put("registeredName", idet.getRegisteredName());
            jobi.put("tradingName", idet.getTradingName());
            jobi.put("regNumber", idet.getRegNumber());
            jobi.put("regDateDisplayed", util.formatJSDate(idet.getRegDate()));
            jobi.put("accessName", idet.getLegalType());

            jobi.put("physicalAddress", idet.getPhysicalAddress());
            jobi.put("buildingLr", idet.getBuildingLr());
            jobi.put("floorNumber", idet.getFloorNumber());
            jobi.put("streetName", idet.getStreetName());
            
            jobi.put("code", idet.getCode());

            jobi.put("townCode", idet.getTownCode());
            jobi.put("postCode", idet.getPostCode());
            jobi.put("postNumber", idet.getPostNumber());
            jobi.put("emailAddress", idet.getEmailAddress());
            jobi.put("phoneNumber", idet.getPhoneNumber());
            jobi.put("enabled", idet.getEnabled());
        } catch (Exception jx) {
            System.out.println(jx.getMessage());
        }

        try {
            job.put("data", jobi);
        } catch (JSONException jx) {
            System.out.println(jx.getMessage());
        }

        return job.toString();
    }
    
    public String getSMEDetailsComboViewJSON() {
        List<SMEEntity> smeEntityList = entityDao.getSMEEntityList();
        JSONObject job = new JSONObject();
        try {
            job.put("totalCount",smeEntityList.size());
            job.put("success", true);
        } catch (JSONException jx) {
            System.out.println(jx.getMessage());
        }

        net.sf.json.JSONObject jobi = new net.sf.json.JSONObject();
        JSONArray jArray = new JSONArray();
        for (SMEEntity idet : smeEntityList) {
            try {
                jobi.put("id", idet.getId());
                jobi.put("createdAtDisplayed", util.formatJSDate(idet.getCreatedAt()));
                jobi.put("createdAt", util.formatJSDate(idet.getCreatedAt()));
                jobi.put("registeredName", idet.getRegisteredName());
                jobi.put("tradingName", idet.getTradingName());
                jobi.put("regNumber", idet.getRegNumber());
                jobi.put("regDateDisplayed", util.formatJSDate(idet.getRegDate()));
                jobi.put("accessName", idet.getLegalType());

                jobi.put("physicalAddress", idet.getPhysicalAddress());
                jobi.put("buildingLr", idet.getBuildingLr());
                jobi.put("floorNumber", idet.getFloorNumber());
                jobi.put("streetName", idet.getStreetName());

                jobi.put("townCode", idet.getTownCode());
                jobi.put("postCode", idet.getPostCode());
                jobi.put("postNumber", idet.getPostNumber());
                jobi.put("emailAddress", idet.getEmailAddress());
                jobi.put("phoneNumber", idet.getPhoneNumber());
                jobi.put("enabled", idet.getEnabled());
                jArray.add(jobi);
            } catch (Exception jx) {
                System.out.println(jx.getMessage());
            }
        }

        try {
            job.put("data", jArray);
        } catch (JSONException jx) {
            System.out.println(jx.getMessage());
        }

        return job.toString();
    }
}
