/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.ModuleDao;
import com.mtech.springsecurity.dao.UserDao;
import com.mtech.springsecurity.enumerate.Modules;
import com.mtech.springsecurity.model.Module;
import com.mtech.springsecurity.model.Role;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.User;
import com.mtech.springsecurity.model.UserProfile;
import com.mtech.springsecurity.util.AppUtil;
import java.util.Set;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author mwangome
 */
@Service
public class ModuleService {
    @Autowired
    UserDao userDao;
    
    @Autowired
    ModuleDao modDao;
    
    @Autowired
    AppUtil appUtil;
    public String getModules(){
        String[] moduleDescriptions = Modules.getModuleDescriptions();
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        int counter = 0;
        for(String module: moduleDescriptions){
            object = new JSONObject();
            object.put("id", counter++);
            object.put("moduleName", module);            
            object.put("moduleCode", Modules.getModule(module));
            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("totalProperty", moduleDescriptions.length);
        wrapper.put("data", jarray);
        return wrapper.toString();        
    }
    
    public String saveModule(Module module, JSONArray data){
        
        java.util.Set<User> users = new java.util.HashSet();
        for (Object data1 : data) {
            long id = Long.parseLong(data1.toString());
            User user = userDao.findById(id);
            users.add(user);
        }
        module.setUsers(users);
        modDao.saveModule(module);
        return "{\"success\":true, \"msg\":\"You have successfully saved a module!\"}";
    }
    
    public String getModelUsers(String moduleName, SMEEntity entity){
        java.util.Set<User> users = modDao.getModuleUsers(moduleName, entity);
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
            while (iterator.hasNext()) {
                Role up = iterator.next();
                jObjhold.put("role", up.getRoleName());
            }

            array.add(jObjhold);
        }
        jObj.put("data", array);
        return jObj.toString();
    }
    
    public String findModule(String moduleName, SMEEntity entity){
        Module module = modDao.findModule(moduleName, entity);
        JSONObject object = new JSONObject();
        
        object.put("id", module.getId());
        object.put("registeredName", module.getEntity().getRegisteredName());
        object.put("enabled", module.getEnabled());
        object.put("path", module.getPath());
        object.put("moduleCode", module.getModuleCode());
        object.put("effectiveDate", appUtil.formatJSDate(module.getEffectiveDate()));
        
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", object);
        return wrapper.toString();
    }
    
    public boolean isUserEnabled(String userName, java.util.Set<User> users){
        for(User user: users){
            if(user.getUsername().equalsIgnoreCase(userName)){
                return true;
            }
        }
        return false;
    }
}
