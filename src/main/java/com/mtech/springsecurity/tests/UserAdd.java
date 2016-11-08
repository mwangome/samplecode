/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.tests;

import com.mtech.springsecurity.dao.UserDao;
import com.mtech.springsecurity.model.Role;
import com.mtech.springsecurity.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 *
 * @author derek
 */
public class UserAdd {
    @Autowired
    UserDao userDao;
    
    void saveUserAttmpt(){
        User us = new User();
        us.setEmail("koroga@koroga.com");
        us.setFirstName("koroga");
        us.setLastName("abel");
        us.setUsername("koroga");
        
        java.util.Set<Role> set = new java.util.HashSet();
        us.setUserRoles(set);
        
        userDao.saveUser(us);
    }
    public static void  main(String args[]){
        BCryptPasswordEncoder enc = new    BCryptPasswordEncoder();
        String encode = enc.encode("derek");
        System.out.println(encode);
    }
}
