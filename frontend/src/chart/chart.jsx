/*
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Функция для получения последних 7 дней, начиная с текущего
function getLastSevenDays() {
  const days = [];
  const today = new Date('2025-05-24'); // Текущая дата
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0]; // Формат YYYY-MM-DD
    days.unshift(formattedDate); // Добавляем в начало, чтобы сегодня был последним
  }
  return days;
}

// Компонент для построения диаграммы
function ListeningChart({ history }) {
  // Получаем статистику из функции
  const stats = getListeningStats(history);
  const dailyStats = stats.daily;

  // Получаем последние 7 дней
  const labels = getLastSevenDays();

  // Подготовка данных для диаграммы (время в минутах)
  const data = labels.map((day) => {
    const statsForDay = dailyStats[day] || { totalDuration: 0 };
    return (statsForDay.totalDuration / 60).toFixed(2); // Переводим секунды в минуты
  });

  // Конфигурация данных для Chart.js
  const chartData = {
    labels, // Метки: даты за последние 7 дней
    datasets: [
      {
        label: 'Время прослушивания (минуты)',
        data, // Данные: время в минутах
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Цвет столбцов
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Опции для диаграммы
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Время прослушивания за последние 7 дней',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Минуты',
        },
      },
      x: {
        title: {
          display: true,
          text: 'День',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

// Функция getListeningStats (взята из вашего кода)
function getListeningStats(history) {
  const dailyStats = {};
  const monthlyStats = {};
  const yearlyStats = {};
  const uniqueTracksPerDay = new Set();
  let previousDate = null;

  history.forEach((item) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const day = item.date;

    if (!dailyStats[day]) {
      dailyStats[day] = {
        totalTracks: 0,
        completedTracks: 0,
        totalDuration: 0,
      };
    }
    dailyStats[day].totalTracks++;
    dailyStats[day].totalDuration += item.duration_seconds;
    if (item.is_completed) {
      dailyStats[day].completedTracks++;
    }

    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        totalTracks: 0,
        completedTracks: 0,
        totalDuration: 0,
      };
    }
    monthlyStats[month].totalTracks++;
    monthlyStats[month].totalDuration += item.duration_seconds;
    if (item.is_completed) {
      monthlyStats[month].completedTracks++;
    }

    if (!yearlyStats[year]) {
      yearlyStats[year] = {
        totalTracks: 0,
        completedTracks: 0,
        totalDuration: 0,
      };
    }
    yearlyStats[year].totalTracks++;
    yearlyStats[year].totalDuration += item.duration_seconds;
    if (item.is_completed) {
      yearlyStats[year].completedTracks++;
    }

    if (day !== previousDate) {
      uniqueTracksPerDay.clear();
      previousDate = day;
    }
    uniqueTracksPerDay.add(item.track);
  });

  return {
    daily: dailyStats,
    monthly: monthlyStats,
    yearly: yearlyStats,
    uniqueTracksPerDay: uniqueTracksPerDay.size,
  };
}

export default ListeningChart;
*/