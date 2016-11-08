/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.LegalType;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class LegalTypeDaoImpl extends AbstractDao<Long, LegalType>  implements LegalTypeDao{

    public LegalType saveLegalType(LegalType legalType) {
        persist(legalType);
        return legalType;
    }

    public List<LegalType> getLegalTypes() {
        return getList();
    }
    
}
