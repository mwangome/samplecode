/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Tax;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author mwangome
 */
@Repository
public class TaxDaoImpl extends AbstractDao<Long, Tax> implements TaxDao{

    public Tax saveTax(Tax tax) {
        if(tax.getId() == null){
            persist(tax);
        }else{
            merge(tax);
        }
        
        return tax;
    }

    public List<Tax> getTaxesList() {
        return getList();
    }

    public Tax findTax(Long id) {
        return getByKey(id);
    }
    
    public Tax findTax(String taxType) {
        Session iSess = getSession();
        Query createQuery = iSess.createQuery("from Tax t where t.taxType = :taxType");
        List<Tax> list = createQuery.setParameter("taxType", taxType).list();
        if(!list.isEmpty()){
            return list.get(0);
        }
        return null;
    }
    
}
