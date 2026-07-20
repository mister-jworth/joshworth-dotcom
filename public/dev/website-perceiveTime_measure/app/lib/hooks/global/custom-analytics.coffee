$ = require 'jquery'

ENABLE_TRACKING = false
CUSTOM_ANALYTICS_ATTR = '[data-custom-analytics-event]'

if ENABLE_TRACKING
  $(document).on 'click', CUSTOM_ANALYTICS_ATTR, (e) ->
    event = $(e.currentTarget).closest(CUSTOM_ANALYTICS_ATTR).data('custom-analytics-event')

    # track this event with your favorite custom analytics tool here:
    #   analyticsTool.track event

    # and maybe you'll also need to manually track route changes on router.coffee, like this:
    #   router.on 'route', => analyticsTool?.track()
