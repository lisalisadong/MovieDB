import java.io.BufferedReader;
import java.util.Date;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class PopulatingActor {
	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com/RinDataBase";
	static final String USERNAME = "hanabeast";
	static final String PASSWORD = "fyl1990617";
	static final String BUILD_PATH = "/Users/QingxiaoDong/Dropbox/2015CIS550/project/ProjectData/TMDB/TMDBPersonLisa9865320"
			+ "Info";
		
	public static void main(String[] args) throws SQLException,
	ClassNotFoundException, IOException, ParseException {
		GetHashSet.main(args);
		Connection conn = null;
		Statement stmt = null;
		Class.forName(JDBC_DRIVER);
		System.out.println("Connecting to database...");
		conn = DriverManager.getConnection(DB_URL, USERNAME, PASSWORD);
		stmt = conn.createStatement();
		System.out.println("Creating statement...");
		
		JSONParser parser = new JSONParser();
		BufferedReader br = new BufferedReader(new FileReader(BUILD_PATH));
		String line;
		StringBuilder sql = new StringBuilder();
		// stmt.executeUpdate("SET FOREIGN_KEY_CHECKS = 0");
		// stmt.executeUpdate("TRUNCATE ****");
		// stmt.executeUpdate("SET FOREIGN_KEY_CHECKS = 1");
		while ((line = br.readLine()) != null) {
			sql = new StringBuilder();
			JSONObject object = (JSONObject) parser.parse(line);
			sql.append("INSERT INTO actor VALUES (");
			
			long id = (long) object.get("personId");
			if (!GetHashSet.actors.contains(id)) {
				continue;
			}
			sql.append("" + id + ",");
			
			String name = (String) object.get("name");
			if (name == null || name.length() > 50 || name.length() == 0) {
				continue;
			}
			sql.append("'" + name.trim().replace("'", "\\'") + "',");
			
			String dateOfBirth = (String) object.get("dayofbirth");
			if (dateOfBirth == null || dateOfBirth.length() == 0) {
				sql.append("Null,");
			} else {
				sql.append("'" + dateOfBirth+ "'," );
			}
			
			String picture = (String) object.get("proflie");
			if (picture == null || picture.length() > 100 || picture.length() == 0) {
				sql.append("Null,");
			} else {
				sql.append("'" + picture.trim().replace("'", "\\'") + "'," );
			}
			
			String bio = (String) object.get("biography");
			if (bio == null || bio.length() > 10000 || bio.length() == 0) {
				sql.append("Null");
			} else {
				sql.append("'" + bio.trim().replace("'", "\\'") + "'" );
			}
			sql.append(")");
			stmt.executeUpdate(new String(sql));
		}
		System.out.println("import done");
		
		
		br.close();
		stmt.close();
		conn.close();
		
	}

}
