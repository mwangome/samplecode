/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.PostalCode;

/**
 *
 * @author derek
 */
public interface PostalCodesDao {
    
    PostalCode savePostalCode(PostalCode postalCode);
    
    java.util.List<PostalCode>  getPostalCodes();
}
