/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.RolesTasks;
import com.mtech.springsecurity.enumerate.UserProfileType;

/**
 *
 * @author derek
 */
public interface RolesDao {
    java.util.List<RolesTasks> getTasks(UserProfileType type);
}
