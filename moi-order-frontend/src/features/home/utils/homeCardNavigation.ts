import { Linking } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EMERGENCY_CONTACT_TYPE, EmergencyContactType, HOME_CARD_NAV_SCREEN, HOME_CARD_ROUTE_TYPE } from '@/types/enums';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type AirportParams = { serviceTypeId: number | null; serviceId: number | null; serviceName: string | null; price: number | null };

/**
 * Navigates to the screen associated with a home card.
 * External URL routes open in the system browser via Linking.
 * Internal routes map to known mobile screens via switch-case.
 * Unknown internal keys are a safe no-op — they never crash the app.
 */
export function navigateToCardScreen(
  navigation: Nav,
  screen: string | null,
  routeType: string,
  routeUrl: string | null,
  airportParams: AirportParams,
  navigationParams?: Record<string, unknown> | null
): void {
  if (screen === null) return;

  if (routeType === HOME_CARD_ROUTE_TYPE.ExternalUrl) {
    if (routeUrl) {
      Linking.openURL(routeUrl).catch(() => {
        // silent failure — URL may be malformed or app not installed
      });
    }
    return;
  }

  switch (screen) {
    case HOME_CARD_NAV_SCREEN.NinetyDayReport:
      navigation.navigate('NinetyDayReport');
      break;
    case HOME_CARD_NAV_SCREEN.Places:
      navigation.navigate('Places');
      break;
    case HOME_CARD_NAV_SCREEN.Tickets:
      navigation.navigate('Tickets');
      break;
    case HOME_CARD_NAV_SCREEN.OtherServices:
      navigation.navigate('OtherServices');
      break;
    case HOME_CARD_NAV_SCREEN.CompanyServices:
      navigation.navigate('CompanyServices');
      break;
    case HOME_CARD_NAV_SCREEN.EmbassyServices:
      navigation.navigate('EmbassyServices');
      break;
    case HOME_CARD_NAV_SCREEN.AirportFastTrack:
      if (airportParams.serviceTypeId !== null && airportParams.serviceId !== null && airportParams.price !== null) {
        navigation.navigate('GenericServiceForm', {
          serviceTypeId: airportParams.serviceTypeId,
          serviceId:     airportParams.serviceId,
          serviceName:   airportParams.serviceName ?? 'Airport Fast Track',
          price:         airportParams.price,
        });
      }
      break;
    case HOME_CARD_NAV_SCREEN.Food:
      navigation.navigate('Food');
      break;
    case HOME_CARD_NAV_SCREEN.PassportVault:
      navigation.navigate('PassportVault');
      break;
    case HOME_CARD_NAV_SCREEN.Search:
      navigation.navigate('Search');
      break;
    case HOME_CARD_NAV_SCREEN.PlacesMap:
      navigation.navigate('MainTabs', { screen: 'Map' });
      break;
    case HOME_CARD_NAV_SCREEN.PassportCiServices:
      navigation.navigate('PassportCiServices');
      break;
    case HOME_CARD_NAV_SCREEN.EmergencyContactList: {
      const typeParam = navigationParams?.type as string | undefined;
      const validTypes: EmergencyContactType[] = Object.values(EMERGENCY_CONTACT_TYPE);
      if (typeParam && (validTypes as string[]).includes(typeParam)) {
        navigation.navigate('EmergencyContactList', { type: typeParam as EmergencyContactType });
      }
      break;
    }
    case HOME_CARD_NAV_SCREEN.HospitalList:
      navigation.navigate('HospitalList');
      break;
    case HOME_CARD_NAV_SCREEN.PoliceStationList:
      navigation.navigate('PoliceStationList');
      break;
    case HOME_CARD_NAV_SCREEN.RescueTeamList:
      navigation.navigate('RescueTeamList');
      break;
    // Legacy key still stored in DB for existing cards — bridge to specific screens
    case 'SafetyLocationList':
    case 'safety-location-list': {
      const cat = (navigationParams?.category ?? navigationParams?.type) as string | undefined;
      if (cat === 'hospital')        navigation.navigate('HospitalList');
      else if (cat === 'police_station') navigation.navigate('PoliceStationList');
      else if (cat === 'rescue')     navigation.navigate('RescueTeamList');
      break;
    }
    default:
      // Internal route key unknown to this app version — safe no-op
      break;
  }
}
