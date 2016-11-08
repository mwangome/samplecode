/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;

/**
 *
 * @author mwangome
 */
@Entity
@Table(name = "modules_manager")
public class Module implements Serializable {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "module_name")
    String moduleName;
    
    @Column(name = "enable")
    boolean enabled;
    
    @Column(name = "effective_date")    
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date effectiveDate;
    
    @Column(name = "module_code")
    String moduleCode;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "APP_USER_modules",
            joinColumns = {
                @JoinColumn(name = "module_ID")},
            inverseJoinColumns = {
                @JoinColumn(name = "USER_ID")})
    private Set<User> users = new HashSet<User>(0);
    
    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity entity;
    
    
    @Column(name = "module_path")
    String path;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public SMEEntity getEntity() {
        return entity;
    }

    public void setEntity(SMEEntity entity) {
        this.entity = entity;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    } 
    
}
