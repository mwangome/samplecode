/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.UnitOfIssue;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class UnitOfIssueDaoImpl extends AbstractDao<Long, UnitOfIssue> implements UnitOfIssueDao{

    public UnitOfIssue saveUnitOfIssue(UnitOfIssue unitOfIssue) {
        if(unitOfIssue.getId() == null){
            persist(unitOfIssue);
        }else{
            merge(unitOfIssue);
        }
        return unitOfIssue;
    }

    public List<UnitOfIssue> getUnitOfIssueList() {
        return getList();
    }

    public UnitOfIssue findUnitOfIssue(String uoiName) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from UnitOfIssue uoi where uoi.uoiName = :uoiName");
        createQuery.setParameter("uoiName", uoiName);
        java.util.List<UnitOfIssue> list = createQuery.list();
        if(list.isEmpty()) {
     //       session1.close();
            return null;
        }else{
    //        session1.close();
            return list.get(0);
        } 
    
    }
    
    public UnitOfIssue findUnitOfIssue(Long id) {
        return getByKey(id);
    }
    
}
