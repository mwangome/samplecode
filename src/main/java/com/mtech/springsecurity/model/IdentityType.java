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
@Table(name = "identity_types")
public class IdentityType implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "type_code")
    String typeCode;
    
    @Column(name = "id_type_name")
    String idTypeName;
    
    @Column(name = "is_active")
    boolean isActive;
    
    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public String getIdTypeName() {
        return idTypeName;
    }

    public void setIdTypeName(String idTypeName) {
        this.idTypeName = idTypeName;
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
