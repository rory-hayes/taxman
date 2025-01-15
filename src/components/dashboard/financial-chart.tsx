"use client"

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { CURRENCY_SYMBOL } from '@/lib/constants';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function FinancialChart() {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClientComponentClient();
      const { data: payslips, error } = await supabase
        .from('payslips')
        .select('*')
        .order('month', { ascending: true });

      if (error) {
        console.error('Error fetching payslips:', error);
        return;
      }

      if (!payslips?.length) {
        setIsLoading(false);
        return;
      }

      const labels = payslips.map(p => new Date(p.month).toLocaleDateString('default', { month: 'short', year: 'numeric' }));
      
      const data = {
        labels,
        datasets: [
          {
            label: 'Gross Pay',
            data: payslips.map(p => p.gross_pay || 0),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.3,
          },
          {
            label: 'Tax Paid',
            data: payslips.map(p => p.tax_paid || 0),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.3,
          },
          {
            label: 'Net Pay',
            data: payslips.map(p => p.net_pay || 0),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.3,
          },
        ],
      };

      setChartData(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `${CURRENCY_SYMBOL}${context.parsed.y.toFixed(2)}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `${CURRENCY_SYMBOL}${value}`;
          }
        }
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[400px]">Loading...</div>;
  }

  if (!chartData.labels?.length) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No financial data available. Upload some payslips to see your financial trends.
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <Line options={options} data={chartData} />
    </div>
  );
} 