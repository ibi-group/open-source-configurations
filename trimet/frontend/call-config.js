import { getCompanyIcon, TriMetLegIcon, TriMetModeIcon } from '@opentripplanner/icons'
import React, { Suspense } from 'react'
import { getCompanyFromLeg } from '@opentripplanner/core-utils/lib/itinerary'

import {
  DefaultItinerary,
  FormattedMode,
  MobileResultsScreen,
  MobileSearchScreen
} from '../lib'
import CallHistoryWindow from '../lib/components/admin/call-history-window'
import CallTakerControls from '../lib/components/admin/call-taker-controls'
import CallTakerPanel from '../lib/components/app/call-taker-panel'
import FieldTripWindows from '../lib/components/admin/field-trip-windows'
import MailablesWindow from '../lib/components/admin/mailables-window'

/**
 * Custom itinerary footer for this deployment.
 */
const ItineraryFooter = () => (
  <div className='disclaimer'>
    Before you go, check{' '}
    <a
      href='https://trimet.org/#/tracker/'
      target='_blank'>
      TransitTracker
    </a> for real-time arrival information and any Service Alerts that may
    affect your trip. You can also
    <a
      href='https://trimet.org/tools/transittracker-bytext.htm'
      target='_blank'>
      text your Stop ID to 27299
    </a> or call 503-238-RIDE (7433), option 1. Times and directions are for
    planning purposes only, and can be affected by traffic, road conditions,
    detours and other factors.
    <div className='link-row'>
      <a href='https://trimet.org/legal/index.htm' target='_blank'>
        Terms of Use
      </a> •{' '}
      <a href='https://trimet.org/legal/privacy.htm' target='_blank'>
        Privacy Policy
      </a>
    </div>
  </div>
)

const PORTLAND_STREETCAR = 'Portland Streetcar'

// Override default leg icon to support OTP2
const LegIcon = (props) => {
  const company = getCompanyFromLeg(props.leg) || ''
  const CompanyIcon = getCompanyIcon(company)

  if (CompanyIcon) {
    return (
      <Suspense fallback={company || 'Loading...'}>
        <CompanyIcon />
      </Suspense>
    )
  }

  return props.leg.mode === 'SCOOTER' ? (
    <TriMetModeIcon mode='SCOOTER' {...props} />
  ) : (
    <TriMetLegIcon {...props} />
  )
}

/**
 * Renders 'Portland Streetcar' instead of 'MAX' for the OTP 'TRAM' mode
 * associated to Portland Streetcar routes.
 */
const TriMetTransitModes = ({ leg }) => {
  const { mode, routeLongName } = leg
  return (mode?.toLowerCase() === 'tram' && routeLongName?.startsWith(PORTLAND_STREETCAR))
    ? <>{PORTLAND_STREETCAR}</>
    : <FormattedMode mode={mode} />
}

/**
 * @param  {Object} otpConfig The contents of the yml config file as json.
 * @return An object with attributes defining the components that handle various parts of the UI.
 *         See /otp/default-config.js for a complete description of these attributes.
 */
export function configure(otpConfig) {
  return {
    ItineraryBody: DefaultItinerary,
    ItineraryFooter,
    LegIcon,
    MainControls: CallTakerControls,
    MainPanel: CallTakerPanel,
    MapWindows: () => <>
      <CallHistoryWindow />
      <FieldTripWindows />
      <MailablesWindow />
    </>,
    MobileResultsScreen,
    MobileSearchScreen,
    ModeIcon: TriMetModeIcon,
    TransitModes: TriMetTransitModes,
    getTransitiveRouteLabel: (itineraryLeg) => {
      if (!itineraryLeg.routeShortName) return itineraryLeg.routeLongName
      return itineraryLeg.routeShortName // null or undefined or empty string will tell transitive-js to not render a route label.
    }
  }
}
