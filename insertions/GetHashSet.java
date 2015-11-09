package populatingDatabase;

import java.util.HashSet;
import java.util.Set;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.simple.*;
import org.json.simple.parser.*;


public class GetHashSet {
	static Set<Long> actors = new HashSet<>();
	static Set<Long> directors = new HashSet<>();
	
	static final String Build_Path = "/Users/yilunfu/Desktop/ProjectData/TMDB/TMDBMovieInfo.json";
	
	public static void main(String... args) throws IOException, ParseException {
		JSONParser parser = new JSONParser();
		BufferedReader br = new BufferedReader(new FileReader(Build_Path));
		String line;
		while ((line = br.readLine()) != null) {
			
				JSONObject jsonObject = (JSONObject) parser.parse(line);
				JSONArray crews = (JSONArray) jsonObject.get("crew");
				for (int i = 0; i < crews.size(); i++) {
					JSONObject object = (JSONObject) crews.get(i);
					String department = (String) object.get("department");
					if (department.equals("Directing")) {
						long id = (long) object.get("personId");
						directors.add(id);
					}
				}
				JSONArray cast = (JSONArray) jsonObject.get("cast");
				for (int i = 0; i < cast.size(); i++) {
					JSONObject object = (JSONObject) cast.get(i);
					long id = (long) object.get("personId");
					long order = (long) object.get("order");
					if (order < 5) {
						actors.add(id);
					}
				}
				//System.out.println("import done");
		}
		//System.out.println(directors.size());
		//System.out.println(actors.size());
	}
}
