/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.AccountingPeriod;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import java.util.Date;
import java.util.List;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 *
 * @author mwangome
 */
@Repository
public class AccountingPeriodDaoImpl extends AbstractDao<Long, AccountingPeriod> implements AccountingPeriodDao {

    Logger logger = Logger.getLogger(AccountingPeriodDaoImpl.class);

    @Autowired
    AppUtil appUtil;

    public AccountingPeriod saveAccountingPeriod(AccountingPeriod ap) {
        if (ap.getId() == null) {
            persist(ap);
        } else {
            merge(ap);
        }
        return ap;
    }

    public boolean saveAccountingPeriods(List<AccountingPeriod> aps) {
        Session iSess = getSession();
        for (AccountingPeriod ap : aps) {
            iSess.saveOrUpdate(ap);
        }
        iSess.flush();
        return true;

    }

    public AccountingPeriod getCurrentDateClosed(SMEEntity entity) {
        Session iSess = getSession();
        Query query = iSess.createQuery("SELECT ap from AccountingPeriod ap where ap.status = 'CLOSED' and ap.entity.id = :id");
        query.setParameter("id", entity.getId());
        List<AccountingPeriod> list = query.list();
        if (!list.isEmpty()) {
            return list.get(list.size() - 1);
        }
        return null;
    }

    public List<AccountingPeriod> getPeriodsList(SMEEntity entity) {
        Session iSess = getSession();
        Query query = iSess.createQuery("from AccountingPeriod ap where ap.entity.id = :id");
        query.setParameter("id", entity.getId());
        return query.list();
    }

    public Integer getMaxBatch(SMEEntity entity) {
        Session iSess = getSession();
        SQLQuery query = iSess.createSQLQuery("select max(ap.batchNumber) batchnumber from accounting_periods ap where ap.sme_id = :id");
        query.setParameter("id", entity.getId());
        query.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP);
        List data = query.list();
        logger.warn("accountingperiod::" + data.size());
        Integer number = null;
        for (Object object : data) {
            java.util.Map row = (java.util.Map) object;
            System.out.print("Max number: " + row.get("batchnumber"));
            number = (Integer) row.get("batchnumber");
        }
        return number;
    }
   

    public AccountingPeriod getCurrentPeriod(SMEEntity entity) {
        Date date = new java.util.Date();
        Session iSess = getSession();
        Query query = iSess.createQuery(
                "from AccountingPeriod ap "
                + " where :date between ap.startDate and ap.endDate and ap.entity.id = :id"
        );
        query.setParameter("date", date);
        query.setParameter("id", entity.getId());
        List<AccountingPeriod> list = query.list();

        logger.warn("Current date::" + list.size());
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public AccountingPeriod findAccountingPeriod(Long id) {
        return getByKey(id);
    }
    
    public Session apSession() {
        return getSession();
    }

}
