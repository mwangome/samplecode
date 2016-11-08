/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.model.State;
import com.mtech.springsecurity.enumerate.UserProfileType;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class EnumService {
    public String getStatuses(){
        State[] states = State.getStatuses();
        JSONObject wrapper = new JSONObject();
        JSONArray jarray = new JSONArray();
        for(State s: states){
            JSONObject jobji = new JSONObject();
            jobji.put("state", s.getState());
            jarray.add(jobji);
        }
        wrapper.put("data", jarray);
        return wrapper.toString();
    }
    
    public String getRoles(){
        UserProfileType[] states = UserProfileType.getUserProfiles();
        JSONObject wrapper = new JSONObject();
        JSONArray jarray = new JSONArray();
        for(UserProfileType s: states){
            JSONObject jobji = new JSONObject();
            jobji.put("role", s.getUserProfileType());
            jobji.put("code", s);
            jobji.put("enabled", false);
            jarray.add(jobji);
        }
        wrapper.put("data", jarray);
        wrapper.put("success", true);
        return wrapper.toString();
    }
    
    public static void main(String[] args){
        System.out.println(new EnumService().getStatuses());
    }
}
