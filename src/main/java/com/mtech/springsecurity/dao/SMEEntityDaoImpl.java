/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class SMEEntityDaoImpl extends AbstractDao<Long, SMEEntity> implements SMEEntityDao{    
    Logger log = Logger.getLogger(SMEEntityDaoImpl.class.getName());
    public SMEEntity saveSMEEntity(SMEEntity entity) {  
        SMEEntity entityExist = findSMEEntity();
        if(entityExist == null){
            log.warn("saving new entity ...");
            persist(entity);
        }else{
            log.warn("updating entity ...");
            merge(entity);
	  //  session.close();
        }	
        return entity;
    }

    public SMEEntity findSMEEntity() {
        java.util.List<SMEEntity> list = getList();
        if(list.isEmpty()) {
            return null;
        }else{
            return list.get(0);
        }
    }
    
    public java.util.List<SMEEntity> getSMEEntityList() {
        java.util.List<SMEEntity> list = getList();
        return list;
    }
    
    public SMEEntity findSMEEntity(String registeredName) {
        Session sess1 = getSession();
        
        Query createQuery = sess1.createQuery("from SMEEntity sme where sme.registeredName = :registeredName");
        createQuery.setParameter("registeredName", registeredName);
        java.util.List<SMEEntity> list = createQuery.list();
        
   //     sess1.close();
        if(list.isEmpty()) {
            return null;
        }else{
            return list.get(0);
        } 
    }

    public SMEEntity findSMEEntity(Long id) {
        return getByKey(id);
    }
    
}
