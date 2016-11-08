/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.util;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.exolab.castor.types.Date;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 *
 * @author derek
 */
@Component
public class AppUtil {
    static final Logger log = Logger.getLogger(AppUtil.class.getName());
    /**
     * 
     * @param date
     * @return 
     */
    public String formatJSDate(java.util.Date date){
        if(date != null){
            SimpleDateFormat sdf = new SimpleDateFormat("MM-dd-yyyy");
            log.warn("\n\tformatted date::" + sdf.format(date));
            return sdf.format(date);
        }else{
            return "";
        }
    }
    
     public String formatJSDate(java.util.Date date, String format){
        if(date != null){
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            return sdf.format(date);
        }else{
            return "";
        }
    }
    JSONObject object = null;
    public JSONObject streamResponse(String itemSaved){
        object = new JSONObject();
        object.put("success", true);
        object.put("msg", "You have successfully saved " + itemSaved + "!");
        return object;
    }
    
    public boolean passwordMatch(String raw, String encoded){
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        boolean matches = passwordEncoder.matches(raw, encoded);
        return matches;
    }
    
    public String encode(String raw){
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String matches = passwordEncoder.encode(raw);
        return matches;
    }
    
    public String formatNumber(java.math.BigDecimal number){
        java.text.DecimalFormat myFormatter = new java.text.DecimalFormat("#, ###.00");
        return number.compareTo(BigDecimal.ZERO)<0?"(" +myFormatter.format(number)+ ")":myFormatter.format(number);
    }
    
    public double generateRandomNumber(){
        return Math.random();
    }
    
    public static void main(String args[]) throws ParseException{
        AppUtil app = new AppUtil();
        Object obj = Date.parse("2014-08-31 23:59:59");
        Date parse = (Date)Date.parse("2014-08-31 23:59:59");
        
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        System.out.println(parse);
        System.out.println(obj);
        System.out.println(sdf.parse("2014-08-31 23:59:59"));
    }
    
}
