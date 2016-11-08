package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AbstractDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mtech.springsecurity.dao.UserDao;
import com.mtech.springsecurity.model.User;
import org.springframework.transaction.annotation.Transactional;

@Service("userService")
@Transactional
public class UserServiceImpl extends AbstractDao<Long, User> implements UserService {

    @Autowired
    private UserDao dao;

    public User findById(Long id) {
        return dao.findById(id);
    }

    public User findByUsername(String username) {
        return dao.findByUsername(username);
    }

}
