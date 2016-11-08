/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Sale;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class SaleDaoImpl extends AbstractDao<Long, Sale> implements SaleDao {

    public Sale saveSale(Sale sale) {
        if(sale.getId() == null){
            persist(sale);
        }else{
            merge(sale);
        }
        return sale;
    }

    public List<Sale> getSalesList(SMEEntity entity) {
        Session sessionPurchase = getSession();
        Query createQuery = sessionPurchase.createQuery("from Sale s where s.smeEntity.id=:id");
        createQuery.setParameter("id", entity.getId());
        return createQuery.list();
    }
    
    public Sale findSale(Long id){
        return getByKey(id);
    }
    
    public List<Sale> getSalesList(SMEEntity entity, String stockName) {
        Session sessionPurchase = getSession();
        Query createQuery = sessionPurchase.createQuery("from Sale s where s.stock.stockName=:stockName and s.stock.smeEntity.id=:id");
        createQuery.setParameter("stockName", stockName);
        createQuery.setParameter("id", entity.getId());
        List<Sale> list = createQuery.list();
        return list;
    }

    
    
     public Sale findSale(String salesRefNumber) {
        Session sessionLocal = getSession();
        Query query = sessionLocal.createQuery("from Sale s where s.salesRefNumber = :salesRefNumber");
        query.setParameter("salesRefNumber", salesRefNumber);
        List<Sale> list = query.list();
        if(!list.isEmpty()){
            return list.get(0);
        }
        return null;
    }
    
}
