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

/**
 *
 * @author derek
 */
@Entity 
@Table(name = "position_in_entity")
public class PositionInEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    
    @Column(name = "position_name")
    String positionName;
    
    @Column(name = "short_name")
    String shortName;
    
    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date createdAt;
    
    @Column(name = "is_active")
    boolean isActive;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
    
    
    
}
