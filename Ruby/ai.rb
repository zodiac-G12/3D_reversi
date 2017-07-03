def maxer(array, twoExist, epsilon)
  epsilonMax = 1.0
  if epsilon > 0 && epsilon > Random.new(Random.new_seed).rand(epsilonMax)
    return randkun(array, twoExist)
  else
    board = Array.new
    @n.times{|i| @n.times{|j| board << [i, j] if array[i][j] == 2}}
    max = @saveMeArray[board[0][0]][board[0][1]] + @saveYouArray[board[0][0]][board[0][1]]
    place = 0
    twoExist.times{|i|
      if max < @saveMeArray[board[i][0]][board[i][1]] + @saveYouArray[board[i][0]][board[i][1]]
        max = @saveMeArray[board[i][0]][board[i][1]] + @saveYouArray[board[i][0]][board[i][1]]
        place = i
      end
    }
    return board[place]
  end
end


def randkun(array, twoExist)
  board = Array.new
  @n.times{|i| @n.times{|j| board << [i, j] if array[i][j] == 2}}
  place = Random.new(Random.new_seed).rand(twoExist)
  return board[place]
end


def semiManabukun(array, twoExist, epsilon)
  return maxer(array, twoExist, epsilon)
end


def playLoop(sample, color, skip, flag)
  rand = 0
  @n.times{|i| @n.times{|j| @saveArray[i][j] = 0 if @saveArray[i][j] == 2}}
  @saveBlackPoint = @saveWhitePoint = 0
  
  canPut(@saveArray, color)

  twoExist = @saveArray.flatten.count(2)

  if twoExist == 0
    if skip == 0
      playLoop([], color*-1, 1, flag)
    else
      @saveBlackPoint = @saveArray.flatten.count(1)
      @saveWhitePoint = @saveArray.flatten.count(-1)
      if @saveBlackPoint > @saveWhitePoint
        return 1
      elsif @saveBlackPoint < @saveWhitePoint
        return -1
      else
        return 0
      end
    end

  else
    if @randkunColor != color
      ab = randkun(@saveArray, twoExist)
    else
      if sample == []
        if rand = 1
          ab = randkun(@saveArray, twoExist)
          rand = 0
        else
          ab = semiManabukun(@saveArray, twoExist, 0.3)
        end
      else
        ab = sample
        rand = 1
      end
    end
    a = ab[0]; b = ab[1]
    river(@saveArray, color, a, b)
    @saveArray[a][b] = color
    playLoop([], color*-1, 0, flag)
  end
end


def epi(sample, color, time)
  win = 0; lose = 0
  time.times{|i|
    @saveArray = Marshal.load(Marshal.dump(@array))
    if (result = playLoop(sample, color, 0, i)) == 1
      win += 1
    elsif result == -1
      lose += 1
    end
  }
  if lose == 0 && win != 0
    return win.to_f*2
  elsif win == 0 && lose != 0
    return 0.01/lose.to_f
  elsif win == 0 && lose == 0
    return 1
  else
    return win / lose.to_f
  end
end


def bakuchikun(twoExist, color, step)
  board = Array.new
  list = Array.new
  if step < 30
    spin = 13
  elsif step < 40
    spin = 15
  else
    spin = 20
  end
  @n.times{|i| @n.times{|j| board << [i, j] if @array[i][j] == 2}}
  if (like = @luckyPoint & board) != []
    return like[0]  
  else
    @unluckyPoint = []
    @subluckyPoint = []
    3.times{|i|
      3.times{|j|
        @luckyPoint.each{|a,b|
          @unluckyPoint << [a+i-1, b+j-1] if (i-1 != 0 || j-1 != 0) && 0 <= a+i-1 && 0 <= b+j-1 && a+i-1 < @n && b+j-1 < @n && @array[a][b] != color
          @subluckyPoint << [a+i-1, b+j-1] if (i-1 != 0 || j-1 != 0) && 0 <= a+i-1 && 0 <= b+j-1 && a+i-1 < @n && b+j-1 < @n && @array[a][b] == color
        }
      }
    }
    (@unluckyPoint.length).times{|i| board.slice!(board.index(@unluckyPoint[i])) if board.include?(@unluckyPoint[i]) && board.length > 1}
    if board.length == 1
      return board[0]
    elsif @subluckyPoint & board != []
      return (@subluckyPoint & board)[0]
    else
      boardSave = Marshal.load(Marshal.dump(board))
      (board.length < spin ? board.length : spin).times{|i|
        max = @saveMeArray[board[0][0]][board[0][1]] + @saveYouArray[board[0][0]][board[0][1]]
        place = 0
        (board.length).times{|j|
          if max < @saveMeArray[board[j][0]][board[j][1]] + @saveYouArray[board[j][0]][board[j][1]]
            max = @saveMeArray[board[j][0]][board[j][1]] + @saveYouArray[board[j][0]][board[j][1]]
            place = j
          end
        }
        if i == 0
          list << epi([board[place][0], board[place][1]], color, 20+spin) * 1.2
        elsif i == 1
          list << epi([board[place][0], board[place][1]], color, 15+spin) * 1.1
        else
          list << epi([board[place][0], board[place][1]], color, 13+spin) * 1.0
        end
        board.slice!(place)
      }
      return boardSave[list.index(list.max)]
    end
  end
end
