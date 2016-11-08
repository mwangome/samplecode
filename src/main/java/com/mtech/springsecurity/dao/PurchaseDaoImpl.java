/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Purchase;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;
import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class PurchaseDaoImpl extends AbstractDao<Long, Purchase> implements PurchaseDao{
    
    Logger logger = Logger.getLogger(PurchaseDaoImpl.class);
    public Purchase savePurchase(Purchase purchase) {
        if(purchase.getId() == null){
            persist(purchase);
        }else{
            merge(purchase);
        }
        return purchase;
    }

    public List<Purchase> getPurchasesList(SMEEntity entity) {
        Session session = getSession();
        Query query = session.createQuery("from Purchase p where p.smeEntity.id=:id");
        query.setParameter("id", entity.getId());
        return query.list();
    }
    
    public List<Purchase> getPurchasesList(String stockName, String storeName, String registeredName) {
        Session sessionPurchase = getSession();
        Query createQuery = sessionPurchase.createQuery("from Purchase p "
                + " where p.stock.stockName=:stockName and p.store.storeName=:storeName and p.smeEntity.registeredName=:registeredName"
        );
        createQuery.setParameter("stockName", stockName);
        createQuery.setParameter("storeName", storeName);
        createQuery.setParameter("registeredName", registeredName);
        List<Purchase> list = createQuery.list();
        return list;
    }

    public Purchase findPurchase(Long id) {
        try{
            return getByKey(id);
        }catch(Exception x){
            logger.warn(x);
        }
        return null;
    }
    
    public Purchase findPurchase(String invoiceNumber) {
        Session sessionLocal = getSession();
        Query query = sessionLocal.createQuery("from Purchase p where p.invoiceNumber = :invoiceNumber");
        query.setParameter("invoiceNumber", invoiceNumber);
        List<Purchase> list = query.list();
        if(!list.isEmpty()){
            return list.get(0);
        }
        return null;
    }
    
}
