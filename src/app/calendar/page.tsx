import DatePickerComponent from '../../components/Calendar';
import React from 'react';


const App: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <DatePickerComponent />
    </div>
  );
};

export default App;