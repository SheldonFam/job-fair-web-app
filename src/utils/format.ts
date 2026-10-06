// shows a time like '9:30 AM' the way each language writes it: '9.30 pagi' in Bahasa Melayu
export const formatTime = (time: string, language: string) => {
  if (language !== 'ms') return time
  return time.replace(':', '.').replace(' AM', ' pagi').replace(' PM', ' petang')
}
