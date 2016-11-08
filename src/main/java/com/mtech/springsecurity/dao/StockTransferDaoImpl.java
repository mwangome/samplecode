/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.StockTransfer;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class StockTransferDaoImpl extends AbstractDao<Long, StockTransfer> implements StockTransferDao{

    public StockTransfer saveStockTransfer(StockTransfer stockTransfer) {
        if(stockTransfer.getId() == null){
            persist(stockTransfer);
        }else{
            merge(stockTransfer);
        }
        return stockTransfer;
    }

    public List<StockTransfer> getStockTransferList() {
        return getList();
    }

    public StockTransfer findStockTransfered(Long id) {
        return getByKey(id);
    }
    
    public StockTransfer findStockTransfered(String registeredName,
            String storeName, 
            String stockName) {
        
        Session session1 = getSession();
        Query query = session1.createQuery(
                "from StockTransfer st where "
                        + " st.stock.stockName = :stockName "
                + " and st.storeTo.storeName = :storeName "
                        + " and st.smeEntity.registeredName = :registeredName"
        );
        query.setParameter("stockName", stockName);
        query.setParameter("storeName", storeName);
        query.setParameter("registeredName", registeredName);
        List<StockTransfer> list = query.list();
        if(!list.isEmpty()){
           // session1.close();
            return list.get(0);
        }
       // session1.close();
        return null;
    }
    
}
