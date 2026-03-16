import { LocalNotifications } from '@capacitor/local-notifications'

export function useNotifications() {
  async function requestPermission() {
    const result = await LocalNotifications.requestPermissions()
    return result.display === 'granted'
  }

  async function scheduleReminder(id: number, title: string, body: string, at: Date) {
    const granted = await requestPermission()
    if (!granted) return
    await LocalNotifications.schedule({
      notifications: [{
        id,
        title,
        body,
        schedule: { at },
        sound: undefined,
        actionTypeId: '',
        extra: null,
      }],
    })
  }

  async function cancelReminder(id: number) {
    await LocalNotifications.cancel({ notifications: [{ id }] })
  }

  return { scheduleReminder, cancelReminder, requestPermission }
}
