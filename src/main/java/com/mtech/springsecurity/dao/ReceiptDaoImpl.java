/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Receipt;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class ReceiptDaoImpl extends AbstractDao<Long, Receipt> implements ReceiptDao{

    public Receipt saveReceipt(Receipt receipt) {
        if(receipt.getId() == null){
            persist(receipt);
        }else{
            merge(receipt);
        }
        return receipt;
    }

    public List<Receipt> getReceiptsList(SMEEntity entity) {
        Session sessionPurchase = getSession();
        Query createQuery = sessionPurchase.createQuery("from Receipt r where r.smeEntity.id=:id");
        createQuery.setParameter("id", entity.getId());
        return createQuery.list();
    }

    public Receipt findReceipt(Long id) {
        return getByKey(id);
    }
    
}
