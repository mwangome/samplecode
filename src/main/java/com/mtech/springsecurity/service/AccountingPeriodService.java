/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AccountingPeriodDao;
import com.mtech.springsecurity.enumerate.PeriodStatus;
import com.mtech.springsecurity.model.AccountingPeriod;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import com.mtech.springsecurity.util.NumberValue;
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
public class AccountingPeriodService {

    static int NO_MONTHS = 12;
    
    String dateFormat = "dd/MM/yyyy";
    
    @Autowired
    AccountingPeriodDao apDao;
    
    @Autowired
    AppUtil appUtil;
    
    @Autowired
    NumberValue nv;
    
    public void initPeriods(SMEEntity entity, java.util.Date startDate) {
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
        java.util.Date startOfPeriod;
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        java.util.Calendar calendar2 = java.util.Calendar.getInstance();
        calendar.setTime(startDate);
        startOfPeriod = calendar.getTime();
        System.out.println(sdf.format(startOfPeriod));

        java.util.Date endOfPeriod;
        calendar.set(
                calendar.get(java.util.Calendar.YEAR) + 1,
                calendar.get(java.util.Calendar.MONTH) - 1,
                calendar.get(java.util.Calendar.DAY_OF_MONTH)
        );
        calendar.set(java.util.Calendar.DAY_OF_MONTH, calendar.getActualMaximum(java.util.Calendar.DAY_OF_MONTH));
        endOfPeriod = calendar.getTime();

        System.out.println(sdf.format(endOfPeriod));
        System.out.println("---");
        
        Integer batch = apDao.getMaxBatch(entity);
        try{
            batch = batch + 1;
        }catch(Exception x){
            System.out.println(x);
            batch = 1;
        }
        
        java.util.ArrayList<AccountingPeriod> list = new java.util.ArrayList();
        AccountingPeriod ap = null;
        for (int i = 0; i < NO_MONTHS; i++) {
            ap = new AccountingPeriod();
            calendar.setTime(startOfPeriod);
            calendar.set(
                    calendar.get(java.util.Calendar.YEAR),
                    calendar.get(java.util.Calendar.MONTH) + i,
                    calendar.get(java.util.Calendar.DAY_OF_MONTH));
            calendar2.setTime(calendar.getTime());
            calendar2.set(java.util.Calendar.DAY_OF_MONTH, calendar2.getActualMaximum(java.util.Calendar.DAY_OF_MONTH));
            System.out.println(sdf.format(calendar.getTime()) + " ---> " + sdf.format(calendar2.getTime()));
            ap.setSequence(i);
            ap.setStartDate(calendar.getTime());
            ap.setEndDate(calendar2.getTime());
            ap.setStatus(PeriodStatus.OPEN);
            ap.setEntity(entity);
            ap.setBatchNumber(batch);
            list.add(ap);
        }
        
        apDao.saveAccountingPeriods(list);
    }

    public String getPeriods(SMEEntity entity){
        List<AccountingPeriod> periodsList = apDao.getPeriodsList(entity);
        JSONArray array = new JSONArray();
        JSONObject object = null;
        for(AccountingPeriod ap:periodsList){
            object = new JSONObject();
            object.put("id", ap.getId());
            object.put("endDate", appUtil.formatJSDate(ap.getEndDate(), dateFormat));
            object.put("startDate", appUtil.formatJSDate(ap.getStartDate(), dateFormat));
            object.put("status", ap.getStatus());
            object.put("sequence", ap.getSequence());
            array.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", array);
        wrapper.put("totalProperty", periodsList.size());
        return wrapper.toString();
    }
    
    public AccountingPeriod getCurrentAccountingPeriod(SMEEntity entity){
        return apDao.getCurrentPeriod(entity);
    }
    
    public java.util.Date getLastClosedDate(SMEEntity entity){
        AccountingPeriod currentDateClosed = apDao.getCurrentDateClosed(entity);
        return currentDateClosed.getEndDate();
    }
}
