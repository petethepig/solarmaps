class MainView
  constructor: () ->
    @value = ko.observable("$ 1,000")
    @address = ko.observable("466 41st St, Oakland, CA")

  verify: () =>
    console.log('verify')

  streetView: () =>
    address = encodeURIComponent(@address())
    "https://maps.googleapis.com/maps/api/streetview?size=400x200&location=#{address}&fov=90&heading=235&pitch=10&key=AIzaSyAWHGPmYjY6LL3WdhdDH2e_m4W4MfOrBWM"

window.MainView = MainView
