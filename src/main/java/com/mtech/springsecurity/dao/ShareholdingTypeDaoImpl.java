/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.ShareholdingType;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class ShareholdingTypeDaoImpl extends AbstractDao<Long, ShareholdingType> implements ShareholdingTypeDao{

    public ShareholdingType saveShareholdingType(ShareholdingType shareholdingType) {
        if(shareholdingType.getId() == null){
            persist(shareholdingType);
        }else{
            merge(shareholdingType);
        }
        return shareholdingType;
    }

    public List<ShareholdingType> getShareholdingTypeList() {
        return getList();
    }

    public ShareholdingType findShareholdingType(String shareholdingTypeName) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from ShareholdingType st where st.shareholdingTypeName=:shareholdingTypeName");
        List<ShareholdingType> list = createQuery.setParameter("shareholdingTypeName", shareholdingTypeName).list();
        
        if(!list.isEmpty()){
      //      session1.close();
            return list.get(0);
        }
    //    session1.close();
        return null;
    }
    
    public ShareholdingType findShareholdingType(Long id) {
        return getByKey(id);
    }
    
}
