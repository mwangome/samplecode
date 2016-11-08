/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEBranch;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class SMEBranchDaoImpl extends AbstractDao<Long, SMEBranch> implements SMEBranchDao {

    public SMEBranch saveBranch(SMEBranch branch) {
        if(branch.getId() == null){
            persist(branch);
        }else{
            merge(branch);
        }
        return branch;
    }

    public List<SMEBranch> getBranches(SMEEntity entity) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from SMEBranch smb where smb.entity.id = :id");
        List<SMEBranch> list = createQuery.setParameter("id", entity.getId()).list();
       // session1.close();
        return list;
    }
    
    public SMEBranch findBranch(Long id) {
        return getByKey(id);
    }
    
    public SMEBranch findBranch(String branchName){
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from SMEBranch smb where smb.branchName = :branchName");
        List<SMEBranch> list = createQuery.setParameter("branchName", branchName).list();
        
        if(!list.isEmpty()){
        //    session1.close();
            return list.get(0);
        }
      //  session1.close();
        return null;
    }
    
}
