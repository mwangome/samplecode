/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AbstractDao;
import com.mtech.springsecurity.dao.AccountingPeriodDao;
import com.mtech.springsecurity.model.AccountingPeriod;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author mwangome
 */
@Service
public class AnalyticsService extends AbstractDao<Long, AccountingPeriod> {

    Logger logger = Logger.getLogger(AnalyticsService.class);

    @Autowired
    AccountingPeriodDao apDao;

    public String getSalesPerMonth(SMEEntity entity) {
        JSONArray jArray = new JSONArray();
        SQLQuery query = getSession().createSQLQuery(
                "select tab.end_date, tab.mon, coalesce(tab.sales, 0) vals from(\n"
                + "select ap.end_date, to_char(ap.start_date, 'Mon') mon, sum(sales_value) sales\n"
                + "    from accounting_periods ap\n"
                + "        left join sales sa on to_char(sa.sale_date, 'Mon') = to_char(ap.start_date, 'Mon') \n"
                + "    where ap.batchnumber = " + apDao.getMaxBatch(entity) + "\n"
                + "group by ap.end_date, to_char(ap.start_date, 'Mon') \n"
                + ") as tab order by end_date"
        );
        query.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP);
        List data = query.list();
        logger.warn("accountingperiod::" + data.size());
        for (Object object : data) {
            JSONObject jsonObject = new JSONObject();
            java.util.Map row = (java.util.Map) object;
            jsonObject.put("label", row.get("mon"));
            jsonObject.put("value", row.get("vals"));
            jArray.add(jsonObject);
        }
        String salesPerProduct = getSalesPerProduct(entity);
        JSONObject wrapperObject = new JSONObject();
        wrapperObject.put("data", jArray);
        wrapperObject.put("product", salesPerProduct);
        wrapperObject.put("success", true);
        return wrapperObject.toString();
    }

    public String getSalesPerProduct(SMEEntity entity) {
        JSONArray jArray = new JSONArray();
        SQLQuery query = getSession().createSQLQuery(
                "select st.stock_name, sum(sa.sales_value) sales_value  from stocks st\n"
                + "    inner join sales sa on sa.stock_id = st.id\n"
                + "group by st.stock_name"
        );
        query.setResultTransformer(Criteria.ALIAS_TO_ENTITY_MAP);
        List data = query.list();
        logger.warn("accountingperiod::" + data.size());
        for (Object object : data) {
            JSONObject jsonObject = new JSONObject();
            java.util.Map row = (java.util.Map) object;
            jsonObject.put("label", row.get("stock_name"));
            jsonObject.put("value", row.get("sales_value"));
            jArray.add(jsonObject);
        }
        
        return jArray.toString();
    }
}
