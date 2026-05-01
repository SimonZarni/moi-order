import { NavigationProp } from '@react-navigation/native';

import { HOME_CARD_NAV_SCREEN, HomeCardNavScreen } from '@/types/enums';
import { RootStackParamList } from '@/types/navigation';

type Nav = NavigationProp<RootStackParamList>;

type AirportParams = { serviceTypeId: number | null; price: number | null };

/**
 * Navigates to the screen associated with a home card's navigation_screen value.
 * Airport Fast Track requires runtime params fetched separately; pass them via airportParams.
 * Unknown screen values are a no-op — they never crash the app.
 */
export function navigateToCardScreen(
  navigation: Nav,
  screen: HomeCardNavScreen,
  airportParams: AirportParams
): void {
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
      navigation.navigate('PlacesMap');
      break;
    default:
      // Unknown screen from a newer backend — safe no-op
      break;
  }
}
