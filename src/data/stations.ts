import type { Station } from '@/types'

export const stations: Station[] = [
  { id: 'A1', name: '台北車站', nameEn: 'Taipei Main Station', isExpress: true },
  { id: 'A2', name: '三重站', nameEn: 'Sanchong', isExpress: false },
  { id: 'A3', name: '新北產業園區站', nameEn: 'New Taipei Industrial Park', isExpress: true },
  { id: 'A4', name: '新莊副都心站', nameEn: 'Xinzhuang Fuduxin', isExpress: false },
  { id: 'A5', name: '泰山站', nameEn: 'Taishan', isExpress: false },
  { id: 'A6', name: '泰山貴和站', nameEn: 'Taishan Guihe', isExpress: false },
  { id: 'A7', name: '體育大學站', nameEn: 'Sport University', isExpress: false },
  { id: 'A8', name: '長庚醫院站', nameEn: 'Chang Gung Memorial Hospital', isExpress: true },
  { id: 'A9', name: '林口站', nameEn: 'Linkou', isExpress: false },
  { id: 'A10', name: '山鼻站', nameEn: 'Shanbi', isExpress: false },
  { id: 'A11', name: '坑口站', nameEn: 'Kengkou', isExpress: false },
  { id: 'A12', name: '機場第一航廈站', nameEn: 'Airport Terminal 1', isExpress: true },
  { id: 'A13', name: '機場第二航廈站', nameEn: 'Airport Terminal 2', isExpress: true },
  { id: 'A14a', name: '機場旅館站', nameEn: 'Airport Hotel', isExpress: false },
  { id: 'A15', name: '大園站', nameEn: 'Dayuan', isExpress: false },
  { id: 'A16', name: '橫山站', nameEn: 'Hengshan', isExpress: false },
  { id: 'A17', name: '領航站', nameEn: 'Linghang', isExpress: false },
  { id: 'A18', name: '高鐵桃園站', nameEn: 'HSR Taoyuan', isExpress: true },
  { id: 'A19', name: '桃園體育園區站', nameEn: 'Taoyuan Sports Park', isExpress: false },
  { id: 'A20', name: '興南站', nameEn: 'Xingnan', isExpress: false },
  { id: 'A21', name: '環北站', nameEn: 'Huanbei', isExpress: true },
]

export const stationMap = new Map(stations.map(s => [s.id, s]))

export function getStationName(id: string): string {
  return stationMap.get(id)?.name ?? id
}
