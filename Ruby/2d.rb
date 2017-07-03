# encoding: utf-8

require "./ai"



########################################
#               Define                 #
########################################

@n = 8
@array = Array.new(@n){Array.new(@n, 0)}
#@saveArray = Marshal.load(Marshal.dump(@array))
@meArray = Marshal.load(Marshal.dump(@array))
@youArray = Marshal.load(Marshal.dump(@array))
@battle = 1
@randkunColor = 1
@win = 0
@blackWinTime = 0
@whiteWinTime = 0
@drawTime = 0
@luckyPoint = [[0,0],[@n-1,0],[0,@n-1],[@n-1,@n-1]]

2.times{|i| 2.times{|j| @array[@n/2-i][@n/2-j] = (i == j) ? -1 : 1}} #初期配置


########################################
#            Define Function           #
########################################

def printer
  print "b＼a"
  @n.times{|i| print "  #{i}"}; print "\n    "
  puts "― ―― ―― ―― ―― ―― ―― ―― ―"
  @n.times{|i| @n.times{|j|
    print " #{i} |" if j == 0
    if @array[j][i] == 0
      print " □ "
    elsif @array[j][i] == 1
      print " ● "
    elsif @array[j][i] == -1
      print " ◯ "
    elsif @array[j][i] == 2
      print " 　"
    end
    }; puts ""
  }
end


def go(array, color, stayA, stayB, a, b, i, j, count)
  if array[a][b] == color * -1 && 0 <= a+i && 0 <= b+j && a+i < @n && b+j < @n
    go(array, color, stayA, stayB, a+i, b+j, i, j, count+1)
  elsif array[a][b] == color && count > 0
    array[stayA][stayB] = 2
  end
end


def search(array, color, a, b)
  3.times{|i| 3.times{|j| go(array, color, a, b, a+i-1, b+j-1, i-1, j-1, 0) if (i-1 != 0 || j-1 != 0) && 0 <= a+i-1 && 0 <= b+j-1 && a+i-1 < @n && b+j-1 < @n}}
end


def canPut(array, color)
  @n.times{|i| @n.times{|j| search(array, color, i, j) if array[i][j] == 0}}
end


def judas(array, color, a, b, i, j, count)
  if array[a][b] == color * -1 && 0 <= a+i && 0 <= b+j && a+i < @n && b+j < @n
    judas(array, color, a+i, b+j, i, j, count+1)
  elsif array[a][b] == color && count > 0
    count.times{|k| array[a+(k+1)*i*-1][b+(k+1)*j*-1] = color}
  end
end


def river(array, color, a, b)
  3.times{|i| 3.times{|j| judas(array, color, a+i-1, b+j-1, i-1, j-1, 0) if (i-1 != 0 || j-1 != 0) && 0 <= a+i-1 && 0 <= b+j-1 && a+i-1 < @n && b+j-1 < @n}}
end


def play(color, skip, step)
  #2->0
  @n.times{|i| @n.times{|j| @array[i][j] = 0 if @array[i][j] == 2}}
  @blackPoint = @whitePoint = 0

  canPut(@array, color)
  printer

  twoExist = @array.flatten.count(2)

  if twoExist == 0
    if skip == 0
      puts "Skip."
      play(color*-1, 1, step+1)
    else
      @blackPoint = @array.flatten.count(1)
      @whitePoint = @array.flatten.count(-1)
      if @blackPoint > @whitePoint
        puts "Black:#{@blackPoint}, White:#{@whitePoint}\nBlack WIN!"
        @win = 1
        @blackWinTime += 1
      elsif @blackPoint < @whitePoint
        puts "Black:#{@blackPoint}, White:#{@whitePoint}\nWhite WIN!"
        @win = -1
        @whiteWinTime += 1
      else
        puts "DRAW."
        @drawTime += 1
      end
    end
  
  else
    if @playMethod == 2 || (@playMethod == 1 && @randkunColor == color)
      puts "#{color == 1 ? "Black" : "White"}, Randkun#{(color == 1 ? 1 : 2)} Turn."
      if @randkunColor != color
        ab = randkun(@array, twoExist)
      else
        if step < 5
          ab = semiManabukun(@array, twoExist, 0.1)
        else
          ab = bakuchikun(twoExist, color, step)
        end
      end
      a = ab[0]; b = ab[1]
      puts "put #{a} #{b}"
      if @randkunColor == color
        @meArray[a][b] = 1
      end
    else
      loop{
        puts "#{color == 1 ? "Black" : "White"} Turn.", "Please input (a,b)."
        numStr = gets.to_s.chomp!.split(" ")
        a = numStr[0].to_i; b = numStr[1].to_i
        break if @array[a][b] == 2
      }
    end
    if @playMethod != 0 && @randkunColor != color
      @youArray[a][b] = 1
    end
    river(@array, color, a, b)
    @array[a][b] = color
    play(color*-1, 0, step+1)
  end
end


def aiBattle
  @saveMeArray = Array.new
  @saveYouArray = Array.new
  filename = ["me.txt","you.txt"]
  filename.each{|name|
    File.open("#{name}").map{|str|
      if name == "me.txt"
        @saveMeArray << str.chomp!.split(" ").map{|i| i.to_i}
      else
        @saveYouArray << str.chomp!.split(" ").map{|i| i.to_i}
      end
    }
  }

  @array = Array.new(@n){Array.new(@n, 0)}
  @meArray = Marshal.load(Marshal.dump(@array))
  @youArray = Marshal.load(Marshal.dump(@array))
  @win = 0
  2.times{|i| 2.times{|j| @array[@n/2-i][@n/2-j] = (i == j) ? -1 : 1}} #初期配置

  play(1, 0, 0)

  if(@win != 0)
    File.open("me.txt", "w"){|file|
      @n.times{|i| @n.times{|j|
        file.print "#{@saveMeArray[i][j] + (@win == 1 ? @meArray[i][j] : (@meArray[i][j] * -1))} "
      }
      file.puts ""}
    }
    File.open("you.txt", "w"){|file|
      @n.times{|i| @n.times{|j|
        file.print "#{@saveYouArray[i][j] + (@win == 1 ? (@youArray[i][j] * -1) : @youArray[i][j])} "
      }
      file.puts ""}
    }
  end
end



#########################################
#                main                   #
#########################################

puts "How do you play?", "0 => Human vs. Human", "1 => Human vs. Randkun", "2 => Randkun vs. Randkun"
@playMethod = gets.to_i

if @playMethod == 2
  puts "How time do?"
  @battle = gets.to_i
end

if @playMethod == 1
  puts "First Player: (-1 => Human, 1 => Randkun)"
  @randkunColor = gets.to_i
end


if @playMethod == 0
  play(1, 0, 0)
elsif @playMethod == 1
  aiBattle
else 
  @battle.times{aiBattle}
  puts "Black WIN:#{@blackWinTime}, White WIN:#{@whiteWinTime}, DRAW:#{@drawTime}\nWin:#{(@blackWinTime / (@blackWinTime + @whiteWinTime).to_f * 100).to_s[0..5].to_f}%"
end
