/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.AssetType;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class AssetTypeDaoImpl extends AbstractDao<Long, AssetType> implements AssetTypeDao{

    public AssetType saveAssetType(AssetType assetType) {
        if(assetType.getId() == null){
            persist(assetType);
        }else{
            merge(assetType);
        }
        return assetType;
    }

    public List<AssetType> getAssetTypeList() {
        return getList();
    }

    public AssetType findAssetType(Long id) {
        return getByKey(id);
    }
    
    public AssetType findAssetType(String assetTypeName) {
        Session session1 = getSession();
        Query createQuery = getSession().createQuery("from AssetType at where at.assetTypeName=:assetTypeName");
        List<AssetType> list = createQuery.setParameter("assetTypeName", assetTypeName).list();       
        
        if(!list.isEmpty()){
           // session1.close();
            return list.get(0);
        }
       // session1.close();
        return new AssetType();
    }
    
}
