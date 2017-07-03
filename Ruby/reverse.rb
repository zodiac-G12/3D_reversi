a = Array.new
p b = File.open("#{ARGV[0]}", "r").read.split(" ").map{|i| i.to_i}
while b != [] do
  a << b.slice!(0, 8).reverse
end
n = a[0].size
file = File.open("#{'rev' ++ ARGV[0]}", "w")
n.times{|i|
  n.times{|j| file.write("#{a[i][j]} ") }
  file.write("\n")
}
