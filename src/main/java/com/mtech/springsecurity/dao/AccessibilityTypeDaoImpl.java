/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.AccessibilityTypes;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class AccessibilityTypeDaoImpl extends AbstractDao<Long, AccessibilityTypes> implements AccessibilityTypesDao{

    public AccessibilityTypes saveAccessibilityType(AccessibilityTypes accessibilityType) {
        if(accessibilityType.getId() == null){
            persist(accessibilityType);
        }else{
            merge(accessibilityType);
        }
        return accessibilityType;
    }

    public List<AccessibilityTypes> getAccessibilityTypesList() {
        return getList();
    }

    public AccessibilityTypes findAccessibilityType(Long id) {
        return getByKey(id);
    }
    
}
