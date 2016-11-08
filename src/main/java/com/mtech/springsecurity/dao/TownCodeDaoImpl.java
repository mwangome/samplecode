/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.TownCode;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class TownCodeDaoImpl extends AbstractDao<Long, TownCode> implements TownCodeDao{

    public TownCode saveTownCode(TownCode townCode) {
        persist(townCode);
        return townCode;
    }

    public List<TownCode> getTownCodes() {
        List<TownCode> list = getList();
        return list;
    }
    
}
