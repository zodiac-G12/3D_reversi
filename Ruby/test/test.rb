array = [[1,2],[0,-1]]

array.map!{|a| a.map!{|b| b %= 2}}

p array
