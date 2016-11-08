package com.mtech.springsecurity.dao;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.mtech.springsecurity.model.User;
import com.mtech.springsecurity.enumerate.UserProfileType;
import com.mtech.springsecurity.model.Role;
import com.mtech.springsecurity.util.AppUtil;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Repository
public class UserDaoImpl extends AbstractDao<Long, User> implements UserDao {

    Logger logger = Logger.getLogger(UserDaoImpl.class);
    
    @Autowired
    AppUtil appUtil;
    
    public User findById(Long id) {
        User aUser = null;
        try{
            aUser = getByKey(id);
        }catch(Exception x){
            
        }
        return aUser;
    }

    public User findByUsername(String username) {
        Criteria crit = createEntityCriteria();
        crit.add(Restrictions.eq("username", username));
        User u = null;
        try{
            java.util.List<User> list = crit.list();
            logger.warn("user found!");
            return list.get(0);
        }catch(Exception x){
            logger.warn(">>>>" + x);
        }
        return u;
    }

    public Role findProfile(UserProfileType profile) {
        Session session1 = getSession();

        Query query = session1.createQuery("from Role up where up.roleName = :type");
        query.setParameter("type", profile.name());
        List<Role> list = query.list();
        
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public User saveUser(User user) {
        User dbUser = null;
        try{
            dbUser = getByKey(user.getId());
        }catch(Exception x){
            log.warn("exception::" + x);
        }
        
        if (dbUser == null) {
            user.setPassword(encodePassword(user.getPassword()));
            persist(user);
        } else {

            try {
                Set<Role> userProfiles = user.getUserRoles();
                java.util.Iterator<Role> iterator = userProfiles.iterator();
                log.warn("roles has more::" + iterator.hasNext());
                user.setPassword(encodePassword(user.getPassword()));
                Set<User> users = new HashSet();
                users.add(user);
                while (iterator.hasNext()) {
                    Role up = iterator.next();
                    UserProfileType pt = UserProfileType.parseType(up.getRoleName());
                    log.warn(">>>" + pt);
                    Role upt = findProfile(pt);
                    if (upt == null) {
                        try {
                            up.setUsers(users);
                            upt = saveProfile(up);

                            log.warn("user profile missing adding::" + upt.getRoleName());
                            userProfiles = new HashSet();
                            userProfiles.add(upt);
                            user.setUserRoles(userProfiles);
                        } catch (Exception x) {
                            log.warn("failed to save profile!");
                        }

                    } else {
                        log.warn("user profile not adding::");
                    }
                }
            } catch (Exception x) {
                log.warn("save user profile fails:" + x);
            }

            merge(user);
            
        }
        return user;
    }
    
    
    String encodePassword(String password){
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	String hashedPassword = passwordEncoder.encode(password);
        return hashedPassword;
    }

    public List<User> getUsers() {
        Session session1 = getSession();
        List<User> usersList = session1.createQuery("from User u").list();
        
     //   session1.close();
        
        return usersList;
    }

    public Role saveProfile(Role profile) {
        Session session1 = getSession();
        session1.save(profile);
        session1.flush();
        return profile;
    }
    
    public User resetUserPassword(String userName, String password, String newPassword){
        Query createQuery = getSession().createQuery("from User u where u.username = :userName");
        List<User> list = createQuery.setParameter("userName", userName).list();
        if(!list.isEmpty()){
            User user = list.get(0);
            String encoded = user.getPassword();
            boolean passwordMatch = appUtil.passwordMatch(password, encoded);
            logger.warn("password matches::" + passwordMatch);
            if(passwordMatch){
                user.setPassword(appUtil.encode(newPassword));
                user.setPasswordReset(true);
                merge(user);
                getSession().flush();
//                user.setPassword(newPassword);
                return user;
            }
        }
        return null;
    }
    
    public static void main(String args[]){
        UserDaoImpl im = new UserDaoImpl();
        String encodePassword = im.encodePassword("derek");
        System.out.println("encoded:" + encodePassword);
    }

}
