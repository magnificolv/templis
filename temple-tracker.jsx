import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Award, Check, X } from 'lucide-react';

export default function TempleTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayData, setTodayData] = useState(null);
  const [view, setView] = useState('today');
  const [weekData, setWeekData] = useState([]);
  const [loading, setLoading] = useState(true);

  const goodHabits = [
    { id: 'meditation', name: 'Meditācija', unit: 'min', icon: '🧘' },
    { id: 'learning', name: 'Mācīšanās', unit: 'min', icon: '📚' },
    { id: 'workout', name: 'Treniņš', unit: 'min', icon: '💪' },
    { id: 'emotional', name: 'Emocionālā saite', unit: 'min', icon: '❤️' },
    { id: 'intimacy', name: 'Fiziskā tuvība', unit: '', icon: '💑' },
    { id: 'protein', name: 'Proteīns', unit: 'g', icon: '🥩' },
    { id: 'healthy_food', name: 'Veselīgs uzturs', unit: '', icon: '🥗' },
    { id: 'supplements', name: 'Vitamīni', unit: '', icon: '💊' }
  ];

  const badHabits = [
    { id: 'alcohol', name: 'Alkohols', unit: 'drinks', icon: '🍺' },
    { id: 'cigarettes', name: 'Cigaretes', unit: 'gab.', icon: '🚬' },
    { id: 'junk_food', name: 'Neveselīgi ēdieni', unit: '', icon: '🍔' }
  ];

  useEffect(() => {
    loadTodayData();
    loadWeekData();
  }, [selectedDate]);

  const loadTodayData = async () => {
    setLoading(true);
    try {
      const result = await window.storage.get(`tracking:${selectedDate}`);
      if (result && result.value) {
        setTodayData(JSON.parse(result.value));
      } else {
        setTodayData({});
      }
    } catch (error) {
      console.log('No data for this date');
      setTodayData({});
    }
    setLoading(false);
  };

  const loadWeekData = async () => {
    try {
      const result = await window.storage.list('tracking:');
      if (result && result.keys) {
        const dates = result.keys.map(key => key.replace('tracking:', ''));
        
        // Filter dates for current month
        const currentMonth = selectedDate.slice(0, 7); // YYYY-MM
        const currentMonthDates = dates.filter(date => date.startsWith(currentMonth));
        
        const monthPromises = currentMonthDates.map(async (date) => {
          try {
            const data = await window.storage.get(`tracking:${date}`);
            return { date, data: data ? JSON.parse(data.value) : {} };
          } catch {
            return { date, data: {} };
          }
        });
        
        const monthData = await Promise.all(monthPromises);
        setWeekData(monthData);
      }
    } catch (error) {
      console.log('Error loading month data');
      setWeekData([]);
    }
  };

  const updateHabit = async (habitId, value) => {
    const newData = { ...todayData, [habitId]: value };
    setTodayData(newData);
    
    try {
      await window.storage.set(`tracking:${selectedDate}`, JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const calculateStreak = (habitId) => {
    let streak = 0;
    const sortedDays = [...weekData].sort((a, b) => b.date.localeCompare(a.date));
    
    for (let day of sortedDays) {
      if (day.data[habitId] && day.data[habitId] !== '0' && day.data[habitId] !== '') {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const HabitCard = ({ habit, isGood }) => {
    const value = todayData?.[habit.id] || '';
    const streak = calculateStreak(habit.id);
    
    return (
      <div className={`p-4 rounded-lg border-2 ${isGood ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{habit.icon}</span>
            <span className="font-semibold text-gray-800">{habit.name}</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-orange-600 text-sm font-bold">
              <Award className="w-4 h-4" />
              {streak}d
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {habit.unit ? (
            <>
              <input
                type="number"
                value={value}
                onChange={(e) => updateHabit(habit.id, e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="px-3 py-2 text-gray-600 font-medium">{habit.unit}</span>
            </>
          ) : (
            <button
              onClick={() => updateHabit(habit.id, value ? '' : '✓')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                value 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {value ? '✓ Izdarīts' : 'Atzīmēt'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const calculateHabitStats = (habitId, habitUnit) => {
      let count = 0;
      let total = 0;
      
      weekData.forEach(({ data }) => {
        const value = data[habitId];
        if (value && value !== '0' && value !== '') {
          count++;
          if (habitUnit) {
            // If has unit, sum the values
            const numValue = parseFloat(value) || 0;
            total += numValue;
          }
        }
      });
      
      return { count, total };
    };

    const currentMonth = new Date(selectedDate).toLocaleDateString('lv-LV', { month: 'long', year: 'numeric' });

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">{currentMonth}</h3>
        </div>

        {/* Positive Habits */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
          <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Pozitīvie
          </h3>
          <div className="space-y-3">
            {goodHabits.map(habit => {
              const stats = calculateHabitStats(habit.id, habit.unit);
              if (stats.count === 0) return null;
              
              return (
                <div key={habit.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{habit.icon}</span>
                    <span className="font-medium text-gray-800">{habit.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{stats.count}x</div>
                    {habit.unit && stats.total > 0 && (
                      <div className="text-sm text-gray-600">
                        kopā {Math.round(stats.total)} {habit.unit}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {goodHabits.every(h => calculateHabitStats(h.id, h.unit).count === 0) && (
              <div className="text-center text-gray-500 py-4">
                Vēl nav datu šajā mēnesī
              </div>
            )}
          </div>
        </div>

        {/* Negative Habits */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5">
          <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Negatīvie
          </h3>
          <div className="space-y-3">
            {badHabits.map(habit => {
              const stats = calculateHabitStats(habit.id, habit.unit);
              if (stats.count === 0) return null;
              
              return (
                <div key={habit.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{habit.icon}</span>
                    <span className="font-medium text-gray-800">{habit.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">{stats.count}x</div>
                    {habit.unit && stats.total > 0 && (
                      <div className="text-sm text-gray-600">
                        kopā {Math.round(stats.total)} {habit.unit}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {badHabits.every(h => calculateHabitStats(h.id, h.unit).count === 0) && (
              <div className="text-center text-green-600 font-semibold py-4">
                🎉 Šajā mēnesī neviens negatīvs ieradums!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Ielādē...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏛️ Manis Templis</h1>
          <p className="text-gray-600">Katru dienu tuvāk labākai versijai</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm">
          <button
            onClick={() => setView('today')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              view === 'today' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Šodien
          </button>
          <button
            onClick={() => setView('stats')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              view === 'stats' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Statistika
          </button>
        </div>

        {/* Date selector */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {view === 'today' ? (
          <>
            {/* Good Habits */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Veselīgas lietas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goodHabits.map(habit => (
                  <HabitCard key={habit.id} habit={habit} isGood={true} />
                ))}
              </div>
            </div>

            {/* Bad Habits */}
            <div>
              <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
                <TrendingDown className="w-6 h-6" />
                Izvairīties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badHabits.map(habit => (
                  <HabitCard key={habit.id} habit={habit} isGood={false} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <WeekView />
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Dati tiek saglabāti tikai tavā ierīcē
        </div>
      </div>
    </div>
  );
}