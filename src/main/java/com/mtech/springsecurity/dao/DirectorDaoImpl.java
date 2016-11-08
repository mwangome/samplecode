/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Director;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class DirectorDaoImpl extends AbstractDao<Long, Director> implements DirectorDao{

    public Director saveDirector(Director director) {
        persist(director);
        return director;
    }

    public List<Director> getListOfDirectors() {
        return getList();
    }
    
}
