package com.mtech.springsecurity.configuration;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;


@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler{
	Logger logger = Logger.getLogger(CustomSuccessHandler.class.getName());
	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
	
    @Override
    protected void handle(HttpServletRequest request, 
      HttpServletResponse response, Authentication authentication) throws IOException {
        logger.warning("custom success handler::");
        String targetUrl = determineTargetUrl(authentication);
 
        if (response.isCommitted()) {
            logger.warning("Can't redirect");
            return;
        }
 
        redirectStrategy.sendRedirect(request, response, targetUrl);
    }
    
    protected String determineTargetUrl(Authentication authentication) {
    	String url="";
    	
        Collection<? extends GrantedAuthority> authorities =  authentication.getAuthorities();
        
		List<String> roles = new ArrayList<String>();

		for (GrantedAuthority a : authorities) {
			roles.add(a.getAuthority());
		}
		if (isDba(roles)) {
			url = "/db";
		} else if (isAdmin(roles)) {
			url = "/home";
		} else if (isUser(roles)) {
			logger.warning("passed by here::::");
			url = "/home";
		}  else {
			logger.warning(":::denied, user allowed? " + isUser(roles) );
			url="/accessDenied";
		}

		return url;
    }
 
    public void setRedirectStrategy(RedirectStrategy redirectStrategy) {
        this.redirectStrategy = redirectStrategy;
    }
    protected RedirectStrategy getRedirectStrategy() {
        return redirectStrategy;
    }
    
	private boolean isUser(List<String> roles) {
		if (roles.contains("ROLE_USER")||roles.contains("ROLE_MET_ADMIN")) {
			return true;
		}
		return false;
	}

	private boolean isAdmin(List<String> roles) {
		if (roles.contains("ROLE_ADMIN")) {
			return true;
		}
		return false;
	}

	private boolean isDba(List<String> roles) {
		if (roles.contains("ROLE_DBA")) {
			return true;
		}
		return false;
	}

}