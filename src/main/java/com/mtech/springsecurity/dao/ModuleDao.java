/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Module;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.User;

/**
 *
 * @author mwangome
 */
public interface ModuleDao {
    
    Module  saveModule( Module module);
    
    java.util.List<Module> getModules(SMEEntity entity);
    
    Module findModule(String moduleName, SMEEntity entity);
    
    public java.util.Set<User> getModuleUsers(String moduleName, SMEEntity entity);
}
