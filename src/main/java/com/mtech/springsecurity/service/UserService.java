package com.mtech.springsecurity.service;

import com.mtech.springsecurity.model.User;

public interface UserService {

	User findById(Long id);
	
	User findByUsername(String sso);
	
}