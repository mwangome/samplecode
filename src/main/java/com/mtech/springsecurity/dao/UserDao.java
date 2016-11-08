package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.User;
import com.mtech.springsecurity.enumerate.UserProfileType;
import com.mtech.springsecurity.model.Role;

public interface UserDao {

	User findById(Long id);
	
	User findByUsername(String username);
        
        User saveUser(User user);
	
        java.util.List<User> getUsers();
        
        Role saveProfile(Role profile);
        
        Role findProfile(UserProfileType profile);
        
        User resetUserPassword(String userName, String password, String newPassword);
}

