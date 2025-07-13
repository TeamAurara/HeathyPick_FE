import React from 'react';
import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

export default function CustomCalendars({
  currentDate,
  handleSelectDate,
  getMarkedDates,
  formatDateKey,
}: {
  currentDate: Date;
  handleSelectDate: (dateString: string) => void;
  getMarkedDates: () => Record<string, any>;
  formatDateKey: (date: Date) => string;
}) {
  return (
    <View>
      <Calendar 
        current={formatDateKey(currentDate)}
        onDayPress={(day: DateData) => handleSelectDate(day.dateString)}
        markedDates={{
          ...getMarkedDates(),
          [formatDateKey(currentDate)]: { selected: true, selectedColor: '#22c55e' }
        }}
      />
    </View>
  );
}