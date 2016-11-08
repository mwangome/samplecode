/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.RolesDao;
import com.mtech.springsecurity.dao.UserDao;
import com.mtech.springsecurity.model.RolesTasks;
import com.mtech.springsecurity.model.User;
import com.mtech.springsecurity.enumerate.UserProfileType;
import com.mtech.springsecurity.model.Role;
import com.mtech.springsecurity.util.AppUtil;
import com.mtech.springsecurity.util.IdentifierGenerator;
import java.util.List;
import java.util.Set;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class AppService {

    Logger log = Logger.getLogger(AppService.class);

    @Autowired
    UserService userService;

    @Autowired
    UserDao userDao;

    @Autowired
    RolesDao rolesDao;

    @Autowired
    IdentifierGenerator ig;
    
    @Autowired
    AppUtil appUtil;
    
    public String getUsers() {
        List<User> users = userDao.getUsers();
        JSONObject jObj = new JSONObject();
        JSONArray array = new JSONArray();
        for (User u : users) {
            JSONObject jObjhold = new JSONObject();
            jObjhold.put("id", u.getId());
            jObjhold.put("firstName", u.getFirstName());
            jObjhold.put("lastName", u.getLastName());
            jObjhold.put("userName", u.getUsername());
            jObjhold.put("state", u.getState());
            jObjhold.put("email", u.getEmail());

            /**
             * get user profile
             */
            Set<Role> userProfiles = u.getUserRoles();
            java.util.Iterator<Role> iterator = userProfiles.iterator();
            log.warn("roles has more::" + iterator.hasNext());
            while (iterator.hasNext()) {
                Role up = iterator.next();
                jObjhold.put("role", up.getRoleName());
            }

            array.add(jObjhold);
        }
        jObj.put("data", array);
        return jObj.toString();
    }

    public String getUser(Long userId) {
        User u = userService.findById(userId);
        JSONObject wrapper = new JSONObject();
        JSONObject jObjhold = new JSONObject();
        String passPhrase = ig.nextId();
        jObjhold.put("id", u == null?"":u.getId());
        jObjhold.put("firstName", u == null?"":u.getFirstName());
        jObjhold.put("lastName", u == null?"":u.getLastName());
        jObjhold.put("userName", u == null?"":u.getUsername());
        jObjhold.put("state", u == null?"":u.getState());
        jObjhold.put("email", u == null?"":u.getEmail());
        jObjhold.put("username", u == null?"":u.getUsername());
        jObjhold.put("password", u == null?passPhrase:u.getPassword());
        jObjhold.put("pass-cfm", u == null?passPhrase:u.getPassword());
        try{
            jObjhold.put("statusDate",u.getStatusDate() == null? "":appUtil.formatJSDate(u.getStatusDate()));
        }catch(Exception x){
            log.warn(">>>> " + (appUtil == null));
        }
        jObjhold.put("registeredName", u == null?"":u.getSmeEntity() == null?"":u.getSmeEntity().getRegisteredName());
        jObjhold.put("branchName", u == null?"":u.getBranch() == null?"":u.getBranch().getBranchName());
        /**
         * get user profile
         */
        Set<Role> userProfiles = new java.util.HashSet();
        userProfiles = u == null?userProfiles:u.getUserRoles();
        java.util.Iterator<Role> iterator = userProfiles.iterator();
        log.warn("roles has more::" + iterator.hasNext());
        while (iterator.hasNext()) {
            Role up = iterator.next();
            jObjhold.put("role", up.getRoleName());
        }
        wrapper.put("data", jObjhold);
        wrapper.put("totalCount", 1);
        wrapper.put("success", true);

        return wrapper.toString();
    }

    public String getRolesTasks(UserProfileType type) {
        List<RolesTasks> users = rolesDao.getTasks(type);
        JSONObject jObj = new JSONObject();
        JSONArray array = new JSONArray();
        for (RolesTasks u : users) {
            JSONObject jObjhold = new JSONObject();
            jObjhold.put("id", u.getId());
            jObjhold.put("task", u.getTasks());
            jObjhold.put("type", u.getType());
            array.add(jObjhold);
        }
        jObj.put("data", array);
        return jObj.toString();
    }

}
