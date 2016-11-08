/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;

/**
 *
 * @author derek
 */
public interface SMEEntityDao {
    
    SMEEntity saveSMEEntity(SMEEntity entity);
    
    SMEEntity findSMEEntity();
    
    SMEEntity findSMEEntity(Long id);
    
    SMEEntity findSMEEntity(String registeredName);
    
    public java.util.List<SMEEntity> getSMEEntityList();
    
}
