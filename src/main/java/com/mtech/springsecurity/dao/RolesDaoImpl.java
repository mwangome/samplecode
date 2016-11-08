/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.RolesTasks;
import com.mtech.springsecurity.enumerate.UserProfileType;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class RolesDaoImpl extends AbstractDao<Long, RolesTasks> implements RolesDao{
    Logger logger = Logger.getLogger(RolesDaoImpl.class);
    public java.util.List<RolesTasks> getTasks(UserProfileType type) {
        
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("type", type));
        return crit.list();
    }
    
}
