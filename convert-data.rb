require 'json'
require 'http'

ctx      = OpenSSL::SSL::SSLContext.new
ctx.verify_mode = OpenSSL::SSL::VERIFY_NONE

data = File.read("public/data.json")
data = JSON.parse(data)

result = []

data.each do |address, lat, lng|
  url = "https://www.google.com/async/sclp?async=lat:#{lat},lng:#{lng},_fmt:json&ei=HJU3V4eKtHIjwOJqaeQDw&yv=2"
  str = HTTP.get(url, :ssl_context => ctx).to_s[5..-1]
  json = JSON.parse(str)
  arr = json["HouseInfoResponse"]["solar_savings_for_bill"]
  plan = arr.find { |x| x["average_monthly_bill"] == 30 }
  bill = plan["solar_savings_for_bill_and_size"]
  if bill
    savings = bill.first["infull_details"]["twenty_year_savings"]
    # puts 
    result << [address, lat, lng, savings]
  end
end

puts result.to_json
