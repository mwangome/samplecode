/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.PostalCode;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class PostalCodesDaoImpl extends AbstractDao<Long, PostalCode> implements PostalCodesDao {

    public PostalCode savePostalCode(PostalCode postalCode) {
        persist(postalCode);
        return postalCode;
    }

    public List<PostalCode> getPostalCodes() {
        return getList();
    }
    
}
