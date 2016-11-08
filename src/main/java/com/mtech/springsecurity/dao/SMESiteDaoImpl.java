/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMESite;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class SMESiteDaoImpl extends AbstractDao<Long, SMESite> implements SMESiteDao{

    public SMESite saveSite(SMESite site) {
        if(site.getId() == null){
            persist(site);
        }else{
            merge(site);
        }
        return site;
    }

    public List<SMESite> getSites() {
        return getList();
    }

    public SMESite findSite(Long id) {
        return getByKey(id);
    }
    
}
