/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.IndustryGroup;
import java.util.List;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author mwangome
 */
@Repository
public class IndustryGroupDaoImpl extends AbstractDao<Long, IndustryGroup> implements IndustryGroupDao{

    public List<IndustryGroup> getListOfGroups() {
        return getList();
    }
    
    public IndustryGroup findIndustryGroupByName(String description){
        Query createQuery = getSession().createQuery("from IndustryGroup ig where ig.description = :description");
        List<IndustryGroup> list = createQuery.setParameter("description", description).list();
        
        if(!list.isEmpty()){
            return list.get(0);
        }
        return null;
    }
    
}
