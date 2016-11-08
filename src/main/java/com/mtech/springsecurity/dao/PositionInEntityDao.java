/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.PositionInEntity;

/**
 *
 * @author derek
 */
public interface PositionInEntityDao {
    
    PositionInEntity savePositionInEntity(PositionInEntity positionInEntity);
    
    java.util.List<PositionInEntity> getPositionInEntityList();
    
    public PositionInEntity findByPositionName(String positionName);
    
}
