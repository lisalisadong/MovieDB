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

public class SQLMovieUpdate {

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
		while ((line = br.readLine()) != null) {

		 	try {
		 		JSONObject jsonObject = (JSONObject) parser.parse(line);
			 	sql = new StringBuilder();
				sql.append("UPDATE movie SET genre = '");
				JSONArray genres = (JSONArray) jsonObject.get("genres");
				StringBuilder gs = new StringBuilder();
				for (int i = 0; i < genres.size(); i++) {
					if (i == 0) {
						gs.append(genres.get(i).toString());
					} else {
						gs.append(" | " + genres.get(i).toString());
					}
				}
				sql.append(gs.toString());
				sql.append("' WHERE id = ");
			 	long movie_id = (long) jsonObject.get("id");
		 		sql.append(movie_id + ";");

		 		// System.out.println(sql.toString());
		 		stmt.executeUpdate(sql.toString());
		 	} catch (Exception e) {
		 		System.err.println(sql.toString());
		 		System.out.println(e);
		 	}
		 	// break;
		}
		br.close();
		stmt.close();
		conn.close();
	}
}