/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Asset;
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
public class AssetDaoImpl extends AbstractDao<Long, Asset> implements AssetDao{

    public Asset saveAsset(Asset asset) {
        if(asset.getId() == null){
            persist(asset);
        }else{
            merge(asset);
        }
        return asset;
    }

    public List<Asset> getAssetsList(SMEEntity entity) {
        Session session1 = getSession();         
        Query createQuery = session1.createQuery("from Asset a where a.smeEntity.id = :id");
        createQuery.setParameter("id", entity.getId());
        List list = createQuery.list();       
        //session1.close();
        return list;
    }
    

    public Asset findAsset(Long id) {
        return getByKey(id);
    }
    
}
