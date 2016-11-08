package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.StockItem;
import com.mtech.springsecurity.model.StockLedger;
import com.mtech.springsecurity.util.NumberValue;
import java.util.Iterator;
import java.util.List;
import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author derek
 */
@Repository
public class StockLedgerDaoImpl extends AbstractDao<Long, StockLedger> implements StockLedgerDao {

    Logger logger = Logger.getLogger(StockLedgerDaoImpl.class);
    
    @Autowired
    NumberValue nv;

    public StockLedger saveStockLedger(StockLedger stockLedger) {
        if(stockLedger.getId() == null){
            persist(stockLedger);
        }else{
            merge(stockLedger);
        }
        return stockLedger;
    }

    public List<StockLedger> getStockLedgerList(SMEEntity entity) {
        Session session1 = getSession();
        Query query = session1.createQuery("from StockLedger sl where sl.smeEntity.id=:id");
        query.setParameter("id", entity.getId());
        return query.list();
    }

    public StockLedger getLastStockLedgerRecord(SMEEntity entity) {
        Session session1 = getSession();
        java.util.List<StockLedger> list = session1.createQuery("from StockLedger sl where sl.smeEntity.id=:id")
                .setParameter("id", entity.getId()).list();
        if (!list.isEmpty()) {
            return list.get(list.size() - 1);
        }
        return null;
    }

    public StockLedger getLastStockLedgerRecord(SMEEntity entity, String stockName) {
        Session sesion = getSession();
        Query createQuery = sesion.createQuery("from StockLedger sl where sl.stock.stockName = :stockName and sl.smeEntity.id=:id");
        createQuery.setParameter("stockName", stockName);
        createQuery.setParameter("id", entity.getId());
        List<StockLedger> list = createQuery.list();
        if (!list.isEmpty()) {
            return list.get(list.size() - 1);
        }
        return null;
    }

    public java.math.BigDecimal stockBalance(SMEEntity entity, String stockName) {
        Session sessionLocal = getSession();
        /**
         * getting purchases
         */
        Iterator iteratePurchase = sessionLocal.createQuery(
                "select sum(p.quantity) as quantity"
                + " from Purchase p"
                + " inner join p.stock s "
                + "where s.stockName = :stockName "
                        + "and s.smeEntity.id=:id")
                .setParameter("stockName", stockName)
                .setParameter("id", entity.getId())
                .setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP)
                .iterate();
        java.util.Map quantityMapPurchase = ((java.util.Map) iteratePurchase.next());
        java.math.BigDecimal qtyPur = (java.math.BigDecimal)quantityMapPurchase.get("quantity");
        
        
        Iterator iterate = sessionLocal.createQuery("select sum(s.quantity) as quantity"
                + " from Sale s"
                + " inner join s.stock k "
                + "where k.stockName = :stockName and k.smeEntity.id = :id")
                .setParameter("stockName", stockName)
                .setParameter("id", entity.getId())
                .setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP)
                .iterate();
        java.util.Map quantityMapSale = ((java.util.Map) iterate.next());
        java.math.BigDecimal qtySal = (java.math.BigDecimal)quantityMapSale.get("quantity");
        
        logger.warn("qty::purchase" + qtyPur + "<=>qty::sale" + qtySal);
        
        java.math.BigDecimal tt = nv.getNumber(qtyPur).subtract(nv.getNumber(qtySal));
        return tt;
    }
    
    
    public StockLedger findStockAvailable(String registeredName,
            String storeName, 
            String stockName){
        
        Session session1 = getSession();
         Query query = session1.createQuery(
                "from StockLedger sl where "
                        + " sl.stock.stockName = :stockName "
                + " and sl.store.storeName = :storeName "
                        + " and sl.smeEntity.registeredName = :registeredName"
        );
        query.setParameter("stockName", stockName);
        query.setParameter("registeredName", registeredName);
        query.setParameter("storeName", storeName);
        List<StockLedger> list = query.list();
        logger.warn("list::size::" + list.size());
        
        if(!list.isEmpty()){
          //  session1.close();
            return list.get(list.size() - 1);
        }
      //  session1.close();
        return null;
    }

    public List<StockLedger> getStockLedgerList(SMEEntity entity, StockItem stock) {
        List list = getSession().createQuery("from StockLedger sl where sl.smeEntity.id = :entityId and sl.stock.id = :stockId")
                .setParameter("entityId", entity.getId()).setParameter("stockId", stock.getId()).list();
        return list;
    }

}
