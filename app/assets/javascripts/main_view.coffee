class MainView
  constructor: () ->
    @validated = ko.observable(false)
    @value = ko.observable(1000)
    @status = ko.observable("Verified")
    @address = ko.observable("466 41st St, Oakland, CA")

    @production = ko.computed =>
      Math.round(@value() * 2)

    @consumption = ko.computed =>
      Math.round(@value() * 2.25)

    @bid1 = ko.computed =>
      Math.round(@value() * 1.1)

    @bid2 = ko.computed =>
      Math.round(@value() * 1.075)

    @bid3 = ko.computed =>
      Math.round(@value() * 1.05)

    @bid1Formatted = ko.computed =>
      str = String(@bid1())
      str = str.split("").reverse().chunk(3).map((x) -> x.join("") ).join(",").split("").reverse().join("")
      "$ " + str

    @bid2Formatted = ko.computed =>
      str = String(@bid2())
      str = str.split("").reverse().chunk(3).map((x) -> x.join("") ).join(",").split("").reverse().join("")
      "$ " + str

    @bid3Formatted = ko.computed =>
      str = String(@bid3())
      str = str.split("").reverse().chunk(3).map((x) -> x.join("") ).join(",").split("").reverse().join("")
      "$ " + str

    @valueFormatted = ko.computed =>
      str = String(@value())
      str = str.split("").reverse().chunk(3).map((x) -> x.join("") ).join(",").split("").reverse().join("")
      "$ " + str

    @valueProduction = ko.computed =>
      str = String(@production())
      str = str.split("").reverse().chunk(3).map((x) -> x.join("") ).join(",").split("").reverse().join("")
      str + "kWh"

    @valueConsumption = ko.computed =>
      str = String(@consumption())
      str = str.split("").reverse().chunk(3).map((x) -> x.join("") ).join(",").split("").reverse().join("")
      str + "kWh"

  requestReferral: () =>
    console.log('requestReferral')

  verify: () =>
    $('#map-overlay').show()
    $('.utility-popup').show()
    setTimeout (->
      $('.utility-iframe').attr 'src', UTILITY_API_ENDPOINT
      $('#map-overlay').addClass 'fade-in'
      $('.utility-popup').addClass 'fade-in'
      return
    ), 100
    $('#map-overlay').click =>
      $('#map-overlay').removeClass 'fade-in'
      $('.utility-popup').removeClass 'fade-in'
      setTimeout (=>
        $('#map-overlay').hide()
        $('.utility-popup').hide()
        @updateQuote()
        return
      ), 1000
      return

  updateQuote: () =>
    @validated(true)
    @value(Math.round(@value()*1.1))

  streetView: () =>
    address = encodeURIComponent(@address())
    "https://maps.googleapis.com/maps/api/streetview?size=400x200&location=#{address}&fov=90&heading=235&pitch=10&key=AIzaSyAWHGPmYjY6LL3WdhdDH2e_m4W4MfOrBWM"

window.MainView = MainView
