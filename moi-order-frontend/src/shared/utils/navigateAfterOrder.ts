import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServiceSubmission, TicketOrder } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function navigateAfterSubmission(nav: Nav, submission: ServiceSubmission): void {
  if (submission.payment_authorized) {
    nav.navigate('Payment', { kind: 'submission', submissionId: submission.id });
  } else {
    nav.navigate('OrderDetail', { submissionId: submission.id });
  }
}

export function navigateAfterTicketOrder(nav: Nav, order: TicketOrder): void {
  if (order.payment_authorized) {
    nav.navigate('Payment', { kind: 'ticket_order', ticketOrderId: order.id });
  } else {
    nav.navigate('TicketOrderDetail', { ticketOrderId: order.id });
  }
}
