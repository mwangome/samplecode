package com.mtech.springsecurity.enumerate;

public enum UserProfileType {
	USER("Ordinary User"),
	DBA("Database Admin"),
	ADMIN("System Admin"),
        MET_ADMIN("Super Admin"),
        ENT_ADMIN("Admin"),
        MOD_OWNER("Checker"),
        MOD_USER("Creator");
	
	String userProfileType;
	
	private UserProfileType(String userProfileType){
		this.userProfileType = userProfileType;
	}
	
	public String getUserProfileType(){
		return userProfileType;
	}
        
        public static UserProfileType[] getUserProfiles(){
            return UserProfileType.values();
        }
        
        public static UserProfileType parseType(String type){
            UserProfileType[] values = UserProfileType.values();
            for(UserProfileType o:values ){
                System.out.println("checking..." + o.name());
                if(o.name().equalsIgnoreCase(type)||o.getUserProfileType().equalsIgnoreCase(type)){
                    return o;
                }
            }
            return null;
        }
        
	public static void main(String[] args){
            System.out.println(UserProfileType.parseType("Super Admin"));
        }
}
