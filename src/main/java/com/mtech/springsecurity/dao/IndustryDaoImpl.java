/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Industry;
import java.util.List;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.jboss.logging.Logger;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class IndustryDaoImpl extends AbstractDao<Long, Industry> implements IndustryDao {

    Logger logger = Logger.getLogger(IndustryDaoImpl.class);

    public Industry saveIndustryCode(Industry industryCode) {
        if (industryCode.getId() == null) {
            persist(industryCode);
        } else {
            merge(industryCode);
        }

        return industryCode;
    }

    public List<Industry> getIndustryCodesList() {
        List<Industry> list = getSession().createQuery("from Industry ind").list();
        return list;
    }

    public Industry findIndustryCode(String sicName) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from Industry ind where ind.sicName = :sicName");
        createQuery.setParameter("sicName", sicName);
        java.util.List<Industry> list = createQuery.list();
        if (list.isEmpty()) {
            return null;
        } else {
            return list.get(0);
        }
    }

}
