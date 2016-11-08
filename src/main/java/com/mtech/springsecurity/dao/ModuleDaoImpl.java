/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Module;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.User;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author mwangome
 */
@Repository
public class ModuleDaoImpl extends AbstractDao<Long , Module> implements ModuleDao{

    public Module saveModule(Module module) {
        if(module.getId() == null){
            persist(module);
        }else{
            merge(module);
        }
        return module;
    }

    public java.util.List<Module> getModules(SMEEntity entity) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from Module m where m.entity.id = :id");
        List list = createQuery.setParameter("id", entity.getId()).list();        
      //  session1.close();
        return list;
    }
    
    public java.util.Set<User> getModuleUsers(String moduleName, SMEEntity entity){
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from Module m where m.entity.id = :id and m.moduleName = :moduleName");
        createQuery.setParameter("id", entity.getId());
        createQuery.setParameter("moduleName", moduleName);
        List<Module> list = createQuery.list();
        java.util.HashSet<User> usrList = new java.util.HashSet();
        
        if(!list.isEmpty()){
            Module module = list.get(0);
            Set<User> users = module.getUsers();
         //   session1.close();
            return users;
        }
      //  session1.close();
        return usrList;
    }

    public Module findModule(String moduleName, SMEEntity entity){
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from Module m where m.entity.id = :id and m.moduleName = :moduleName");
        createQuery.setParameter("id", entity.getId());
        createQuery.setParameter("moduleName", moduleName);
        List<Module> list = createQuery.setParameter("id", entity.getId()).list();       
        if(!list.isEmpty()){
        //    session1.close();
            return list.get(0);
        }
        //session1.close();
        return null;
    }
    
}
