@n = 8
@filename=["me", "you"]

@filename.each{|str|
  File.open("#{str}.txt", "w"){|file|
    @n.times{ @n.times{
      file.print "0 "
    }
    file.puts ""}
  }
}
