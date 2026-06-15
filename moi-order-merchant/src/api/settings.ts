import { apiClient } from './client';

export interface AlarmSoundResponse {
  data: { alarm_sound_url: string | null };
}

export async function getAlarmSound(): Promise<AlarmSoundResponse> {
  const res = await apiClient.get<AlarmSoundResponse>('/alarm-sound');
  return res.data;
}
