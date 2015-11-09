import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class SQLPlaysInsertion {

	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com/RinDataBase";
	static final String USERNAME = "hanabeast";
	static final String PASSWORD = "fyl1990617";
	static final String BUSINESS_PATH = "/Users/QingxiaoDong/Dropbox/2015CIS550/project/ProjectData/TMDB/TMDBMovieInfo";

	public static void main(String... args) throws SQLException,
			ClassNotFoundException, IOException, ParseException {
		Connection conn = null;
		Statement stmt = null;
		Class.forName(JDBC_DRIVER);
		// System.out.println("Connecting to database...");
		conn = DriverManager.getConnection(DB_URL, USERNAME, PASSWORD);
		// System.out.println("Creating statement...");
		stmt = conn.createStatement();
		JSONParser parser = new JSONParser();
		BufferedReader br = new BufferedReader(new FileReader(BUSINESS_PATH));
		String line;
		StringBuilder sql = new StringBuilder();
		// stmt.executeUpdate("SET FOREIGN_KEY_CHECKS = 0");
		// stmt.executeUpdate("TRUNCATE ****");
		// stmt.executeUpdate("SET FOREIGN_KEY_CHECKS = 1");
		while ((line = br.readLine()) != null) {

		 	try {
		 		JSONObject jsonObject = (JSONObject) parser.parse(line);
			 	sql = new StringBuilder();
				sql.append("INSERT INTO plays VALUES (");
				long movie_id = (long) jsonObject.get("id");
				JSONArray castJsonObject = (JSONArray) jsonObject.get("cast");
				for (int i = 0; i < castJsonObject.size(); i++) {
					JSONObject jo = (JSONObject) castJsonObject.get(i);
					if ((long) jo.get("order") < 5) {
						try {
							long actor_id = (long) jo.get("personId");
							long order = (long) jo.get("order");
							String role = (String) jo.get("character");
							sql.append(actor_id + ",");
							sql.append("" + movie_id + ",");
							sql.append("" + order + ",");
							if (role == null || role.equals("")) {
								sql.append("NULL" + ")");
							} else if (role.length() <= 50){
								sql.append("'" + role.trim().replace("'", "\\'") + "')");
							} else {
								sql.append("'" + role.substring(0, 47).trim().replace("'", "\\'") + "...')");
							}
							// System.out.println(sql);
							stmt.executeUpdate(sql.toString());
							} catch (Exception e) {
								System.err.println(sql.toString());
						 		System.out.println(e);
							}
						
						sql = new StringBuilder();
						sql.append("INSERT INTO plays VALUES (");
					}
				}
		 	} catch (Exception e) {
		 		System.out.println(e);
		 	}
		 	// break;
		}
		br.close();
		stmt.close();
		conn.close();
	}
}