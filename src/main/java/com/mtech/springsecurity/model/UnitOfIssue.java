/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "unit_of_issue")
public class UnitOfIssue implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "uoi_name")
    String uoiName;
    
    @Column(name = "uoi_code")
    String uoiCode;
    
    @Column(name = "is_active")
    boolean isActive;
    
    @Column(name = "createdAt")
    @Temporal(TemporalType.DATE)
    java.util.Date createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUoiName() {
        return uoiName;
    }

    public void setUoiName(String uoiName) {
        this.uoiName = uoiName;
    }

    public String getUoiCode() {
        return uoiCode;
    }

    public void setUoiCode(String uoiCode) {
        this.uoiCode = uoiCode;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }  
    
}
