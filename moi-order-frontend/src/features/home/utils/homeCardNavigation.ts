import { Linking } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EMERGENCY_CONTACT_TYPE, EmergencyContactType, HOME_CARD_NAV_SCREEN, HOME_CARD_ROUTE_TYPE } from '@/types/enums';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type AirportParams = { serviceTypeId: number | null; price: number | null };

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
      if (airportParams.serviceTypeId !== null && airportParams.price !== null) {
        navigation.navigate('AirportFastTrackForm', {
          serviceTypeId: airportParams.serviceTypeId,
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
    case HOME_CARD_NAV_SCREEN.EmergencyContactList: {
      const typeParam = navigationParams?.type as string | undefined;
      const validTypes: EmergencyContactType[] = Object.values(EMERGENCY_CONTACT_TYPE);
      if (typeParam && (validTypes as string[]).includes(typeParam)) {
        navigation.navigate('EmergencyContactList', { type: typeParam as EmergencyContactType });
      }
      break;
    }
    default:
      // Internal route key unknown to this app version — safe no-op
      break;
  }
}
