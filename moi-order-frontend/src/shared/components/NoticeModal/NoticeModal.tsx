import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { styles } from './NoticeModal.styles';

interface NoticeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function NoticeModal({ isVisible, onClose }: NoticeModalProps): React.JSX.Element {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="warning-outline" size={22} color={colours.warning} />
            <Text style={styles.title}>Notice</Text>
          </View>
          <Text style={styles.body}>
            Moi Order Version 2 မှ ကြိုဆိုပါသည်။ အက်ပ်အား ဆက်လက်အဆင့်မြှင့်တင်နေဆဲဖြစ်၍ ဝန်ဆောင်မှုအချို့အတွက် အဆင်မပြေမှုရှိပါက တောင်းပန်အပ်ပါသည်။
          </Text>
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close notice"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
