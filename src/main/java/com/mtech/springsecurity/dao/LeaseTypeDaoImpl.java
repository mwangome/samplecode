/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.LeaseType;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class LeaseTypeDaoImpl extends AbstractDao<Long, LeaseType> implements LeaseTypeDao{

    public LeaseType saveLeaseType(LeaseType leaseType) {
        if(leaseType.getId() == null){
            persist(leaseType);
        }else{
            merge(leaseType);
        }
        return leaseType;
    }

    public List<LeaseType> getLeaseTypeList() {
        return getList();
    }

    public LeaseType findLeaseType(Long id) {
        return getByKey(id);
    }
    
    public LeaseType findLeaseType(String leaseTypeName) {
        Session session1 = getSession();
       Query createQuery = session1.createQuery("from LeaseType lt where lt.leaseTypeName = :leaseTypeName");
        List<LeaseType> list = createQuery.setParameter("leaseTypeName", leaseTypeName).list();
        if(!list.isEmpty()){
            //session1.close();
            return list.get(0);
        }
        //session1.close();
        return null;
    }
    
}
