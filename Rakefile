require 'json'
require 'faraday'
require 'colorize'

desc "Output JSON of challenge paths"
task :generate_challenge_paths do
  list = []
  Dir['source/tingkat/*'].each do |path1|
    Dir[path1 + '/*'].each do |path2|
      list << (path2.split('source/tingkat/').last.split('.md').first)
    end
  end

  File.open('source/challenge_paths.json', 'w') do |f|
    f.write JSON.generate challenge_paths: list
  end
end

desc "Make sure all challenge pages returns 200 success"
task test_success: [:generate_challenge_paths] do
  conn = Faraday.new(url: "http://localhost:4567") do |faraday|
    faraday.request  :url_encoded             # form-encode POST params
    faraday.adapter  Faraday.default_adapter  # make requests with Net::HTTP
  end

  json = JSON.parse File.read "source/challenge_paths.json"
  all_paths = json["challenge_paths"] || []
  paths_with_error = []
  all_paths.each do |path|
    full_path = "/tingkat/" + path + ".html"
    response = conn.get full_path
    if response.status.to_i == 200
      print '.'.green
    else
      print 'F'.red
    end
  end

  puts
  bad_count = paths_with_error.size
  puts "#{all_paths.size - bad_count} Good Pages, #{bad_count} Bad Pages"
  puts

  unless paths_with_error.empty?
    puts "Paths with error:"
    paths_with_error.each do |path|
      puts path
    end
    puts
  end
end
