/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.IdentityType;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class IdentityTypeDaoImpl extends AbstractDao<Long, IdentityType> implements IdentityTypeDao{

    public IdentityType saveIdentityType(IdentityType identityType) {
        persist(identityType);
        return identityType;
    }

    public List<IdentityType> getIdentityTypesList() {
        return getList();
    }

    public IdentityType findIdentityType(String idTypeName) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from IdentityType it where it.idTypeName=:idTypeName");
        createQuery.setParameter("idTypeName", idTypeName);
        List<IdentityType> list = createQuery.list();
        
         
        if(!list.isEmpty()){
            //session1.close();
            return list.get(0);
        }
       // session1.close();
        return null;
    }
    
}
