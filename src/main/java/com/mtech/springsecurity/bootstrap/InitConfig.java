/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.bootstrap;

import com.mtech.springsecurity.dao.PaymentModeDao;
import com.mtech.springsecurity.dao.UserDao;
import com.mtech.springsecurity.enumerate.PaymentModes;
import com.mtech.springsecurity.enumerate.UserProfileType;
import com.mtech.springsecurity.model.PaymentMode;
import com.mtech.springsecurity.model.Role;
import com.mtech.springsecurity.model.User;
import com.mtech.springsecurity.model.UserProfile;
import com.mtech.springsecurity.service.AccountsService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

/**
 *
 * @author derek
 */
@Component
public class InitConfig implements ApplicationListener<ContextRefreshedEvent> {

    static final Logger logger = Logger.getLogger(InitConfig.class.getName());

    String ADMIN = "metropol-admin";
    @Autowired
    AccountsService acService;

    @Autowired
    UserDao uDao;
    
    @Autowired
    PaymentModeDao pmDao;

    public void onApplicationEvent(ContextRefreshedEvent event) {
        acService.bootstrapAccounts();
        logger.warn("=> just bootstrapped accounts!!!");
        bootstrapUsers();
        
        bootstrapPaymentModes();
        
       

    }
    
    void bootstrapUsers(){
         Role findProfile = uDao.findProfile(UserProfileType.MET_ADMIN);
        if (findProfile == null) {
            findProfile = new Role();
            findProfile.setRoleName(UserProfileType.MET_ADMIN.name());
            findProfile = uDao.saveProfile(findProfile);

            UserProfile uprofile = new UserProfile();
            uprofile.setType(UserProfileType.MET_ADMIN);
            java.util.Set<Role> set = new java.util.HashSet();
            set.add(findProfile);
            User aUser = new User();
            aUser.setFirstName(ADMIN);
            aUser.setEmail(ADMIN);
            aUser.setUsername(ADMIN);
            aUser.setLastName(ADMIN);
            aUser.setPassword(ADMIN);
            aUser.setUserRoles(set);
            uDao.saveUser(aUser);
            logger.warn("=> just bootstrapped users!!!");
        }else{
            logger.warn("=> users NOT bootstrapped default exists!!!");
        }
    }
    
    void bootstrapPaymentModes(){
        PaymentModes[] values = PaymentModes.values();
        for(PaymentModes pm:values){
            PaymentMode findPaymentMode = pmDao.findPaymentMode(pm.getDescription());
            if(findPaymentMode == null){
                findPaymentMode = new PaymentMode();
                findPaymentMode.setPayMode(pm.getDescription());
                findPaymentMode.setPayModeName(pm.getDescription());
                pmDao.savePaymentMode(findPaymentMode);
                logger.warn("=> just bootstrapped payment modes!!!");
            }else{
                logger.warn("=> not bootstrapping payment modes not null");
            }
        }
        
    }

}
