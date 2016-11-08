/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.PositionInEntity;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class PositionInEntityDaoImpl extends AbstractDao<Long, PositionInEntity> implements PositionInEntityDao{

    public PositionInEntity savePositionInEntity(PositionInEntity positionInEntity) {
        persist(positionInEntity);
        return positionInEntity;
    }

    public List<PositionInEntity> getPositionInEntityList() {
        return getList();
    }
    
    public PositionInEntity findByPositionName(String positionName){
        Session sess1 = getSession();
        Query createQuery = sess1.createQuery("from PositionInEntity pie where pie.positionName=:positionName");
        createQuery.setParameter("positionName", positionName);
        java.util.List<PositionInEntity> list = createQuery.list();
        
  //      sess1.close();
        if(!list.isEmpty()){
            return list.get(0);
        }
        return null;
    }
    
}
