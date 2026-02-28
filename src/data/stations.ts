import type { Station } from '@/types'

export const stations: Station[] = [
  { id: 'A1', name: 'A1 台北車站', nameEn: 'Taipei Main Station', isExpress: true },
  { id: 'A2', name: 'A2 三重站', nameEn: 'Sanchong', isExpress: false },
  { id: 'A3', name: 'A3 新北產業園區站', nameEn: 'New Taipei Industrial Park', isExpress: true },
  { id: 'A4', name: 'A4 新莊副都心站', nameEn: 'Xinzhuang Fuduxin', isExpress: false },
  { id: 'A5', name: 'A5 泰山站', nameEn: 'Taishan', isExpress: false },
  { id: 'A6', name: 'A6 泰山貴和站', nameEn: 'Taishan Guihe', isExpress: false },
  { id: 'A7', name: 'A7 體育大學站', nameEn: 'Sport University', isExpress: false },
  { id: 'A8', name: 'A8 長庚醫院站', nameEn: 'Chang Gung Memorial Hospital', isExpress: true },
  { id: 'A9', name: 'A9 林口站', nameEn: 'Linkou', isExpress: false },
  { id: 'A10', name: 'A10 山鼻站', nameEn: 'Shanbi', isExpress: false },
  { id: 'A11', name: 'A11 坑口站', nameEn: 'Kengkou', isExpress: false },
  { id: 'A12', name: 'A12 機場第一航廈站', nameEn: 'Airport Terminal 1', isExpress: true },
  { id: 'A13', name: 'A13 機場第二航廈站', nameEn: 'Airport Terminal 2', isExpress: true },
  { id: 'A14a', name: 'A14a 機場旅館站', nameEn: 'Airport Hotel', isExpress: false },
  { id: 'A15', name: 'A15 大園站', nameEn: 'Dayuan', isExpress: false },
  { id: 'A16', name: 'A16 橫山站', nameEn: 'Hengshan', isExpress: false },
  { id: 'A17', name: 'A17 領航站', nameEn: 'Linghang', isExpress: false },
  { id: 'A18', name: 'A18 高鐵桃園站', nameEn: 'HSR Taoyuan', isExpress: true },
  { id: 'A19', name: 'A19 桃園體育園區站', nameEn: 'Taoyuan Sports Park', isExpress: false },
  { id: 'A20', name: 'A20 興南站', nameEn: 'Xingnan', isExpress: false },
  { id: 'A21', name: 'A21 環北站', nameEn: 'Huanbei', isExpress: true },
]

export const stationMap = new Map(stations.map(s => [s.id, s]))

export function getStationName(id: string): string {
  return stationMap.get(id)?.name ?? id
}
