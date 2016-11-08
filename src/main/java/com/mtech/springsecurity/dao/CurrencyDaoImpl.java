/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Currency;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class CurrencyDaoImpl extends AbstractDao<Long, Currency> implements CurrencyDao{

    public Currency saveCurrency(Currency currency) {
        persist(currency);
        return  currency;
    }

    public List<Currency> getCurrencyList() {
        return getList();
    }
    
}
