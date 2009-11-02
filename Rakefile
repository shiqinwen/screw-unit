LIB_FILES = [
  "lib/jquery-1.2.3.js",
  "lib/jquery.print.js",
  "lib/screw.builder.js",
  "lib/screw.matchers.js",
  "lib/screw.events.js",
  "lib/screw.behaviors.js",
  "lib/screw.mock.js",
  "lib/screw.stub.js",
  "lib/screw.prototype.js"
]
 
task :build do
  Dir.mkdir 'build' unless File.directory? 'build'
  Dir.mkdir 'build/lib' unless File.directory? 'build/lib'
  
  cp "lib/screw.css", './build/lib/screw.css'
 
  File.open("build/lib/screw.unit.js", 'w') do |fh|
   fh.print LIB_FILES.map {|file| File.read(file)}.join("\n")
  end
 
  File.open("build/suite.html", 'w') do |fh|
    fh.print( <<-EOS
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<title>Screw.Unit results</title>
<script type="text/javascript" src="lib/screw.unit.js"></script>
<link rel="stylesheet" type="text/css" href="lib/screw.css" />
</head>
<body></body>
</html>
EOS
)
  end
end