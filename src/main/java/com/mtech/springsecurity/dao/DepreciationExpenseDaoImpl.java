/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.DepreciationExpense;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author mwangome
 */
@Repository
public class DepreciationExpenseDaoImpl extends AbstractDao<Long, DepreciationExpense> implements DepreciationExpenseDao{

    public DepreciationExpense saveExpense(DepreciationExpense depreciationExpense) {
        if(depreciationExpense.getId() == null){
            persist(depreciationExpense);
        }else{
            merge(depreciationExpense);
        }
        return depreciationExpense;
    }

    public List<DepreciationExpense> getListOfExpenses(SMEEntity entity) {
        Session iSess = getSession();
        Query query = iSess.createQuery("from DepreciationExpense de where de.entity.id = :id");
        java.util.List<DepreciationExpense> list = query.setParameter("id", entity.getId()).list();
        return list;
    }
    
    public  List<DepreciationExpense>  getPeriodDepreciation(Long id, Long periodId){
        Session iSess = getSession();
        Query query = iSess.createQuery("from DepreciationExpense de where de.asset.id = :id and de.period.id = :periodId");
        List<DepreciationExpense> list = query.setParameter("id", id).setParameter("periodId", periodId).list();
        return list;
    }
    
    
    public  List<DepreciationExpense>  getCumulativeDepreciation(Long id){
        Session iSess = getSession();
        Query query = iSess.createQuery("from DepreciationExpense de where de.asset.id = :id");
        List<DepreciationExpense> list = query.setParameter("id", id).list();
        return list;
    }
    
}
