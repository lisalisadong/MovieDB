import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class InitialReviewInsertion {

	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://rindatabase.c2kwkkeairnp.us-east-1.rds.amazonaws.com/RinDataBase";
	static final String USERNAME = "hanabeast";
	static final String PASSWORD = "fyl1990617";
	static final String BUSINESS_PATH = "/Users/Qiannan/Desktop/TMDB/TMDBMovieInfo.json";
	

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
				sql.append("INSERT INTO review VALUES (");
				
				String user_id = "lisalisadong@gmail.com";
				sql.append("'" + user_id + "',");
				
			 	long movie_id = (long) jsonObject.get("id");
		 		sql.append(movie_id + ",");
		 		
		 		double rating = (double) jsonObject.get("userrating");
		 		if (rating == 0)
		 			continue;
		 		sql.append(rating + ",");
		 		
		 		//initially comment == null, date == 11/11/15
		 		sql.append("NULL,'2015-11-11')");

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