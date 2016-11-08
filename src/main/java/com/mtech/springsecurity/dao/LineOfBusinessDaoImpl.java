/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.LineOfBusiness;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class LineOfBusinessDaoImpl extends AbstractDao<Long, LineOfBusiness> implements LineOfBusinessDao{

    public LineOfBusiness saveLineOfBusiness(LineOfBusiness lineOfBusiness) {
        if(lineOfBusiness.getId() == null){
            persist(lineOfBusiness);
        }else{
            merge(lineOfBusiness);
        }
        return lineOfBusiness;
    }

    public List<LineOfBusiness> getLineOfBusinessList(SMEEntity entity) {
        java.util.List<LineOfBusiness> list = getSession()
                .createQuery("from LineOfBusiness lob where lob.smeEntity.id = :entityId")
                .setParameter("entityId", entity.getId()).list();
        return list;
    }
    
}
