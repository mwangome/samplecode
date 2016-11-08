/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Store;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class StoreDaoImpl extends AbstractDao<Long, Store> implements StoreDao{

    public Store saveStore(Store store) {
        if(store.getId() == null){
            persist(store);
        }else{
            merge(store);
        }
        return store;
    }

    public List<Store> getStoreList(SMEEntity entity) {
        Session session1 = getSession();
        Query createQuery =  session1.createQuery("from Store store where store.smeEntity.id = :id");
        List list = createQuery.setParameter("id", entity.getId()).list();
   //     session1.close();
        return list;
    }
    
    public Store findStore(Long id){
        return getByKey(id);
    }
    
     public Store findStore(SMEEntity entity,String storeName) {
         Session session1 = getSession();
        Query createQuery = session1.createQuery("from Store store where store.storeName = :storeName and store.smeEntity.id = :id");
        createQuery.setParameter("storeName", storeName);
        createQuery.setParameter("id", entity.getId());
        java.util.List<Store> list = createQuery.list();
        
        if(list.isEmpty()) {
     //       session1.close();
            return null;
        }else{
     //       session1.close();
            return list.get(0);
        } 
    }
    
}
