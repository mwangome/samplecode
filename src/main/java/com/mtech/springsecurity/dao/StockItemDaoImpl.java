/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.StockItem;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class StockItemDaoImpl extends AbstractDao<Long, StockItem> implements StockItemDao{

    public StockItem saveStockItem(StockItem stockItem) {
        if(stockItem.getId() == null){
            persist(stockItem);
        }else{
            merge(stockItem);
        }
        return stockItem;
    }

    public List<StockItem> getStockItemsList(SMEEntity entity) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from StockItem stock where stock.smeEntity.id = :id");
        List list = createQuery.setParameter("id", entity.getId()).list();
       // session1.close();
        return list;
    }
    
    public StockItem findItemByBarcode(SMEEntity entity, String barcode) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from StockItem stock where stock.smeEntity.id = :id and stock.barcode=:barcode");
        List<StockItem> list = createQuery.setParameter("id", entity.getId()).setParameter("barcode", barcode).list();
       if(!list.isEmpty()){
           return list.get(0);
       }
        return null;
    }

    public StockItem findStockItem(Long id) {
        return getByKey(id);
    }
    
    public StockItem findStock(String stockName, SMEEntity entity) {
        Session session1 = getSession();
        Query createQuery =  session1.createQuery(
                "from StockItem stock "
                        + "where stock.stockName = :stockName and stock.smeEntity.id=:id");
        createQuery.setParameter("stockName", stockName);
        createQuery.setParameter("id", entity.getId());
        java.util.List<StockItem> list = createQuery.list();
       
        if(list.isEmpty()) {
    //        session1.close();
            return null;
        }else{
    //        session1.close();
            return list.get(0);
        } 
    }
    
}
