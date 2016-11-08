package com.mtech.springsecurity.model;

import com.mtech.springsecurity.enumerate.UserProfileType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name = "USER_PROFILE")
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "TYPE", length = 15, nullable = false, unique = false)
    @Enumerated(EnumType.STRING)
    private UserProfileType type;

//    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "userProfiles")
//    private Set<User> users = new HashSet<User>(0);

    public void setId(int id) {
        this.id = id;
    }

    public UserProfileType getType() {
        return type;
    }

    public void setType(UserProfileType type) {
        this.type = type;
    }

//    public void setUsers(Set<User> users) {
//        this.users = users;
//    }
//
//    public Set<User> getUsers() {
//        return this.users;
//    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + id;
        result = prime * result + ((type == null) ? 0 : type.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof UserProfile)) {
            return false;
        }
        UserProfile other = (UserProfile) obj;
        if (id != other.id) {
            return false;
        }
        if (type == null) {
            if (other.type != null) {
                return false;
            }
        } else if (!type.equals(other.type)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "UserProfile [id=" + id + ",  type=" + type + "]";
    }

}
